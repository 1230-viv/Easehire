import logging
from quart import Quart
from quart_cors import cors  
from loginAuthentication import auth_bp  
from database import create_tables, routes

app = Quart(__name__)
app = cors(app, allow_origin="http://localhost:3000")

# ✅ Register blueprints
app.register_blueprint(auth_bp)  
app.register_blueprint(routes)

# ✅ Initialize Database on Startup
@app.before_serving
async def startup():
    await create_tables()
    logging.info("Database tables initialized.")

# ✅ ASGI Server with Hypercorn (No `asyncio.run()`)
if __name__ == "__main__":
    import hypercorn.asyncio
    import asyncio

    config = hypercorn.Config()
    config.bind = ["127.0.0.1:5000"]  # Run on localhost

    asyncio.run(hypercorn.asyncio.serve(app, config))
