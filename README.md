# Campus Food Ordering & Recommendation System

## Overview
A dynamic web-based system for college hostellers to order food and receive personalised recommendations using machine learning.

## Tech Stack
- **Frontend**: React (Vite)
- **Backend**: Node.js + Express
- **ML Service**: Python + Flask + Scikit-learn

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- Python (v3.8+)

### 1. Backend Setup
```bash
cd backend
npm install
node server.js
```
*Runs on http://localhost:5000*

### 2. ML Service Setup
```bash
cd ml-service
pip install -r requirements.txt
# Run using your python executable (e.g., python, py, or full path)
python app.py
```
*Runs on http://localhost:5001*

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
*Runs on http://localhost:3000* (or similar port shown in terminal)

## Features
- **Login/Signup**: Mock authentication with preference collection.
- **Dashboard**: Personalised food recommendations.
- **Restaurant Page**: Menu and cart functionality.
- **Ordering**: Place orders for delivery to your hostel floor.
- **ML Recommendations**: Content-based filtering based on your preferences.

## API Endpoints (Backend)
- `GET /api/foods`: List all foods
- `POST /api/orders`: Place order
- `POST /api/recommendations`: Get ML recommendations (proxied to Python service)

## Notes
- Data is in-memory and resets on server restart.
- ML service uses a dummy dataset and simple TF-IDF/rule-based logic.
