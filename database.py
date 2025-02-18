import logging
from quart import Blueprint, request, jsonify
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, Text, select

# ✅ Configure logging
logging.basicConfig(level=logging.INFO)

# ✅ Async Database Engine
DATABASE_URL = "mysql+aiomysql://Admin:Easehire#1230@localhost/easehire"
engine = create_async_engine(DATABASE_URL, echo=True)  # Debugging, disable in production
AsyncSessionLocal = sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)

Base = declarative_base()

routes = Blueprint("routes", __name__)

# ✅ Job Model (Updated)
class Job(Base):
    __tablename__ = "jobs"
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    type = Column(String(50), nullable=False)
    location = Column(String(255), nullable=False)
    skills = Column(Text, nullable=False)
    description = Column(Text, nullable=False)

# ✅ Function to Create Tables Asynchronously
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    logging.info("Database tables initialized.")

# ✅ Add Job Route
@routes.route("/add-job", methods=["POST"])
async def add_job():
    data = await request.json
    async with AsyncSessionLocal() as session:
        new_job = Job(
            title=data.get("jobTitle"),
            type=data.get("jobType"),
            location=data.get("location"),
            skills=data.get("skills"),
            description=data.get("jobDescription"),
        )
        session.add(new_job)
        await session.commit()
        return jsonify({"success": True, "message": "Job added successfully!"}), 201

# ✅ Get All Jobs Route
@routes.route("/jobs", methods=["GET"])
async def get_jobs():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Job))
        jobs = result.scalars().all()
        jobs_list = [
            {
                "id": job.id,
                "title": job.title,
                "type": job.type,
                "location": job.location,
                "skills": job.skills,
                "description": job.description,
            }
            for job in jobs
        ]
        return jsonify(jobs_list), 200

# ✅ Delete Job Route
@routes.route("/delete-job/<int:job_id>", methods=["DELETE"])
async def delete_job(job_id):
    async with AsyncSessionLocal() as session:
        job = await session.get(Job, job_id)
        if not job:
            return jsonify({"success": False, "message": "Job not found"}), 404
        await session.delete(job)
        await session.commit()
        return jsonify({"success": True, "message": "Job deleted successfully!"}), 200
