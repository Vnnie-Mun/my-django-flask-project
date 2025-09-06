#!/bin/bash

# Innovators of Honour - Startup Script
echo "Starting Innovators of Honour Flask Application..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "Installing dependencies..."
pip install -r requirements.txt

# Create uploads directory if it doesn't exist
mkdir -p static/uploads

# Set environment variables
export FLASK_APP=app.py
export FLASK_ENV=development
export FLASK_DEBUG=1

# Run the application
echo "Starting Flask application..."
echo "Visit http://localhost:5000 to view the website"
python run.py