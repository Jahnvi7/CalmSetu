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

// Dashboard tabs - UPDATED to include analytics
function openTab(tab){
  ['home','profile','analytics','settings'].forEach(t=>{
    document.getElementById('tab-'+t).classList.add('hidden');
    const tabElement = document.querySelector('.side .item[data-tab="'+t+'"]');
    if(tabElement) tabElement.classList.remove('active');
  });
  document.getElementById('tab-'+tab).classList.remove('hidden');
  const activeTabElement = document.querySelector('.side .item[data-tab="'+tab+'"]');
  if(activeTabElement) activeTabElement.classList.add('active');
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

// ==============================
// ✨ ENHANCED QUICK ACTIONS & NEW FEATURES
// ==============================

// Enhanced quick actions
function quickAction(type) {
  const messages = {
    breathing: "🫁 Let's breathe together!\n\n1. Breathe in slowly for 4 seconds...\n2. Hold for 4 seconds...\n3. Breathe out slowly for 6 seconds...\n\nRepeat 3 times. You've got this! ✨",
    gratitude: "✏️ Gratitude Practice\n\nWrite down 3 things you're grateful for today:\n\n1. _____\n2. _____\n3. _____\n\nGratitude rewires your brain for positivity! 💙",
    break: "☕ Perfect time for a 5-minute break!\n\n• Stand up and stretch 🙆\n• Get some water 💧\n• Step outside if possible 🌿\n• Take 3 deep breaths\n\nYour mind will thank you! 🌟",
    mood: "😊 How are you feeling right now?\n\nTake a moment to check in with yourself:\n• What emotions am I experiencing?\n• What does my body feel like?\n• What do I need right now?\n\nIt's okay to feel whatever you're feeling. 💙"
  };
  
  // Create a nice modal instead of alert
  showWellnessModal(messages[type] || "That's a wonderful choice for self-care! 🌸");
}

// Show wellness modal
function showWellnessModal(message) {
  const modal = document.createElement('div');
  modal.className = 'wellness-modal';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" onclick="this.parentElement.parentElement.remove()">✕</button>
      <div class="modal-text">${message.replace(/\n/g, '<br>')}</div>
      <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()" style="margin-top:15px;">Got it! 🌟</button>
    </div>
  `;
  document.body.appendChild(modal);
}

// ==============================
// ✨ NEW ANALYTICS FUNCTIONS
// ==============================

// Set new wellness goals
function setNewGoals() {
  showWellnessModal("🎯 Goal Setting\n\nWhat wellness goals would you like to set for this week?\n\n• Daily mood check-ins\n• Mindfulness minutes\n• Gratitude journaling\n• Breathing exercises\n\nYou can customize these in your profile settings!");
}

// Update analytics numbers (simulate real data)
function updateAnalytics() {
  const analytics = {
    totalChats: Math.floor(Math.random() * 50) + 20,
    streakDays: Math.floor(Math.random() * 14) + 1,
    wellnessScore: (Math.random() * 2 + 8).toFixed(1),
    mindfulMinutes: Math.floor(Math.random() * 100) + 50
  };

  // Update DOM elements if they exist
  const totalChatsEl = document.getElementById('total-chats');
  const streakDaysEl = document.getElementById('streak-days');
  const wellnessScoreEl = document.getElementById('wellness-score');
  const mindfulMinutesEl = document.getElementById('mindful-minutes');

  if (totalChatsEl) totalChatsEl.textContent = analytics.totalChats;
  if (streakDaysEl) streakDaysEl.textContent = analytics.streakDays;
  if (wellnessScoreEl) wellnessScoreEl.textContent = analytics.wellnessScore;
  if (mindfulMinutesEl) mindfulMinutesEl.textContent = analytics.mindfulMinutes;
}

// Animate mood bars on analytics tab
function animateMoodBars() {
  const moodBars = document.querySelectorAll('.mood-bar');
  moodBars.forEach((bar, index) => {
    setTimeout(() => {
      bar.style.transform = 'scaleY(0)';
      setTimeout(() => {
        bar.style.transform = 'scaleY(1)';
        bar.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      }, 100);
    }, index * 100);
  });
}

// ==============================
// DAILY TIP ROTATION & UTILITIES
// ==============================

// Daily tip rotation
const tips = [
  "Take 3 deep breaths before starting any stressful task. Your mind will thank you! 🌸",
  "Try the 5-4-3-2-1 grounding technique: 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste. 🌿",
  "Remember: it's okay to not be okay sometimes. You're human, and that's perfectly normal. 💙",
  "Take a 2-minute walk, even if it's just around your room. Movement helps clear your mind! 🚶",
  "Write down one thing you're proud of yourself for today, no matter how small. 📝✨",
  "Drink a glass of water and take a moment to appreciate how it nourishes your body. 💧",
  "Send a kind message to someone you care about. Spreading kindness helps you feel better too! 💕"
];

// Rotate daily tip
function rotateTip() {
  const tipElement = document.getElementById('daily-tip');
  if (tipElement) {
    const randomTip = tips[Math.floor(Math.random() * tips.length)];
    tipElement.textContent = randomTip;
  }
}

// Set day mood
function setDayMood(day, mood) {
  const dayElement = document.querySelector(`[data-day="${day}"]`);
  if (!dayElement) return;
  
  const moodEmojis = dayElement.querySelectorAll('.mood-emoji');
  
  // Clear previous selections
  moodEmojis.forEach(emoji => emoji.classList.remove('selected'));
  
  // Set new selection
  const selectedEmoji = dayElement.querySelector(`[onclick*="${mood}"]`);
  if (selectedEmoji) {
    selectedEmoji.classList.add('selected');
  }
  
  // Update mood message
  const moodMsg = document.getElementById('moodMsg');
  if (moodMsg) {
    moodMsg.innerHTML = `<span class="mood-indicator">📊 ${day}: ${mood} - Thanks for tracking your mood!</span>`;
  }
}

// Toggle preference tags
function togglePreference(button) {
  button.classList.toggle('active');
}

// Toggle notifications
function toggleNotifications() {
  const btn = document.getElementById('notif-btn');
  if (!btn) return;
  
  if (btn.textContent.includes('Enable')) {
    btn.textContent = '🔕 Disable';
    btn.classList.remove('btn-ghost');
    btn.classList.add('btn-primary');
    showNotification('Daily wellness reminders enabled! 🔔');
  } else {
    btn.textContent = '🔔 Enable';
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-ghost');
    showNotification('Notifications disabled 🔕');
  }
}

// Clear chat history
function clearChatHistory() {
  if (confirm('Are you sure you want to clear your chat history? This cannot be undone.')) {
    const chatMessages = document.getElementById('chatbot-messages');
    if (chatMessages) {
      chatMessages.innerHTML = '<div class="message bot"><span class="greeting-text">Hi there! ✨ Your chat history has been cleared. How are you feeling today? 🌿</span></div>';
    }
    showNotification('Chat history cleared 🗑️');
  }
}

// Show notification
function showNotification(message) {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = message;
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ==============================
// INITIALIZATION & EVENT LISTENERS
// ==============================

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Set up initial year
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Start tip rotation
  rotateTip();
  setInterval(rotateTip, 30000); // Rotate every 30 seconds

  // Update analytics when dashboard is opened
  setTimeout(() => {
    updateAnalytics();
  }, 1000);

  // Add click listener for analytics tab to animate bars
  const analyticsTab = document.querySelector('.side .item[data-tab="analytics"]');
  if (analyticsTab) {
    analyticsTab.addEventListener('click', () => {
      setTimeout(animateMoodBars, 300); // Delay for tab transition
    });
  }
});