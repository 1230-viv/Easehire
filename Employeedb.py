import logging
import base64
from quart import Blueprint, request, jsonify
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, LargeBinary, select

# ✅ Configure logging
logging.basicConfig(level=logging.INFO)

# ✅ Async Database Engine
DATABASE_URL = "mysql+aiomysql://Admin:Easehire#1230@localhost/easehire"
engine = create_async_engine(DATABASE_URL, echo=True)  # Debugging, disable in production
AsyncSessionLocal = sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)

Base = declarative_base()

employee_routes = Blueprint("employee_routes", __name__)

# ✅ Employee Model (Storing PDF as BLOB)
class Employee(Base):
    __tablename__ = "employees"
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    phone_number = Column(String(20), nullable=False, unique=True)
    email = Column(String(255), nullable=False, unique=True)
    pdf_resume = Column(LargeBinary, nullable=False)  # Stores the resume as BLOB

# ✅ Function to Create Employee Tables
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logging.info("✅ Employee database tables initialized.")

# ✅ Add Employee Route (Handles PDF Upload)
@employee_routes.route("/add-employee", methods=["POST"])
async def add_employee():
    form = await request.form  # Get form data
    files = await request.files  # ✅ Properly await request.files
    file = files.get("pdf_resume")  # ✅ Fetch file

    if not file or not form.get("name") or not form.get("email") or not form.get("number"):
        return jsonify({"success": False, "message": "All fields are required"}), 400

    pdf_data = file.read()  # ❌ REMOVE `await` (because `file.read()` is NOT async)

    async with AsyncSessionLocal() as session:
        new_employee = Employee(
            name=form["name"],
            phone_number=form["number"],
            email=form["email"],
            pdf_resume=pdf_data,  # ✅ Store the binary PDF data
        )
        session.add(new_employee)
        await session.commit()
    
    return jsonify({"success": True, "message": "Employee added successfully!"}), 201



# ✅ Get All Employees Route (Encodes PDF as Base64)
@employee_routes.route("/employees", methods=["GET"])
async def get_employees():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Employee))
        employees = result.scalars().all()
        employees_list = [
            {
                "id": emp.id,
                "name": emp.name,
                "phone_number": emp.phone_number,
                "email": emp.email,
                "pdf_resume": base64.b64encode(emp.pdf_resume).decode("utf-8")  # Convert BLOB to Base64
            }
            for emp in employees
        ]
        return jsonify(employees_list), 200

# ✅ Get Employee Resume by ID (Returns PDF)
@employee_routes.route("/employee-resume/<int:employee_id>", methods=["GET"])
async def get_employee_resume(employee_id):
    async with AsyncSessionLocal() as session:
        employee = await session.get(Employee, employee_id)
        if not employee:
            return jsonify({"success": False, "message": "Employee not found"}), 404

        response = jsonify({"resume_pdf": base64.b64encode(employee.resume_pdf).decode("utf-8")})
        response.headers["Content-Disposition"] = f'attachment; filename="resume_{employee_id}.pdf"'
        return response, 200
