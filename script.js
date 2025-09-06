// ==============================
// Navigation & Theme Functions (KEEP THESE - they work fine)
// ==============================
const sections = ['home','about','login','register','dashboard'];
function navigate(sec){
  sections.forEach(s => document.getElementById(s).classList.add('hidden'));
  document.getElementById(sec).classList.remove('hidden');
  if(sec==='dashboard'){
    document.getElementById('loginTop').classList.add('hidden');
    document.getElementById('registerTop').classList.add('hidden');
    document.getElementById('dashTop').classList.remove('hidden');
    document.getElementById('logoutTop').classList.remove('hidden');
  } else {
    document.getElementById('loginTop').classList.remove('hidden');
    document.getElementById('registerTop').classList.remove('hidden');
    document.getElementById('dashTop').classList.add('hidden');
    document.getElementById('logoutTop').classList.add('hidden');
  }
}

// Theme toggle
function toggleTheme(){
  document.documentElement.dataset.theme = 
    document.documentElement.dataset.theme==='dark' ? 'light' : 'dark';
}
// Fix: Remove this line since themeBtn doesn't exist
// document.getElementById('themeBtn').onclick = toggleTheme;

// Auth functions
function fakeLogin(e){
  e.preventDefault();
  document.getElementById('userName').textContent =
    document.getElementById('email').value.split('@')[0];
  navigate('dashboard');
}
function fakeRegister(e){
  e.preventDefault();
  document.getElementById('userName').textContent =
    document.getElementById('name').value;
  navigate('dashboard');
}
function logout(){
  navigate('home');
  document.getElementById('userName').textContent='Friend';
}

// Dashboard tabs
function openTab(tab){
  ['home','profile','settings'].forEach(t=>{
    document.getElementById('tab-'+t).classList.add('hidden');
    document.querySelector('.side .item[data-tab="'+t+'"]').classList.remove('active');
  });
  document.getElementById('tab-'+tab).classList.remove('hidden');
  document.querySelector('.side .item[data-tab="'+tab+'"]').classList.add('active');
}
function setMood(mood){
  document.getElementById('moodMsg').textContent='Your mood: '+mood;
}
function saveProfile(){
  document.getElementById('saveMsg').textContent='Saved!';
  setTimeout(()=>document.getElementById('saveMsg').textContent='',1500);
}

// Footer year
document.getElementById('year').textContent=new Date().getFullYear();

// ==============================
// ✅ FIXED CHATBOT FUNCTIONS (REPLACE THE OLD ONES)
// ==============================
async function sendMessage() {
  // ✅ CORRECT IDs that match your HTML
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chatbot-messages");
  
  const msg = input.value.trim();
  if (!msg) return;

  // Add user message bubble
  const userMsg = document.createElement("div");
  userMsg.classList.add("message", "user");
  userMsg.textContent = msg;
  chatBox.appendChild(userMsg);
  input.value = "";

  // Typing indicator
  const typing = document.createElement("div");
  typing.classList.add("message", "bot");
  typing.textContent = "CalmSetu is typing...";
  typing.id = "typing";
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    // ✅ CORRECT PORT (5500) to match your app.py
    const response = await fetch("http://127.0.0.1:5500/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });
    
    const data = await response.json();

    // Remove typing indicator
    typing.remove();
    
    // Add AI response
    const aiMsg = document.createElement("div");
    aiMsg.classList.add("message", "bot");
    aiMsg.textContent = data.reply || "Sorry, I couldn't process that right now.";
    chatBox.appendChild(aiMsg);
    
  } catch (error) {
    // Remove typing indicator
    typing.remove();
    
    // Show error message
    const errMsg = document.createElement("div");
    errMsg.classList.add("message", "bot");
    errMsg.textContent = "⚠️ Cannot connect to CalmSetu AI. Make sure the backend is running!";
    chatBox.appendChild(errMsg);
    
    console.error("Chat error:", error);
  }

  // Scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ✅ CORRECT EVENT LISTENERS with right IDs
document.addEventListener('DOMContentLoaded', function() {
  // Send button click
  const sendBtn = document.getElementById("send-btn");
  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }

  // Enter key press
  const userInput = document.getElementById("user-input");
  if (userInput) {
    userInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }
});