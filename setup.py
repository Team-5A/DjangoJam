# run this script to setup the project and conda virtual environment
# if setup script fails, running again usually fixes the problem

import os

# Create a conda virtual environment
exit_code = os.system("conda create -n djangojam python=3.9")
if exit_code != 0:
    print("Error creating conda virtual environment. Are you sure you're in a conda environment?")
    exit(1)

print("Conda virtual environment created successfully.")

# Activate the conda virtual environment
exit_code = os.system("conda activate djangojam")
if exit_code != 0:
    print("Error activating conda virtual environment. Are you sure you're in a conda environment?")
    exit(1)

print("Conda virtual environment activated successfully.")

# Install the required packages
exit_code = os.system("pip install -r requirements.txt")
if exit_code != 0:
    print("Error installing required packages.")
    exit(1)

print("Required packages installed successfully.")

# Create the database
exit_code = os.system("python manage.py migrate")
if exit_code != 0:
    print("Error creating the database.")
    exit(1)

print("Database created successfully.")
