import logging
from quart import Blueprint, request, jsonify
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy import Column, Integer, String, Text, select

# ✅ Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ✅ Async Database Engine
DATABASE_URL = "mysql+aiomysql://Admin:Easehire#1230@localhost/easehire"
engine = create_async_engine(DATABASE_URL, echo=True)  # Debugging, disable in production
AsyncSessionLocal = sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)

Base = declarative_base()

routes = Blueprint("routes", __name__)

# ✅ Job Model (Fixed tablename issue)
class Job(Base):
    __tablename__ = "jobs"  # Fixed tablename definition
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
    logger.info("Database tables initialized.")

# ✅ Add Job Route with Improved Error Handling
@routes.route("/add-job", methods=["POST"])
async def add_job():
    try:
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
    except Exception as e:
        logger.error(f"Error adding job: {e}")
        return jsonify({"success": False, "message": "Failed to add job."}), 500

# ✅ Get All Jobs Route
@routes.route("/jobs", methods=["GET"])
async def get_jobs():
    try:
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
    except Exception as e:
        logger.error(f"Error fetching jobs: {e}")
        return jsonify({"success": False, "message": "Failed to fetch jobs."}), 500

# ✅ Delete Job Route with Improved Error Handling
@routes.route("/delete-job/<int:job_id>", methods=["DELETE"])
async def delete_job(job_id):
    try:
        async with AsyncSessionLocal() as session:
            job = await session.get(Job, job_id)
            if not job:
                return jsonify({"success": False, "message": "Job not found"}), 404
            await session.delete(job)
            await session.commit()
            return jsonify({"success": True, "message": "Job deleted successfully!"}), 200
    except Exception as e:
        logger.error(f"Error deleting job: {e}")
        return jsonify({"success": False, "message": "Failed to delete job."}), 500
