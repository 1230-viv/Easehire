import jwt
import bcrypt
import datetime
from quart import Blueprint, request, jsonify
from quart_cors import cors

SECRET_KEY = "your_secret_key"
ADMIN_USERNAME = "admin"
ADMIN_PASSWORD_HASH = "$2b$12$8ALCMNjrTOQyqfABa3ShXe9K/FvN.owpIxOiHQ9Z0xYZxHqWdOUf2"  # Use a valid bcrypt hash

auth_bp = Blueprint("auth", __name__)

# Login Route
@auth_bp.route("/login", methods=["POST"])
async def login():
    data = await request.get_json()
    username, password = data.get("username"), data.get("password")

    if username == ADMIN_USERNAME and bcrypt.checkpw(password.encode(), ADMIN_PASSWORD_HASH.encode()):
        # Create the JWT token
        token = jwt.encode(
            {"user": username, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)},
            SECRET_KEY, algorithm="HS256"
        )
        return jsonify({"token": token})

    return jsonify({"error": "Invalid credentials"}), 401
# hnghbgfv
# Protected Route
@auth_bp.route("/protected", methods=["GET"])
async def protected():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"error": "Missing token"}), 401

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return jsonify({"message": f"Welcome, Admin!"})
    except jwt.ExpiredSignatureError:
        return jsonify({"error": "Token expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"error": "Invalid token"}), 401

# Setup Quart app with CORS enabled
from quart import Quart
from quart_cors import cors

app = Quart(__name__)

allowed_origins = [
    "http://localhost:3000",        # For local development (if you still need it)
    "http://10.180.173.101:3000",      # Your React app's origin (EXACT MATCH!)
    "http://10.180.173.102:3000",      # Add other clients as needed
    "http://10.180.173.103:3000",      # Add other clients as needed
    # ... any other client IPs
]

app = cors(app, allow_origin=allowed_origins, allow_credentials=True) # If needed

app = cors(app, allow_origin=allowed_origins)
app.register_blueprint(auth_bp)

if __name__ == "__main__":
    app.run(debug=True)
