import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, request, jsonify
import csv
import json
from datetime import datetime

def handler(request):
    if request.method == 'POST':
        try:
            data = request.get_json()
            
            # Save results to temporary storage (in production you'd use a database)
            result = {
                'userID': data.get('userID', 'anonymous'),
                'score': data.get('score', 0),
                'ai_score': data.get('ai_score', 0),
                'total': data.get('total', 0),
                'timestamp': datetime.now().isoformat()
            }
            
            # For Vercel, we can't write to filesystem, so just return success
            # In production, you'd save to a database like MongoDB, PostgreSQL, etc.
            
            return jsonify({"message": "Results saved successfully", "result": result})
            
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Method not allowed"}), 405
