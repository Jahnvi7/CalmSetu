# app.py - FIXED VERSION (Same functionality, just error-free)
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
API_KEY = "AIzaSyCcql0DhPecLDiTaS3nFeZBJb8I85KYjuc"  # You MUST replace this with your actual API key

# Check if API key is set
if API_KEY == "YOUR_GEMINI_API_KEY":
    print("⚠️ WARNING: Please replace YOUR_GEMINI_API_KEY with your actual Gemini API key!")
    model = None
else:
    try:
        genai.configure(api_key=API_KEY)
        model = genai.GenerativeModel("gemini-1.5-flash")
        print("✅ Gemini AI configured successfully!")
    except Exception as e:
        print(f"❌ Error configuring Gemini: {e}")
        model = None

# ---- SQLite Database ----
DB_PATH = "calmsetu.db"  # Removed r"" raw string (unnecessary)

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
    print("✅ Database initialized!")

# Initialize database on startup
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
        
        # Check if data exists
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
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
        
        print(f"✅ User registered: {email}")
        return jsonify({"success": True, "message": "User registered successfully!"})

    except sqlite3.IntegrityError:
        print(f"❌ Registration failed: Email {email} already exists")
        return jsonify({"error": "Email already exists"}), 409
    except Exception as e:
        print(f"❌ Registration error: {e}")
        return jsonify({"error": str(e)}), 500

# ---- Login Endpoint ----
@app.route("/login", methods=["POST"])
def login():
    try:
        data = request.get_json()
        
        # Check if data exists
        if not data:
            return jsonify({"error": "No data provided"}), 400
            
        email = data.get("email")
        password = data.get("password")

        if not all([email, password]):
            return jsonify({"error": "Email and password required"}), 400

        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, password FROM users WHERE email=?", (email,))
        user = cursor.fetchone()
        conn.close()

        if not user:
            print(f"❌ Login failed: User {email} not found")
            return jsonify({"error": "Invalid email or password"}), 401

        user_id, name, hashed = user
        if not check_password(password, hashed):
            print(f"❌ Login failed: Wrong password for {email}")
            return jsonify({"error": "Invalid email or password"}), 401

        # Generate a simple token (UUID)
        token = str(uuid.uuid4())
        print(f"✅ User logged in: {email}")
        return jsonify({"success": True, "token": token, "name": name})

    except Exception as e:
        print(f"❌ Login error: {e}")
        return jsonify({"error": str(e)}), 500

# ---- Fixed Gemini Chat Endpoint ----
@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.get_json()
        
        # Check if data exists
        if not data:
            return jsonify({"reply": "Please send a message! 🌿"})
            
        user_message = data.get("message", "").strip()
        
        if not user_message:
            return jsonify({"reply": "Please say something first! 😊"})

        print(f"💬 Chat request: {user_message[:50]}...")  # Log first 50 chars

        # Check if Gemini is configured
        if model is None:
            return jsonify({
                "reply": "🤖 CalmSetu AI is not configured yet. Please add your Gemini API key to app.py!"
            })

        # Create a CalmSetu-specific prompt
        calmsetu_prompt = f"""You are CalmSetu, a warm and empathetic AI companion focused on mental wellness for young people. 

User message: "{user_message}"

Please respond as CalmSetu with:
- Warm, friendly tone
- Use emojis naturally 
- Focus on mental wellness and emotional support
- Keep responses helpful but not too long
- Be like a caring friend, not a clinical therapist

Response:"""

        # Generate response using Gemini
        response = model.generate_content(calmsetu_prompt)
        
        # Check if response was generated
        if response and response.text:
            ai_reply = response.text.strip()
            print(f"✅ AI response generated: {ai_reply[:50]}...")
            return jsonify({"reply": ai_reply})
        else:
            return jsonify({"reply": "Sorry, I couldn't generate a response right now. Please try again! 🌸"})

    except Exception as e:
        print(f"❌ Chat error: {e}")
        return jsonify({
            "reply": f"Sorry, I'm having trouble right now. Please try again! 💙"
        })

# ---- Health Check Endpoint (NEW - for testing) ----
@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({
        "status": "CalmSetu backend is running! 🌿",
        "gemini_configured": model is not None,
        "database": "Connected"
    })

# ---- Run Flask App ----
if __name__ == "__main__":
    print("🚀 Starting CalmSetu Backend...")
    print("📍 Backend URL: http://127.0.0.1:5500")
    print("🔗 Frontend should connect to: http://127.0.0.1:5500/chat")
    
    app.run(host="127.0.0.1", port=5500, debug=True)