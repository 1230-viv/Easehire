import logging
import asyncio
from quart import Quart
from quart_cors import cors  
import hypercorn.asyncio
import hypercorn.config
from loginAuthentication import auth_bp  
from database import create_tables as create_job_tables, routes
from Employeedb import create_tables as create_employee_tables, employee_routes
from ats import ats_routes  # ✅ Import ATS Blueprint
from mcq import mcq_routes  # ✅ Import MCQ Routes
from codinground import coding_routes  # ✅ Import Coding Round Routes

# ✅ Initialize Quart App
app = Quart(__name__)

# ✅ CORS Configuration
allowed_origins = [
    "http://localhost:3000",        
    "http://10.180.173.101:3000",  
    "http://10.180.173.102:3000",  
    "http://10.180.173.103:3000",  
]

app = cors(app, allow_origin=allowed_origins, allow_credentials=True)

# ✅ Register Blueprints (Routes)
app.register_blueprint(auth_bp)  
app.register_blueprint(routes)
app.register_blueprint(employee_routes)  # Employee-related Routes
app.register_blueprint(ats_routes)  # ✅ Register ATS Routes
app.register_blueprint(mcq_routes)
app.register_blueprint(coding_routes)  

# ✅ Initialize Database on Startup
@app.before_serving
async def startup():
    await create_job_tables()  # Initialize Job Tables
    await create_employee_tables()  # Initialize Employee Tables
    logging.info("✅ All database tables initialized.")

# ✅ Run ASGI Server with Hypercorn
if __name__ == "__main__":
    config = hypercorn.config.Config()
    config.bind = ["127.0.0.1:5000"]  # Use a different port

    # ✅ Fix: Use get_event_loop() instead of asyncio.run()
    loop = asyncio.get_event_loop()
    loop.run_until_complete(hypercorn.asyncio.serve(app, config))
