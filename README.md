# 🌿 CalmSetu – AI-Personalized Mental Wellness Web App

CalmSetu is a youth-friendly mental wellness web app designed to provide personalized, empathetic support through AI.  
It helps users check in on their emotions, chat with an AI buddy, track moods, and explore simple self-care actions in a stigma-free environment.  

---

## ✨ Features
- 🤖 **AI-powered chat** with warm, empathetic responses (Gemini API integration).  
- 👤 **User accounts** – register & login with SQLite-based backend.  
- 📊 **Analytics dashboard** – mood tracking, streaks, wellness score.  
- ⚡ **Quick wellness actions** – guided breathing, gratitude journaling, mood checks.  
- 🎨 **Modern UI** with dark/light theme and smooth animations.  
- 🔒 **Privacy-first approach** – only minimal local storage + SQLite DB.  

---

## 🛠️ Project Structure
app.py # Flask backend (API endpoints + Gemini integration + SQLite DB)
calmsetu.db # SQLite database (auto-created if missing)
index.html # Main frontend (landing, login, dashboard, chat UI)
script.js # Frontend logic (navigation, chatbot, analytics, quick actions)
style.css # UI styling (dark/light theme, chatbot design, animations)
---