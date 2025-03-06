import logging
import ollama
import asyncio
import json
import re
import docker
import tempfile
import os
from quart import Blueprint, jsonify, request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from Employeedb import AsyncSessionLocal, Employee
from database import Job  

logging.basicConfig(level=logging.INFO)

coding_routes = Blueprint("coding_routes", __name__)
OLLAMA_MODEL = "codellama"
client = docker.from_env()

LANGUAGE_CONFIG = {
    "python": {"image": "python:3.9", "command": ["python3", "/code/main.py"]},
    "javascript": {"image": "node:16", "command": ["node", "/code/main.js"]},
    "java": {"image": "openjdk:11", "command": ["/bin/sh", "-c", "javac /code/Main.java && java -cp /code Main"]},
    "cpp": {"image": "gcc:latest", "command": ["/bin/sh", "-c", "g++ /code/main.cpp -o /code/main && /code/main"]},
}

async def fetch_job_details(job_id):
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Job.title, Job.skills).where(Job.id == job_id))
        job_details = result.fetchone()
        return job_details if job_details else None

async def generate_coding_problem(job_title, job_skills):
    prompt = f"""
    **Generate a coding problem related to '{job_title}' requiring skills: {job_skills}**
    Return JSON ONLY with this format:
    {{
      "title": "Function Name",
      "description": "A clear problem statement.",
      "input_format": "Input details.",
      "output_format": "Output details.",
      "examples": [
        {{"input": "Example input", "output": "Expected output"}},
        {{"input": "Another input", "output": "Expected output"}}
      ],
      "constraints": ["Constraint 1", "Constraint 2"]
    }}
    """

    try:
        response = await asyncio.to_thread(
            ollama.chat,
            model=OLLAMA_MODEL,
            messages=[{"role": "user", "content": prompt}]
        )
        
        raw_text = response["message"]["content"].strip()
        json_match = re.search(r"\{(?:[^{}]|(?:\{[^{}]*\}))*\}", raw_text, re.DOTALL)
        if json_match:
            problem_json = json.loads(json_match.group(0))
            required_fields = {"title", "description", "input_format", "output_format", "examples", "constraints"}
            if required_fields.issubset(problem_json.keys()):
                return problem_json
    except Exception as e:
        logging.error(f"❌ Error generating coding problem: {e}")

    return None


@coding_routes.route('/generate-coding/<int:employee_id>/<int:job_id>', methods=['GET'])
async def generate_coding_api(employee_id, job_id):
    job_details = await fetch_job_details(job_id)
    if not job_details:
        return jsonify({"error": "Job not found"}), 404
    
    job_title, job_skills = job_details
    problem = await generate_coding_problem(job_title, job_skills)
    if not problem:
        return jsonify({"error": "Failed to generate coding problem"}), 500

    async with AsyncSessionLocal() as session:
        employee = await session.get(Employee, employee_id)
        if employee:
            employee.problem_statement = problem.get("description", "No problem description provided.")
            employee.question = json.dumps(problem)
            await session.commit()
    
    return jsonify({"problem": problem}), 200

async def execute_code_in_docker(language, code):
    """Executes the code inside a Docker container and returns the output"""
    with tempfile.TemporaryDirectory() as temp_dir:
        file_extension = {"python": "py", "javascript": "js", "java": "java", "cpp": "cpp"}[language]
        code_file = os.path.join(temp_dir, f"main.{file_extension}")

        with open(code_file, "w") as f:
            f.write(code)

        config = LANGUAGE_CONFIG[language]

        try:
            container = client.containers.run(
                config["image"],
                config["command"],
                volumes={temp_dir: {"bind": "/code", "mode": "rw"}},
                working_dir="/code",
                detach=True,
                network_disabled=True,
                mem_limit="256m",
                cpu_quota=50000
            )

            output = container.logs().decode("utf-8").strip()

            container.stop()  # Stop before removing
            container.remove()  # Remove container after execution

        except Exception as e:
            output = f"Execution Error: {str(e)}"

    return output


@coding_routes.route("/execute-code", methods=["POST"])
async def execute_code():
    """Handles code execution when 'Run Code' is clicked in Monaco Editor"""
    data = await request.get_json()
    employee_id = data.get("employeeId")
    language, code = data.get("language"), data.get("code")

    if language not in LANGUAGE_CONFIG:
        return jsonify({"error": "Unsupported language"}), 400

    output = await execute_code_in_docker(language, code)
    return jsonify({"output": output})


@coding_routes.route("/submit-code", methods=["POST"])
async def submit_code():
    """Handles code submission when 'Submit Code' is clicked"""
    data = await request.get_json()
    employee_id = data.get("employeeId")
    language, code = data.get("language"), data.get("code")

    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Employee.problem_statement).where(Employee.id == employee_id))
        job_data = result.fetchone()
    
    if not job_data or not job_data[0]:  
        return jsonify({"error": "Problem statement not found"}), 404
    
    problem_statement = job_data[0]

    validation_prompt = f"""
    Problem Statement: {problem_statement}
    Candidate's Code:
    ```
    {code}
    ```

    Does the candidate's code correctly solve the problem?
    Reply ONLY with "PASS" or "FAIL".
    """

    llama_response = await asyncio.to_thread(
        ollama.chat,
        model=OLLAMA_MODEL,
        messages=[{"role": "user", "content": validation_prompt}]
    )

    decision = llama_response["message"]["content"].strip().upper()
    if not re.match(r"^(PASS|FAIL)$", decision):
        decision = "FAIL"

    async with AsyncSessionLocal() as session:
        stmt = update(Employee).where(Employee.id == employee_id).values(code=code, code_result=decision)
        await session.execute(stmt)
        await session.commit()

    return jsonify({"message": "Code submitted successfully.", "status": decision})
