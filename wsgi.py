#!/usr/bin/env python3
"""
WSGI configuration for Innovators of Honour website.
This file is used for deployment on PythonAnywhere and other WSGI servers.
"""

import sys
import os

# Add your project directory to the sys.path
path = '/home/yourusername/Innovators of honour'  # Update this path for PythonAnywhere
if path not in sys.path:
    sys.path.append(path)

from app import app as application

if __name__ == "__main__":
    application.run()