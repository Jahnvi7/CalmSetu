# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import sqlite3

app = Flask(__name__)
CORS(app) 

# 🔑 Set your Gemini API key
genai.configure(api_key="AIzaSyCcql0DhPecLDiTaS3nFeZBJb8I85KYjuc")

# Load the Gemini model
model = genai.GenerativeModel("gemini-1.5-flash")

# ---- Gemini Chat Endpoint ----
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message", "")

        # Send message to Gemini
        response = model.generate_content(user_message)

        return jsonify({"reply": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---- SQLite Connection Helper ----
DB_PATH = r"C:\Users\User\AppData\Roaming\DBeaverData\workspace6\.metadata\sample-database-sqlite-1\Chinook.db"   # replace with actual path

def get_customers():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Customer LIMIT 10;")
    rows = cursor.fetchall()
    conn.close()
    return rows


# ---- SQLite API Endpoint ----
@app.route("/customers", methods=["GET"])
def customers():
    data = get_customers()
    return jsonify(data)


# ---- Run Flask App ----
if __name__ == "__main__":
    app.run("main:app", host="127.0.0.1", port=5500, reload=True)