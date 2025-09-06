# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import hashlib
import uuid
import google.generativeai as genai

app = Flask(__name__)
CORS(app)

# ---- Gemini API Setup ----
# 🔑 Replace with your real Gemini API key
genai.configure(api_key="YOUR_GEMINI_API_KEY")
model = genai.GenerativeModel("gemini-1.5-flash")

# ---- SQLite Database ----
DB_PATH = r"calmsetu.db"  # SQLite file in your project folder

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    # Users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL
        );
    """)
    conn.commit()
    conn.close()

init_db()

# ---- Helper Functions ----
def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

def check_password(password, hashed):
    return hashlib.sha256(password.encode()).hexdigest() == hashed

# ---- Register Endpoint ----
@app.route("/register", methods=["POST"])
def register():
    try:
        data = request.get_json()
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")

        if not all([name, email, password]):
            return jsonify({"error": "All fields are required"}), 400

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
                       (name, email, hash_password(password)))
        conn.commit()
        conn.close()
        return jsonify({"success": True, "message": "User registered successfully!"})

    except sqlite3.IntegrityError:
        return jsonify({"error": "Email already exists"}), 409
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---- Login Endpoint ----
@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        email = data.get("email")
        password = data.get("password")

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, password FROM users WHERE email=?", (email,))
        user = cursor.fetchone()
        conn.close()

        if not user:
            return jsonify({"error": "Invalid email or password"}), 401

        user_id, name, hashed = user
        if not check_password(password, hashed):
            return jsonify({"error": "Invalid email or password"}), 401

        # Generate a simple token (UUID)
        token = str(uuid.uuid4())
        return jsonify({"success": True, "token": token, "name": name})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---- Gemini Chat Endpoint ----
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        user_message = data.get("message", "")
        if not user_message:
            return jsonify({"reply": "Please say something first."})

        response = model.generate_content(user_message)
        return jsonify({"reply": response.text})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---- Run Flask App ----
if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5500, debug=True)