from flask import Flask, request, jsonify, send_file, send_from_directory
from flask_cors import CORS
import json
import random
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/')
def index():
    return jsonify({
        "message": "HealthEcho Cardiac Quiz Backend API",
        "status": "running",
        "endpoints": [
            "/api/questions",
            "/api/predict", 
            "/api/submit_results",
            "/mp4/<filename>",
            "/images/<filename>"
        ]
    })

@app.route('/mp4/<filename>')
def serve_video(filename):
    """Serve MP4 video files"""
    try:
        video_path = os.path.join('mp4', filename)
        if os.path.exists(video_path):
            return send_file(video_path, mimetype='video/mp4')
        else:
            return jsonify({"error": "Video not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/images/<filename>')
def serve_image(filename):
    """Serve cardiac phase images (sistole, diastole, etc.)"""
    try:
        # Check multiple possible image directories
        image_dirs = ['images', 'static/images', '.']
        
        for img_dir in image_dirs:
            image_path = os.path.join(img_dir, filename)
            if os.path.exists(image_path):
                # Determine MIME type based on file extension
                ext = filename.lower().split('.')[-1]
                mime_types = {
                    'jpg': 'image/jpeg',
                    'jpeg': 'image/jpeg', 
                    'png': 'image/png',
                    'gif': 'image/gif',
                    'bmp': 'image/bmp',
                    'webp': 'image/webp'
                }
                mimetype = mime_types.get(ext, 'image/jpeg')
                return send_file(image_path, mimetype=mimetype)
        
        return jsonify({"error": "Image not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/questions', methods=['GET'])
def get_questions():
    try:
        # Fallback questions for demo
        questions = [
            {
                "question": "Based on the echocardiogram, what is the left ventricular function?",
                "answers": ["Normal", "Reduced", "Abnormal"],
                "correct": "Normal",
                "videoUrl": "/mp4/0X100009310A3BD7FC.mp4",
                "metadata": {
                    "ESV": 45.0,
                    "EDV": 120.0,
                    "FrameHeight": 112,
                    "FrameWidth": 112,
                    "FPS": 50,
                    "NumberOfFrames": 30
                }
            },
            {
                "question": "Based on the echocardiogram, what is the left ventricular function?",
                "answers": ["Normal", "Reduced", "Abnormal"],
                "correct": "Reduced",
                "videoUrl": "/mp4/0X1002E8FBACD08477.mp4",
                "metadata": {
                    "ESV": 80.0,
                    "EDV": 130.0,
                    "FrameHeight": 112,
                    "FrameWidth": 112,
                    "FPS": 50,
                    "NumberOfFrames": 30
                }
            },
            {
                "question": "Based on the echocardiogram, what is the left ventricular function?",
                "answers": ["Normal", "Reduced", "Abnormal"],
                "correct": "Abnormal",
                "videoUrl": "/mp4/0X1005D03EED19C65B.mp4",
                "metadata": {
                    "ESV": 95.0,
                    "EDV": 140.0,
                    "FrameHeight": 112,
                    "FrameWidth": 112,
                    "FPS": 50,
                    "NumberOfFrames": 30
                }
            }
        ] * 5  # Create 15 questions by repeating
        
        return jsonify(questions)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        
        # Simple AI prediction logic based on ESV/EDV ratio
        esv = data.get("ESV", 50)
        edv = data.get("EDV", 120)
        
        if edv > 0:
            ef = ((edv - esv) / edv) * 100
            if ef >= 55:
                prediction = "Normal"
            elif ef >= 40:
                prediction = "Reduced"
            else:
                prediction = "Abnormal"
        else:
            # Fallback random prediction
            predictions = ["Normal", "Reduced", "Abnormal"]
            prediction = random.choice(predictions)
        
        return jsonify({"prediction": prediction})
        
    except Exception as e:
        # Fallback random prediction
        predictions = ["Normal", "Reduced", "Abnormal"]
        return jsonify({"prediction": random.choice(predictions)})

@app.route('/api/submit_results', methods=['POST'])
def submit_results():
    try:
        data = request.get_json()
        
        # Add timestamp to the results
        data['timestamp'] = datetime.now().isoformat()
        
        # Simple logging (in production you'd use a proper database)
        result_entry = {
            "user_score": data.get("user_score", 0),
            "ai_score": data.get("ai_score", 0),
            "total_questions": data.get("total_questions", 10),
            "timestamp": data['timestamp']
        }
        
        return jsonify({
            "status": "success",
            "message": "Results submitted successfully",
            "data": result_entry
        })
        
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
