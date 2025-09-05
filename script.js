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
document.getElementById('themeBtn').onclick = toggleTheme;
// Fake login/register
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
// ✅ Chatbot logic
async function sendMessage() {
  const input = document.getElementById("user-input");   // corrected
  const msg = input.value.trim();
  if (!msg) return;
  const chatBox = document.getElementById("chatbot-messages"); // corrected
  // User message
  const userMsg = document.createElement("div");
  userMsg.textContent = "You: " + msg;
  chatBox.appendChild(userMsg);
  input.value = "";
  // Typing indicator
  const typing = document.createElement("div");
  typing.textContent = "CalmSetu is typing...";
  typing.id = "typing";
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;
  try {
    const response = await fetch("http://127.0.0.1:5000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg }),
    });
    const data = await response.json();
    typing.remove();
    const aiMsg = document.createElement("div");
    aiMsg.textContent = "CalmSetu 🤖: " + data.reply;
    chatBox.appendChild(aiMsg);
  } catch (error) {
    typing.remove();
    const errMsg = document.createElement("div");
    errMsg.textContent = "⚠️ Error: Could not connect to backend";
    chatBox.appendChild(errMsg);
  }
  chatBox.scrollTop = chatBox.scrollHeight;
}