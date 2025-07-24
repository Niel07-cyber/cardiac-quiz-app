import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, request, jsonify
import json

def handler(request):
    if request.method == 'GET':
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
    else:
        return jsonify({"error": "Method not allowed"}), 405
