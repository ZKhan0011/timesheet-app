# FDM Timesheet App

A full-stack timesheet application for the FDM consulting company. It features a React frontend (using Vite) and a Django REST API backend.

## Prerequisites

- **Node.js** (v16+)
- **Python** (v3.10+)

## Quick Start Setup

Because this is a full-stack project, you need to run **two separate servers** concurrently: the Django backend API, and the React frontend development server.

### 1. Backend Setup (Django)

In your first terminal, set up and run the Django backend:

```bash
# Move into the backend folder
cd backend

# (Optional but recommended) Create and activate a virtual environment
# python -m venv venv
# venv\Scripts\activate  (Windows)
# source venv/bin/activate (Mac/Linux)

# Install the Python dependencies
pip install -r requirements.txt

# Run migrations to create your local database 
python manage.py migrate

# Seed the database with the initial project and time entry mock data
python manage.py seed_data

# Start the Django development server
python manage.py runserver
```

The Django API should now be running on `http://localhost:8000/api/`.

### 2. Frontend Setup (React/Vite)

Open a **second, separate terminal** in the root of the project:

```bash
# Install Node dependencies
npm install

# Start the Vite development server
npm run dev
```

The frontend will run on `http://localhost:5173/`. 
*Note: Vite is configured to automatically proxy all API requests starting with `/api/` directly to the Django backend running on port 8000.*

## Login Credentials

To explore the frontend, you can use one of the following mock accounts (Password for all is `password`):

- **Consultant:** Username `consultant`
- **Manager:** Username `manager`
- **Payroll:** Username `payroll`
- **Admin:** Username `admin`
