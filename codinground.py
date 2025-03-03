import logging
import ollama
import asyncio
import json
import re
import docker
import tempfile
import shutil
import os
from quart import Blueprint, jsonify, request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from Employeedb import AsyncSessionLocal, Employee
from database import Job  


logging.basicConfig(level=logging.INFO)

coding_routes = Blueprint("coding_routes", __name__)
OLLAMA_MODEL = "llama3.2"
client = docker.from_env()

LANGUAGE_CONFIG = {
    "python": {"image": "python:3.9", "command": "python3 /code/main.py"},
    "javascript": {"image": "node:16", "command": "node /code/main.js"},
    "java": {"image": "openjdk:11", "command": "javac /code/Main.java && java -cp /code Main"},
    "cpp": {"image": "gcc:latest", "command": "g++ /code/main.cpp -o /code/main && /code/main"},
}

async def fetch_job_details(job_id):
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Job.title, Job.skills).where(Job.id == job_id))
        job_details = result.fetchone()
        if not job_details:
            logging.error(f"❌ Job ID {job_id} not found.")
            return None, None
        return job_details

async def generate_coding_problem(job_title, job_skills):
    prompt = f"""
    Generate a real-world coding challenge related to the job title '{job_title}' and required skills: {job_skills}.
    
    **Ensure the response is STRICT JSON format, no markdown, no additional text.**
    
    Expected JSON format:
    {{
      "title": "Problem Title",
      "description": "Detailed problem statement...",
      "input_format": "Explanation of input...",
      "output_format": "Explanation of output...",
      "examples": [
        {{
          "input": "Example input...",
          "output": "Example output..."
        }}
      ],
      "constraints": ["List of constraints..."]
    }}
    """

    try:
        response = await asyncio.to_thread(
            ollama.chat,
            model=OLLAMA_MODEL,
            messages=[{"role": "user", "content": prompt}]
        )

        raw_text = response["message"]["content"].strip()
        logging.info(f"📜 Raw Ollama Response: {raw_text}")  

        json_match = re.search(r"\{(?:[^{}]|(?:\{[^{}]*\}))*\}", raw_text, re.DOTALL)
        
        if json_match:
            problem_data = json.loads(json_match.group(0))  
            return problem_data
        else:
            logging.error("❌ Could not extract JSON from Ollama response.")
            return None

    except json.JSONDecodeError as e:
        logging.error(f"❌ Failed to parse JSON response: {e}")
        return None
    except Exception as e:
        logging.error(f"❌ Error generating coding problem: {e}")
        return None

@coding_routes.route("/generate-coding/<int:job_id>", methods=["GET"])
async def generate_coding_api(job_id):
    job_title, job_skills = await fetch_job_details(job_id)

    if not job_title or not job_skills:
        return jsonify({"error": "Job not found or no skills available"}), 404

    logging.info(f"🚀 Generating Coding Problem for Job ID {job_id}: {job_title} | Skills: {job_skills}")
    problem = await generate_coding_problem(job_title, job_skills)

    if not problem:
        return jsonify({"error": "Failed to generate coding problem"}), 500

    return jsonify({"problem": problem}), 200

@coding_routes.route("/execute-code", methods=["POST"])
async def execute_code():
    data = await request.get_json()
    language, code = data.get("language"), data.get("code")

    if language not in LANGUAGE_CONFIG:
        return jsonify({"error": "Unsupported language"}), 400

    file_ext = {"python": "py", "javascript": "js", "java": "java", "cpp": "cpp"}
    temp_dir = tempfile.mkdtemp()
    code_path = f"{temp_dir}/main.{file_ext[language]}"

    try:
        with open(code_path, "w") as f:
            f.write(code)
        
        os.chmod(code_path, 0o755)

        container = client.containers.run(
            LANGUAGE_CONFIG[language]["image"],
            LANGUAGE_CONFIG[language]["command"],
            detach=True,
            remove=True,
            working_dir="/code",
            volumes={temp_dir: {"bind": "/code", "mode": "rw"}},
            mem_limit="128m",
            network_disabled=True,
            cpu_period=100000,
            cpu_quota=50000,
            pids_limit=10,
        )

        container.wait()
        output = container.logs().decode("utf-8")

        return jsonify({"output": output})

    except docker.errors.ContainerError as e:
        return jsonify({"error": f"Container Error: {e}"})
    except Exception as e:
        logging.error(f"❌ Execution Error: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        shutil.rmtree(temp_dir, ignore_errors=True)
