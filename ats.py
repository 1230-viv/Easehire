import logging
import base64
import ollama
from quart import Blueprint, jsonify
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from Employeedb import AsyncSessionLocal, Employee, Job  # ✅ Import Job model

logging.basicConfig(level=logging.INFO)

# ✅ Define Blueprint
ats_routes = Blueprint("ats_routes", __name__)

async def get_employee_data(employee_id):
    """Retrieve employee data from the database."""
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Employee).where(Employee.id == employee_id))
        employee = result.scalar_one_or_none()

        if not employee:
            logging.error(f"❌ Employee ID {employee_id} not found.")
            return None

        return employee  # ✅ Return the Employee object

def get_ats_score(pdf_bytes):
    """Send the PDF directly to Llama 3 for ATS scoring with a clear prompt."""
    try:
        pdf_base64 = base64.b64encode(pdf_bytes).decode("utf-8")  # ✅ Convert PDF to base64

        prompt = (
            "You are an AI specializing in resume evaluation. Below is a PDF file containing a candidate's resume. "
            "Analyze the resume and provide an ATS compatibility score (0-100) based on modern ATS standards. "
            "IMPORTANT: Only return the score as a number. No explanations.\n\n"
            f"[PDF Data (base64-encoded)]: {pdf_base64}\n\n"
            "Respond with ONLY a number from 0 to 100."
        )

        response = ollama.chat(model="llama3.2", messages=[{"role": "user", "content": prompt}])
        score = response['message']['content'].strip()

        try:
            score = float(score)  # ✅ Ensure numeric response
            if 0 <= score <= 100:
                return score
            else:
                raise ValueError("Score out of range")
        except ValueError:
            logging.error(f"❌ Invalid ATS score returned: {score}")
            return None
    except Exception as e:
        logging.error(f"❌ Error generating ATS score: {e}")
        return None
# hfg
@ats_routes.route("/evaluate-resume/<int:employee_id>", methods=["GET"])
async def evaluate_resume(employee_id):
    """Fetch ATS score and job ID from the database; if missing, generate and save it."""
    async with AsyncSessionLocal() as session:  # ✅ Ensure employee is fetched within the same session
        result = await session.execute(select(Employee).where(Employee.id == employee_id))
        employee = result.scalar_one_or_none()

        if not employee:
            return jsonify({"success": False, "message": "Employee not found"}), 404

        # ✅ Fetch the job ID associated with the employee
        job_result = await session.execute(select(Job.id).where(Job.id == employee.job_id))
        job = job_result.scalar_one_or_none()

        if not job:
            logging.error(f"❌ No job found for Employee ID {employee_id}")
            return jsonify({"success": False, "message": "No associated job found"}), 404

        job_id = job  # ✅ Extract job ID

        # ✅ If ATS score already exists, return it with the job_id
        if employee.ats_score is not None:
            logging.info(f"✅ ATS score found in database for Employee ID {employee_id}: {employee.ats_score}")
            return jsonify({
                "success": True,
                "employee_id": employee_id,
                "ats_score": employee.ats_score,
                "job_id": job_id
            })

        # 🛑 No ATS score found → Generate a new one
        if not employee.pdf_resume:
            return jsonify({"success": False, "message": "Resume not found"}), 404

        ats_score = get_ats_score(employee.pdf_resume)

        if ats_score is None:
            return jsonify({"success": False, "message": "Failed to generate ATS score"}), 500

        # ✅ Update ATS score inside the same session
        employee.ats_score = ats_score
        session.add(employee)  # 🛑 Explicitly add it to the session before commit
        await session.commit()

        logging.info(f"✅ Generated and saved ATS score {ats_score} for Employee ID {employee_id}")

        return jsonify({
            "success": True,
            "employee_id": employee_id,
            "ats_score": ats_score,
            "job_id": job_id
        })
