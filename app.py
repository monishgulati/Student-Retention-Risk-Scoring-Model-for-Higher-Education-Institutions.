from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

# =========================
# SAFE PATH LOADING
# =========================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model_path = os.path.join(BASE_DIR, "student_retention_model.pkl")
display_path = os.path.join(BASE_DIR, "display_student_data.csv")
encoded_path = os.path.join(BASE_DIR, "processed_student_data.csv")

# Load model
model = joblib.load(model_path)

# Load datasets
df_display = pd.read_csv(display_path)
df_encoded = pd.read_csv(encoded_path)

# =========================
# HOME ROUTE
# =========================
@app.route("/")
def home():
    return "Backend is working successfully!"

# =========================
# GET ALL STUDENTS (REAL DATA)
# =========================
@app.route("/students", methods=["GET"])
def get_students():
    return df_display.to_json(orient="records")

# =========================
# PREDICT USING STUDENT NAME
# =========================
@app.route("/predict", methods=["POST"])
def predict():

    data = request.json
    student_name = data["name"]

    # Find student in encoded dataset
    student_row = df_encoded[df_encoded["name"] == student_name]

    if student_row.empty:
        return jsonify({"error": "Student not found"})

    features = student_row[[
        'attendance',
        'avg_gpa',
        'has_backlog',
        'backlog_count',
        'event_score',
        'gender',
        'course',
        'year',
        'age'
    ]].values

    probability = model.predict_proba(features)[0][1]

    return jsonify({
        "probability": float(probability)
    })

# =========================
# RUN SERVER
# =========================
if __name__ == "__main__":
    app.run(debug=True)