import logging
import base64
from quart import Blueprint, request, jsonify
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base, relationship
from sqlalchemy import Column, Integer, String, ForeignKey, select,Text
from sqlalchemy.dialects.mysql import LONGBLOB

# ✅ Configure logging
logging.basicConfig(level=logging.INFO)

# ✅ Async Database Engine
DATABASE_URL = "mysql+aiomysql://Admin:Easehire#1230@localhost/easehire"
engine = create_async_engine(DATABASE_URL, echo=True)  # Debugging, disable in production
AsyncSessionLocal = sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)

Base = declarative_base()

# ✅ Define Blueprint
employee_routes = Blueprint("employee_routes", __name__)

# ✅ Job Model (Ensuring Jobs Exist)
class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)

# ✅ Employee Model (Now Includes MCQ Score)
class Employee(Base):
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    phone_number = Column(String(20), nullable=False, unique=True)
    email = Column(String(255), nullable=False, unique=True)
    pdf_resume = Column(LONGBLOB, nullable=False)
    job_id = Column(Integer, ForeignKey("jobs.id"), nullable=False)
    ats_score = Column(String(10), nullable=True)
    mcq_score = Column(Integer, nullable=True)
    problem_statement = Column(Text, nullable=True) 
    question = Column(Text, nullable=True) 
    code = Column(Text, nullable=True) 
    code_result = Column(String(50), nullable=True)
# ✅ Create Tables
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logging.info("✅ Employee & Job database tables initialized.")

# ✅ Add Employee Route
@employee_routes.route("/add-employee", methods=["POST"])
async def add_employee():
    form = await request.form  
    files = await request.files  
    file = files.get("pdf_resume")  

    job_id = form.get("job_id")  # Get job_id from form data

    logging.info(f"📩 Received Data: {dict(form)}, Files: {files.keys()}")

    if not file or not form.get("name") or not form.get("phone_number") or not form.get("email") or not job_id:
        logging.error("❌ Missing required fields")
        return jsonify({"success": False, "message": "All fields (including job_id) are required"}), 400

    try:
        job_id = int(job_id)
    except ValueError:
        logging.error("❌ job_id is not a valid integer")
        return jsonify({"success": False, "message": "Invalid job_id format. Must be an integer."}), 400

    pdf_data = file.read()

    async with AsyncSessionLocal() as session:
        job_exists = await session.execute(select(Job).filter(Job.id == job_id))
        job = job_exists.scalar_one_or_none()

        if not job:
            logging.error(f"❌ Invalid job_id: {job_id}")
            return jsonify({"success": False, "message": f"Invalid job_id: {job_id}. Job not found."}), 400

        try:
            new_employee = Employee(
                name=form["name"],
                phone_number=form["phone_number"],
                email=form["email"],
                pdf_resume=pdf_data,
                job_id=job_id
            )
            session.add(new_employee)
            await session.commit()
            logging.info(f"✅ Employee {form['name']} added successfully for Job ID {job_id}")

            return jsonify({
                "success": True,
                "message": "Employee added successfully!",
                "employee_id": new_employee.id  
            }), 201
        except Exception as e:
            logging.error(f"❌ Database error: {str(e)}")
            return jsonify({"success": False, "message": "Internal database error"}), 500

# ✅ Get Employees with Job Info (Now Includes MCQ Score)
@employee_routes.route("/employees", methods=["GET"])
async def get_employees():
    async with AsyncSessionLocal() as session:
        result = await session.execute(
            select(Employee.id, Employee.name, Employee.phone_number, Employee.email, Employee.pdf_resume, 
                   Employee.job_id, Job.title, Employee.mcq_score)  # ✅ Include MCQ score
            .join(Job, Employee.job_id == Job.id)
        )
        employees = result.all()

        employees_list = [
            {
                "id": emp.id,
                "name": emp.name,
                "phone_number": emp.phone_number,
                "email": emp.email,
                "pdf_resume": base64.b64encode(emp.pdf_resume).decode("utf-8"),
                "job_id": emp.job_id,
                "job_title": emp.title,
                "mcq_score": emp.mcq_score  # ✅ Include MCQ score in response
            }
            for emp in employees
        ]
        return jsonify(employees_list), 200

# ✅ Update MCQ Score for an Employee
@employee_routes.route("/update-mcq-score/<int:employee_id>", methods=["POST"])
async def update_mcq_score(employee_id):
    """API to update MCQ score for an employee."""
    data = await request.get_json()
    mcq_score = data.get("mcq_score")

    if mcq_score is None:
        return jsonify({"success": False, "message": "MCQ score is required"}), 400

    async with AsyncSessionLocal() as session:
        employee = await session.get(Employee, employee_id)

        if not employee:
            return jsonify({"success": False, "message": "Employee not found"}), 404

        try:
            employee.mcq_score = mcq_score  # ✅ Update MCQ score
            await session.commit()

            return jsonify({"success": True, "message": "MCQ score updated successfully!"}), 200
        except Exception as e:
            logging.error(f"❌ Error updating MCQ score: {e}")
            return jsonify({"success": False, "message": "Failed to update MCQ score"}), 500

# ✅ Delete Employee
@employee_routes.route("/delete-employee/<int:employee_id>", methods=["DELETE"])
async def delete_employee(employee_id):
    async with AsyncSessionLocal() as session:
        employee = await session.get(Employee, employee_id)
        
        if not employee:
            return jsonify({"success": False, "message": "Employee not found"}), 404
        
        await session.delete(employee)
        await session.commit()

    return jsonify({"success": True, "message": "Employee deleted successfully!"}), 200

# ✅ Get Employee Resume as Base64
@employee_routes.route("/employee-resume/<int:employee_id>", methods=["GET"])
async def get_employee_resume(employee_id):
    async with AsyncSessionLocal() as session:
        employee = await session.get(Employee, employee_id)
        
        if not employee or not employee.pdf_resume:
            return jsonify({"success": False, "message": "Employee or PDF not found"}), 404

        try:
            pdf_base64 = base64.b64encode(employee.pdf_resume).decode("utf-8")
            return jsonify({"resume_pdf": pdf_base64, "employee_id": employee_id}), 200
        
        except Exception as e:
            logging.error(f"Error fetching PDF: {str(e)}")
            return jsonify({"success": False, "message": "Internal Server Error"}), 500
