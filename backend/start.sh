#!/bin/bash

echo "🚀 Starting TrackerNow Backend Server..."
echo "=================================="

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "❌ Virtual environment not found. Please run: python -m venv .venv"
    exit 1
fi

# Activate virtual environment
source .venv/bin/activate

# Start the server
echo "🌐 Starting server on http://localhost:8000"
echo "📚 API docs available at http://localhost:8000/docs"
echo "=================================="

uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
