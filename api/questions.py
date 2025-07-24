import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from flask import Flask, request, jsonify
from backend.API_server_original import get_questions
import pandas as pd
import json

def handler(request):
    if request.method == 'GET':
        try:
            # Load questions data
            if os.path.exists("backend/FileList.csv"):
                df = pd.read_csv("backend/FileList.csv")
                df = df[pd.to_numeric(df["EF"], errors="coerce").notnull()]
                sampled = df.sample(n=min(15, len(df)))

                def get_label_from_value(ef):
                    try:
                        ef_value = float(ef)
                        if ef_value >= 55:
                            return "Normal"
                        elif ef_value >= 40:
                            return "Reduced"
                        else:
                            return "Abnormal"
                    except:
                        return "Abnormal"

                questions = []
                for _, row in sampled.iterrows():
                    video_url = f"/api/videos/{row['FileName']}"
                    questions.append({
                        "question": "Based on the echocardiogram, what is the left ventricular function?",
                        "answers": ["Normal", "Reduced", "Abnormal"],
                        "correct": get_label_from_value(row["EF"]),
                        "videoUrl": video_url,
                        "metadata": {
                            "ESV": float(row.get("ESV", 0)),
                            "EDV": float(row.get("EDV", 0)),
                            "FrameHeight": int(row.get("FrameHeight", 112)),
                            "FrameWidth": int(row.get("FrameWidth", 112)),
                            "FPS": int(row.get("FPS", 50)),
                            "NumberOfFrames": int(row.get("NumberOfFrames", 30))
                        }
                    })
                return jsonify(questions)
            else:
                # Fallback questions
                return jsonify([])
        except Exception as e:
            return jsonify({"error": str(e)}), 500
    else:
        return jsonify({"error": "Method not allowed"}), 405
