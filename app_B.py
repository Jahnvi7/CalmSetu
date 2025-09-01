from flask import Flask, render_template, request, jsonify
import os

app = Flask(__name__, template_folder="../Frontend", static_folder="../Frontend")

# ------------------ FRONTEND ROUTE ------------------

@app.route("/")
def home():
    return render_template("index.html")


# ------------------ API ROUTES ------------------

# 1. Mood Check-in
@app.route("/api/mood", methods=["POST"])
def mood_checkin():
    data = request.get_json()
    mood = data.get("mood", "Neutral")
    return jsonify({
        "status": "ok",
        "response": f"Mood received: {mood} 🙂",
        "suggestion": suggest_activity(mood)
    })


# 2. Likes/Dislikes Profiling
@app.route("/api/likes", methods=["POST"])
def likes_dislikes():
    data = request.get_json()
    likes = data.get("likes", [])
    return jsonify({
        "status": "ok",
        "message": f"Got it! You like {', '.join(likes)} 🎶",
        "coping_suggestion": generate_coping_suggestion(likes)
    })


# 3. Stress Release Tracker
@app.route("/api/session", methods=["POST"])
def stress_session():
    data = request.get_json()
    duration = data.get("duration", 0)
    return jsonify({
        "status": "ok",
        "message": f"Session tracked for {duration} minutes ⏱️",
        "analytics": {"stress_before": 7, "stress_after": 4}
    })


# ------------------ UTIL FUNCTIONS ------------------

def suggest_activity(mood):
    if mood == "Happy":
        return "Keep smiling! Maybe share your joy with a friend 😊"
    elif mood == "Stressed":
        return "Take 3 deep breaths 🧘"
    elif mood == "Anxious":
        return "Try a quick 2-min grounding exercise 🌿"
    else:
        return "Stay calm and hydrated 💧"

def generate_coping_suggestion(likes):
    if "music" in likes:
        return "Play a calming playlist 🎶"
    elif "dance" in likes:
        return "Move your body to your favorite beat 💃"
    elif "writing" in likes:
        return "Journal your thoughts for 5 min ✍️"
    else:
        return "Try mindfulness for 2 minutes 🧘"


# ------------------ MAIN ------------------

if __name__ == "__main__":
    app.run(debug=True)