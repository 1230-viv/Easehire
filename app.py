import logging
import asyncio
from quart import Quart, request
from quart_cors import cors  
import hypercorn.asyncio
import hypercorn.config
from loginAuthentication import auth_bp  
from database import create_tables as create_job_tables, routes
from Employeedb import create_tables as create_employee_tables, employee_routes
from ats import ats_routes  
from mcq import mcq_routes  
from codinground import coding_routes  

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
app.register_blueprint(employee_routes)  
app.register_blueprint(ats_routes)  
app.register_blueprint(mcq_routes)  
app.register_blueprint(coding_routes, url_prefix="/coding")  

# ✅ CORS Preflight Handler for OPTIONS Requests
@app.route("/<path:dummy>", methods=["OPTIONS"])
async def preflight_handler(dummy):
    response = app.response_class("", status=204)  # ❌ Removed `await`
    response.headers["Access-Control-Allow-Origin"] = ",".join(allowed_origins)
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

# ✅ Print registered routes for debugging
print("✅ Registered Routes:")
for rule in app.url_map.iter_rules():
    print(rule)

# ✅ Initialize Database on Startup
@app.before_serving
async def startup():
    await create_job_tables()  
    await create_employee_tables()  
    logging.info("✅ All database tables initialized.")


# ✅ Run ASGI Server with Hypercorn
if __name__ == "__main__":
    config = hypercorn.config.Config()
    config.bind = ["127.0.0.1:5000"]  
    asyncio.run(hypercorn.asyncio.serve(app, config))  
