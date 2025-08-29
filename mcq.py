import logging
import ollama
import asyncio
import json
import re
from quart import Blueprint, jsonify, request
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from Employeedb import AsyncSessionLocal, Employee
from database import Job
from llm_service import llm_service  # ✅ Import new LLM service
# gfvdd
# ✅ Configure logging
logging.basicConfig(level=logging.INFO)

# ✅ Blueprint for MCQ routes
mcq_routes = Blueprint("mcq_routes", __name__)

# ✅ Ollama Model
OLLAMA_MODEL = "llama3.2"

async def fetch_job_details(job_id):
    """Fetch job title and skills from the database based on job_id."""
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Job.title, Job.skills).where(Job.id == job_id))
        job_details = result.fetchone()

        if not job_details:
            logging.error(f"❌ Job ID {job_id} not found in the database.")
            return None, None

        job_title, job_skills = job_details
        return job_title, job_skills

async def generate_mcqs(job_title, job_skills):
    """Generate 10 MCQs using improved LLM service based on job title & skills."""
    try:
        # Convert skills to list if it's a string
        if isinstance(job_skills, str):
            skills_list = [skill.strip() for skill in job_skills.split(',')]
        else:
            skills_list = job_skills
            
        # Use the new LLM service
        mcqs = await llm_service.generate_mcqs(job_title, skills_list, count=10)
        
        if mcqs:
            logging.info(f"✅ Generated {len(mcqs)} MCQs successfully")
            return mcqs
        else:
            logging.error("❌ LLM service failed to generate MCQs")
            return []
            
    except Exception as e:
        logging.error(f"❌ Error generating MCQs: {e}")
        return []

@mcq_routes.route("/generate-mcq/<int:job_id>", methods=["GET"])
async def generate_mcq_api(job_id):
    """API to generate MCQs based on job_id."""
    job_title, job_skills = await fetch_job_details(job_id)

    if not job_title or not job_skills:
        return jsonify({"error": "Job not found or no skills available"}), 404

    logging.info(f"🚀 Generating MCQs for Job ID {job_id}: {job_title} | Skills: {job_skills}")
    mcqs = await generate_mcqs(job_title, job_skills)

    if not mcqs:
        return jsonify({"error": "Failed to generate MCQs"}), 500

    return jsonify({"mcqs": mcqs}), 200

@mcq_routes.route("/submit-mcq/<int:employee_id>/<int:job_id>", methods=["POST"])
async def submit_mcq_api(employee_id, job_id):
    """API to store MCQ results in the Employee table."""
    try:
        data = await request.get_json()
        logging.info(f"📥 Received Data for Employee {employee_id}, Job {job_id}: {data}")

        if "score" not in data:
            logging.error("❌ MCQ score missing in request body.")
            return jsonify({"error": "MCQ score is required"}), 400

        mcq_score = int(data["score"])
        logging.info(f"🟢 Storing Score {mcq_score} for Employee ID {employee_id}")

        async with AsyncSessionLocal() as session:
            employee = await session.get(Employee, employee_id)

            if not employee:
                logging.error(f"❌ Employee {employee_id} not found.")
                return jsonify({"error": "Employee not found"}), 404

            logging.info(f"🔹 BEFORE UPDATE: Employee {employee_id} Score = {employee.mcq_score}")

            # ✅ Update MCQ score
            employee.mcq_score = mcq_score
            session.add(employee)
            await session.commit()
            await session.refresh(employee)

            logging.info(f"✅ AFTER UPDATE: Employee {employee_id} Score = {employee.mcq_score}")
            return jsonify({"message": "Score updated successfully"}), 200

    except Exception as e:
        logging.error(f"❌ Error updating MCQ score: {e}")
        return jsonify({"error": "Failed to update MCQ score"}), 500
