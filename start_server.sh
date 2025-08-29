#!/bin/bash

# EaseHire Server Startup Script
echo "🚀 Starting EaseHire Application Server..."

# Navigate to project directory
cd /home/zoro/Documents/Easehire

# Activate virtual environment
source myenv/bin/activate

# Set environment variables (if needed)
export PYTHONPATH=$PYTHONPATH:/home/zoro/Documents/Easehire

# Start the server
echo "✅ Virtual environment activated"
echo "✅ Starting server on http://127.0.0.1:8000"
python3 app.py
