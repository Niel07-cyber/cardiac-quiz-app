import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, request, jsonify
import random

def handler(request):
    if request.method == 'POST':
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
    else:
        return jsonify({"error": "Method not allowed"}), 405
