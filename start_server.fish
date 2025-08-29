#!/usr/bin/env fish

# EaseHire Server Startup Script for Fish Shell
echo "🚀 Starting EaseHire Application Server..."

# Navigate to project directory
cd /home/zoro/Documents/Easehire

# Activate virtual environment (Fish shell)
source myenv/bin/activate.fish

# Set environment variables (if needed)
set -x PYTHONPATH $PYTHONPATH:/home/zoro/Documents/Easehire

# Start the server
echo "✅ Virtual environment activated"
echo "✅ Starting server on http://127.0.0.1:8000"
python3 app.py
