#!/usr/bin/env python3
"""
Main application runner for Innovators of Honour website.
This file is used to run the Flask application in development.
"""

import os
from app import app, db
from config import config

# Set configuration based on environment
config_name = os.environ.get('FLASK_ENV', 'development')
app.config.from_object(config[config_name])

# Create database tables
with app.app_context():
    db.create_all()

if __name__ == '__main__':
    # Run the application
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)