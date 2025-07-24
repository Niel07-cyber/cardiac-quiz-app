from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return jsonify({
        "message": "HealthEcho Cardiac Quiz API",
        "status": "running",
        "endpoints": [
            "/api/questions",
            "/api/predict", 
            "/api/submit_results"
        ]
    })

# Export the Flask app for Vercel
def handler(request):
    return app
