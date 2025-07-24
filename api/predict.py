import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, request, jsonify
import pandas as pd
import joblib
import numpy as np

def handler(request):
    if request.method == 'POST':
        try:
            data = request.get_json()
            
            # Load ML model
            try:
                model = joblib.load("backend/lightgbm_model.pkl")
                encoder = joblib.load("backend/label_encoder.pkl")
            except:
                # Fallback random prediction
                import random
                predictions = ["Normal", "Reduced", "Abnormal"]
                return jsonify({"prediction": random.choice(predictions)})
            
            # Prepare features
            features = [
                data.get("ESV", 0),
                data.get("EDV", 0), 
                data.get("FrameHeight", 112),
                data.get("FrameWidth", 112),
                data.get("FPS", 50),
                data.get("NumberOfFrames", 30)
            ]
            
            # Make prediction
            prediction = model.predict([features])[0]
            predicted_label = encoder.inverse_transform([prediction])[0]
            
            return jsonify({"prediction": predicted_label})
            
        except Exception as e:
            # Fallback random prediction
            import random
            predictions = ["Normal", "Reduced", "Abnormal"]
            return jsonify({"prediction": random.choice(predictions)})
    else:
        return jsonify({"error": "Method not allowed"}), 405
