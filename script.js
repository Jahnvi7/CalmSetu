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
// ✅ PROTOTYPE CHATBOT WITH STANDARD REPLIES
// ==============================

// Standard replies database for prototype
const standardReplies = {
  // Greetings
  greetings: [
    "Hello! I'm CalmSetu, your mental wellness companion. How are you feeling today?",
    "Hi there! Welcome to CalmSetu. I'm here to support your mental wellness journey.",
    "Hello! Great to see you. How can I help you feel better today?"
  ],
  
  // Stress & Anxiety
  stress: [
    "I understand you're feeling stressed. Try taking 5 deep breaths: inhale for 4 counts, hold for 4, exhale for 6. This activates your body's relaxation response.",
    "Stress is tough, but you're tougher. Let's break it down - what's one small thing causing stress that we can tackle first?",
    "When stress hits, remember: this feeling is temporary. Try the 5-4-3-2-1 technique - name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste."
  ],
  
  // Depression & Sadness
  sadness: [
    "I hear that you're going through a difficult time. Your feelings are valid, and you're not alone in this journey.",
    "It's okay to feel sad sometimes. Small steps count - have you eaten today? Getting some sunlight or calling a friend can help too.",
    "Thank you for sharing with me. Depression can feel overwhelming, but remember: you've overcome hard days before, and you can do it again."
  ],
  
  // Anxiety
  anxiety: [
    "Anxiety can feel overwhelming, but you're safe right now. Try grounding yourself: feel your feet on the floor, notice your breathing, and remind yourself 'I am here, I am safe.'",
    "I understand anxiety is difficult. Let's focus on what you can control right now. What's one small, positive action you could take in the next 5 minutes?",
    "Anxiety often makes us worry about the future. Let's bring you back to the present moment. What are 3 things you're grateful for today?"
  ],
  
  // Self-care
  selfcare: [
    "Self-care isn't selfish - it's essential! What's one small thing you could do for yourself today? Maybe a warm cup of tea, a short walk, or calling someone who cares about you?",
    "Taking care of yourself is important. Have you had enough water today? Sometimes simple things like hydration and a few minutes of fresh air can make a big difference.",
    "You deserve care and kindness, especially from yourself. What would you tell a good friend who was feeling the way you do right now?"
  ],
  
  // Sleep issues
  sleep: [
    "Good sleep is crucial for mental health. Try creating a wind-down routine: dim the lights, put devices away 1 hour before bed, and try some gentle stretching or reading.",
    "Sleep troubles can affect everything. Consider the 4-7-8 breathing technique before bed: inhale for 4, hold for 7, exhale for 8. Repeat 4 times.",
    "If your mind is racing at bedtime, try writing down your thoughts in a journal or making a to-do list for tomorrow. This helps clear your mind."
  ],
  
  // Default supportive responses
  default: [
    "Thank you for sharing with me. Every step you take towards better mental health matters, no matter how small.",
    "I'm here to listen and support you. What you're feeling is important, and you're not alone in this journey.",
    "It takes courage to reach out. How can I best support you right now?",
    "Your mental wellness journey is unique to you. What feels most helpful when you're going through tough times?",
    "I appreciate you trusting me with your thoughts. What's one thing that usually brings you comfort or peace?"
  ]
};

// Function to get appropriate reply based on user message
function getStandardReply(userMessage) {
  const message = userMessage.toLowerCase();
  
  // Check for greetings
  if (message.includes('hello') || message.includes('hi') || message.includes('hey') || 
      message.includes('good morning') || message.includes('good afternoon')) {
    return getRandomReply('greetings');
  }
  
  // Check for stress keywords
  if (message.includes('stress') || message.includes('overwhelmed') || 
      message.includes('pressure') || message.includes('busy') || message.includes('work')) {
    return getRandomReply('stress');
  }
  
  // Check for sadness/depression keywords
  if (message.includes('sad') || message.includes('depressed') || message.includes('down') || 
      message.includes('hopeless') || message.includes('empty') || message.includes('lonely')) {
    return getRandomReply('sadness');
  }
  
  // Check for anxiety keywords
  if (message.includes('anxious') || message.includes('anxiety') || message.includes('worried') || 
      message.includes('panic') || message.includes('nervous') || message.includes('fear')) {
    return getRandomReply('anxiety');
  }
  
  // Check for self-care keywords
  if (message.includes('self care') || message.includes('self-care') || message.includes('tired') || 
      message.includes('exhausted') || message.includes('burnout')) {
    return getRandomReply('selfcare');
  }
  
  // Check for sleep keywords
  if (message.includes('sleep') || message.includes('insomnia') || message.includes('can\'t sleep') || 
      message.includes('tired') || message.includes('rest')) {
    return getRandomReply('sleep');
  }
  
  // Default supportive response
  return getRandomReply('default');
}

// Helper function to get random reply from category
function getRandomReply(category) {
  const replies = standardReplies[category];
  return replies[Math.floor(Math.random() * replies.length)];
}

// ✅ UPDATED CHATBOT FUNCTION WITH STANDARD REPLIES
async function sendMessage() {
  const input = document.getElementById("chatInput") || document.getElementById("user-input");
  const chatBox = document.getElementById("chatMessages") || document.getElementById("chatbot-messages");
  
  if (!input || !chatBox) {
    console.error("Chat elements not found!");
    return;
  }
  
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
  typing.innerHTML = "CalmSetu is typing<span class='typing-dots'>...</span>";
  typing.id = "typing";
  chatBox.appendChild(typing);
  chatBox.scrollTop = chatBox.scrollHeight;

  // Simulate thinking delay (1-2 seconds for realism)
  const delay = 1000 + Math.random() * 1000;
  
  setTimeout(() => {
    // Remove typing indicator
    typing.remove();
    
    // Get appropriate standard reply
    const reply = getStandardReply(msg);
    
    // Add AI response
    const aiMsg = document.createElement("div");
    aiMsg.classList.add("message", "bot");
    aiMsg.textContent = reply;
    chatBox.appendChild(aiMsg);
    
    // Scroll to bottom
    chatBox.scrollTop = chatBox.scrollHeight;
  }, delay);
}

// ✅ EVENT LISTENERS FOR BOTH POSSIBLE ID COMBINATIONS
document.addEventListener('DOMContentLoaded', function() {
  // Try multiple possible button IDs
  const sendBtn = document.getElementById("send-btn") || 
                  document.getElementById("sendBtn") || 
                  document.querySelector(".chat-send-btn");
  
  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }

  // Try multiple possible input IDs
  const userInput = document.getElementById("user-input") || 
                    document.getElementById("chatInput") || 
                    document.querySelector(".chat-input");
  
  if (userInput) {
    userInput.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        sendMessage();
      }
    });
  }
  
  // Add initial welcome message
  setTimeout(() => {
    const chatBox = document.getElementById("chatMessages") || document.getElementById("chatbot-messages");
    if (chatBox && chatBox.children.length === 0) {
      const welcomeMsg = document.createElement("div");
      welcomeMsg.classList.add("message", "bot");
      welcomeMsg.textContent = "Hello! I'm CalmSetu, your mental wellness companion. How are you feeling today?";
      chatBox.appendChild(welcomeMsg);
    }
  }, 500);
});