require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { initializeApp } = require('firebase/app');
const { getDatabase, ref, onValue } = require('firebase/database');
const path = require('path');
const twilio = require('twilio'); 

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// ==========================================
// 1. FILE ROUTING
// ==========================================
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/index.html', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/dashboard.html', (req, res) => res.sendFile(path.join(__dirname, 'dashboard.html')));

// ==========================================
// 2. TWILIO CONFIGURATION (Secured via .env)
// ==========================================
const twilioClient = new twilio(
  process.env.TWILIO_ACCOUNT_SID, 
  process.env.TWILIO_AUTH_TOKEN
);

const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER; 
const YOUR_PERSONAL_PHONE = process.env.YOUR_PERSONAL_PHONE; 

// Separate cooldown timers for Calls and SMS
let lastCallTime = 0;
let lastSmsTime = 0;
const CALL_COOLDOWN_MS = 60000; // 60 seconds
const SMS_COOLDOWN_MS = 60000;  // 60 seconds

// ==========================================
// 3. FIREBASE CONFIGURATION (Secured via .env)
// ==========================================
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getDatabase(firebaseApp);

// ==========================================
// 4. SENSOR LOGIC & ALARMS
// ==========================================
const sensorRef = ref(db, 'sensorData');

onValue(sensorRef, (snapshot) => {
  const data = snapshot.val();
  
  if (data) {
    console.log("🔥 SENSOR DATA:", data); 
    
    // Broadcast data to the web dashboard
    io.emit('sensorUpdate', data);

    // Convert values to Numbers
    const mq135 = Number(data.mq135_ppm) || 0; 
    const mq2 = Number(data.mq2_ppm) || 0;     
    
    // Define independent threshold conditions
    const isMq2Critical = mq2 > 1000;
    const isMq135Critical = mq135 > 1200;

    const isMq2Warning = mq2 > 400 && mq2 <= 1000;
    const isMq135Warning = mq135 > 600 && mq135 <= 1200;

    // --- CRITICAL ALARM : PHONE CALL ---
    if (isMq2Critical || isMq135Critical) {
      const currentTime = Date.now();
      
      if (currentTime - lastCallTime > CALL_COOLDOWN_MS) {
        lastCallTime = currentTime; 
        
        // Build a dynamic message depending on which sensor triggered it
        let reasons = [];
        if (isMq2Critical) reasons.push(`Smoke and Gas at ${mq2}`);
        if (isMq135Critical) reasons.push(`Air Quality at ${mq135}`);
        const alertMessage = reasons.join(' and ');

        console.log(`🚨 CRITICAL ALARM! Levels: ${alertMessage}. Calling ${YOUR_PERSONAL_PHONE}...`);

        twilioClient.calls.create({
            twiml: `<Response><Say>Emergency! Critical levels detected. ${alertMessage} parts per million. Check the dashboard immediately.</Say></Response>`,
            to: YOUR_PERSONAL_PHONE,
            from: TWILIO_PHONE_NUMBER
          })
          .then(call => console.log(`📞 Call placed successfully! SID: ${call.sid}`))
          .catch(err => console.error("❌ Twilio Call Error:", err.message)); 
      }
    } 
    // --- WARNING ALARM : SMS TEXT MESSAGE ---
    else if (isMq2Warning || isMq135Warning) {
      const currentTime = Date.now();

      if (currentTime - lastSmsTime > SMS_COOLDOWN_MS) {
        lastSmsTime = currentTime;
        
        // Build a dynamic message depending on which sensor is in warning state
        let reasons = [];
        if (isMq2Warning) reasons.push(`Smoke/Gas is ${mq2} PPM`);
        if (isMq135Warning) reasons.push(`Air Quality is ${mq135} PPM`);
        const alertMessage = reasons.join(' and ');

        console.log(`⚠️ WARNING! Levels: ${alertMessage}. Sending SMS to ${YOUR_PERSONAL_PHONE}...`);

        twilioClient.messages.create({
            body: `⚠️ Home Security Warning: Elevated levels detected. ${alertMessage}. Please monitor the situation.`,
            to: YOUR_PERSONAL_PHONE,
            from: TWILIO_PHONE_NUMBER
          })
          .then(message => console.log(`✉️ SMS sent successfully! SID: ${message.sid}`))
          .catch(err => console.error("❌ Twilio SMS Error:", err.message));
      }
    }
  }
}, (error) => {
  console.error("❌ Firebase Database Error:", error);
});

// ==========================================
// 5. START SERVER
// ==========================================
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log('\n=========================================');
  console.log('🚀 Gas Monitor Server is LIVE!');
  console.log(`👉 DASHBOARD: http://localhost:${PORT}`);
  console.log('=========================================\n');
});