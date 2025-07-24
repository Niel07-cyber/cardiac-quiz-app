# HealthEcho Cardiac Quiz Backend

A Flask API backend for the HealthEcho cardiac quiz application.

## Endpoints

- `GET /` - API status
- `GET /api/questions` - Get quiz questions
- `POST /api/predict` - AI prediction for cardiac function
- `POST /api/submit_results` - Submit quiz results

## Deploy to Render

1. Create a new Web Service on Render
2. Connect this repository
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `gunicorn app:app`
5. Set environment: Python 3

## Environment Variables

No environment variables required for basic functionality.
