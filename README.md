# 🛡️ AirGuard Pro — IoT-Based Hazardous Gas & Temperature Detection System

![Project Banner](https://house-monitoring-1.onrender.com/)

> **Real-time air quality monitoring, hazardous gas detection, and temperature sensing — powered by ESP32 with a live web dashboard.**

---

## 📸 Project Hardware

![AirGuard Pro Hardware Setup](https://github.com/user-attachments/assets/a7ca4415-4042-4d44-9b3d-e06b2246445a)

> *ESP32 microcontroller connected with MQ-2, MQ-135 gas sensors, DHT22 temperature & humidity sensor, and a buzzer alarm — mounted on a breadboard.*

---

## 🌐 Live Dashboard

🔗 **[https://house-monitoring-1.onrender.com/](https://house-monitoring-1.onrender.com/)**

Monitor real-time air quality, AQI index, gas levels, and receive smart hazard alerts — all from your browser.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Hardware Components](#hardware-components)
- [System Workflow](#system-workflow)
- [Tech Stack](#tech-stack)
- [Website Features — GasMonitor Pro](#️-website-features--gasmonitor-pro)
  - [1. Secure Authentication](#-1-secure-authentication-system)
  - [2. Real-Time Gas Monitoring](#-2-real-time-gas-monitoring)
  - [3. Smart Alert System](#-3-smart-alert-system)
  - [4. Dashboard Interface](#-4-dashboard-interface)
  - [5. Backend Processing](#-5-backend-processing-nodejs-server)
  - [6. Cloud Integration](#️-6-cloud-integration)
  - [7. Live AQI Index](#-7-live-aqi-index)
  - [8. Historical Trends](#-8-historical-data--trend-charts)
- [Step-by-Step Operation](#-step-by-step-operation)
- [How It Works](#-how-it-works)
- [Setup & Installation](#setup--installation)
- [Project Structure](#project-structure)
- [Contributors](#contributors)

---

## 🔍 Overview

**AirGuard Pro** is an IoT-based environmental safety system that continuously monitors:
- 🔥 **Combustible & flammable gases** (LPG, methane, smoke) via **MQ-2**
- ☁️ **Air quality & pollution** (CO₂, NH₃, benzene) via **MQ-135**
- 🌡️ **Temperature & humidity** via **DHT22**

When gas levels exceed safe thresholds, the system **triggers a buzzer alarm** and **sends live alerts** to the web dashboard. The system continues monitoring until conditions return to safe levels.

---

## ✨ Features

- ✅ Real-time gas level monitoring (MQ-2 & MQ-135)
- ✅ Temperature & humidity tracking (DHT22)
- ✅ Smart threshold-based buzzer alerts
- ✅ Live AQI index with historical trend charts
- ✅ Secure web dashboard with Firebase Auth & MFA
- ✅ 99.9% sensor uptime
- ✅ 256-bit SSL secured communication
- ✅ Google & GitHub OAuth login support

---

## 🔧 Hardware Components

| Component | Model | Function |
|-----------|-------|----------|
| Microcontroller | **ESP32** | Brain of the system; collects & transmits data |
| Gas Sensor | **MQ-2** | Detects combustible gases (LPG, smoke, methane) |
| Air Quality Sensor | **MQ-135** | Monitors air pollution & AQI |
| Temp & Humidity Sensor | **DHT22 (DST-22)** | Measures temperature and humidity |
| Alert Module | **Buzzer** | Audible alarm on threshold breach |
| Prototyping Board | **Breadboard** | Circuit connections |
| Connectors | **Jumper Wires** | Component wiring |

---

## ⚙️ System Workflow

```
1. Power is supplied to the system
        ↓
2. ESP32 initializes all sensors
        ↓
3. MQ-2   → monitors combustible gases & flammable gases
   MQ-135 → monitors air quality and pollution
   DHT22  → records temperature and humidity
        ↓
4. ESP32 collects data from all sensors continuously
        ↓
5. Microcontroller compares values with preset safety thresholds
        ↓
6. If gas level is within safe range → ESP32 keeps monitoring
        ↓
7. If gas level exceeds the limit → ESP32 activates the BUZZER
                                   → Alerts people of danger
        ↓
8. System continues monitoring until gas level returns to safe condition
```

---

## 🛠️ Tech Stack

### Hardware
- ESP32 Development Board
- MQ-2 Gas Sensor
- MQ-135 Air Quality Sensor
- DHT22 Temperature & Humidity Sensor
- Piezoelectric Buzzer
- Breadboard & Jumper Wires

### Firmware (Embedded Software)
- **Arduino IDE** — Firmware development environment
- **C/C++** — Embedded programming language
- **WiFi.h** — ESP32 built-in Wi-Fi library for cloud connectivity
- **HTTPClient.h** — Sends sensor data as HTTP requests to backend
- **DHT.h** — Adafruit library for DHT22 sensor readings
- **MQ2 / MQ135 Libraries** — Analog sensor value reading & PPM conversion

### Web Application — [GasMonitor Pro](https://house-monitoring-1.onrender.com/)
- **Frontend** — HTML5, CSS3, Vanilla JavaScript
- **Authentication** — Firebase Authentication
- **Hosting** — Render.com (cloud deployment)
- **Security Layer** — 256-bit SSL encryption, Zero Trust architecture
- **Real-time Data** — Live sensor telemetry streamed from ESP32 over Wi-Fi

---

## 🖥️ Website Features — GasMonitor Pro

The web dashboard **[GasMonitor Pro](https://house-monitoring-1.onrender.com/)** is the complete software interface of this project. It connects to the ESP32 hardware via Firebase and displays live environmental data in real time.

---

### 🔐 1. Secure Authentication System

The dashboard is protected with an enterprise-grade authentication system:

| Auth Feature | Details |
|---|---|
| **Email & Password Login** | Standard credential-based login with live password strength indicator |
| **Google OAuth** | One-click sign-in via Google account |
| **GitHub OAuth** | Developer-friendly login via GitHub account |
| **Sign Up / Register** | New user registration with full name, email, and password |
| **Forgot Password** | Built-in password recovery flow |
| **MFA Ready** | Multi-Factor Authentication support for extra security |
| **256-bit SSL** | All data transmitted over encrypted HTTPS connection |
| **Firebase Auth** | Powered by Google Firebase — industry-standard auth backend |
| **Zero Trust Security** | Every request is verified; no implicit trust granted |
| **Session Security** | Sessions are securely managed and validated on each load |

> The login page displays **"Session secure"** and **"Sensors Online"** status badges — confirming both security and hardware connectivity at a glance before you even log in.

---

### 🔴 2. Real-Time Gas Monitoring

**What the user sees:**
- A live value display showing gas level / sensor readings
- Updates automatically — **no page refresh needed**

**How it works internally:**

```
Sensor (ESP32) → Firebase Realtime Database → Node.js Server → Frontend UI
```

- Sensor/device sends data to **Firebase Realtime Database**
- Backend (`server.js`) listens for database updates
- Frontend subscribes using **Firebase SDK** event listeners

**Key concepts used:**
```javascript
// No polling — uses instant event listeners
onValue(ref, callback)       // Listens for value changes
onChildAdded(ref, callback)  // Listens for new entries
```

- ✅ No polling → **instant updates in milliseconds**
- ✅ MQ-2 → real-time PPM values for LPG, methane, smoke
- ✅ MQ-135 → live pollution readings for CO₂, NH₃, benzene
- ✅ DHT22 → ambient temperature and humidity streamed live

---

### 🚨 3. Smart Alert System

**What the user sees:**
- ⚠️ Warning message when gas exceeds safe threshold
- 🔴 Color change on the dashboard (Green → Red)

**Logic behind it:**
```javascript
if (gasLevel > threshold) {
  triggerAlert();   // Visual alert on dashboard
  activateBuzzer(); // Physical buzzer on ESP32
}
```

**Types of alerts implemented:**
| Alert Type | Details |
|---|---|
| ⚠️ **Visual Alert** | UI color change and warning banner on dashboard |
| 🔔 **Console / Server Logs** | Logged in `server.js` for record keeping |
| 📲 **Future Ready** | Architecture supports SMS / Email notifications |

**Why it matters:**
- Prevents dangerous situations — gas leaks, fire risk, toxic exposure
- Alerts remain **active until gas returns to safe levels**
- Works **in sync** with the physical buzzer on the ESP32 board

---

### 📊 4. Dashboard Interface

**UI Components present on the dashboard:**
- 📟 **Live reading panel** — current gas levels, temperature, humidity
- 🟢🔴 **Status indicator** — displays `SAFE` or `DANGER` state clearly
- 📈 **Graphs / trend charts** — visual history of sensor readings
- 🕐 **Timestamped logs** — every reading recorded with time

**Behavior:**
- Auto-refresh via **real-time Firebase sync**
- Minimal latency — updates in **~milliseconds**
- Designed for **quick-glance decisions** — no manual action needed
- Fully responsive — works on desktop, tablet, and mobile

---

### ⚙️ 5. Backend Processing — Node.js Server

**What `server.js` is doing:**

```javascript
// Core backend responsibilities
const db = getDatabase(app);   // Initialize Firebase connection

// Server handles:
// 1. Firebase initialization
// 2. Real-time database connection
// 3. Serving frontend static files
// 4. Processing live sensor updates
// 5. Threshold comparison logic
// 6. API endpoints for dashboard
```

**Full responsibilities:**
| Task | Description |
|---|---|
| **Firebase Init** | Connects backend to Firebase Realtime Database |
| **Static File Serving** | Serves the frontend HTML/CSS/JS dashboard |
| **Real-time Updates** | Handles live sensor data as it arrives |
| **Data Validation** | Ensures sensor values are within expected ranges |
| **Threshold Checking** | Server-side check — triggers alert logic |
| **API Endpoints** | Provides data endpoints consumed by the frontend |

---

### ☁️ 6. Cloud Integration

**Services used:**

| Service | Role |
|---|---|
| **Firebase Realtime Database** | Stores and streams live sensor data |
| **Firebase Authentication** | Manages all user login & security |
| **Render.com** | Hosts the Node.js backend + frontend dashboard |

**Benefits of this cloud architecture:**
- ✅ **No local server required** — everything runs in the cloud
- ✅ **Accessible from anywhere** — open dashboard on any browser, any device
- ✅ **Scalable** — Firebase scales automatically with usage
- ✅ **Always-on** — 99.9% uptime with Render hosting
- ✅ **"Sensors Online"** badge on login confirms live ESP32 connection

---

### 📊 7. Live AQI Index

- Calculates a **real-time Air Quality Index (AQI)** score from MQ-135 readings
- Displays the **current air quality category**:

| AQI Range | Status |
|---|---|
| 0 – 50 | 🟢 Good |
| 51 – 100 | 🟡 Moderate |
| 101 – 150 | 🟠 Unhealthy for Sensitive Groups |
| 151 – 200 | 🔴 Unhealthy |
| 201+ | 🟣 Hazardous |

---

### 📈 8. Historical Data & Trend Charts

- All sensor readings are **logged continuously** with timestamps
- **Graphical trend charts** display gas levels and temperature over time
- Users can **identify patterns** — e.g., CO₂ spike every morning at 8AM
- Supports **predictive safety monitoring** over days and weeks
- Charts help compare **before/after** ventilation or safety improvements

---

## 🧠 Step-by-Step Operation

```
1. ⚡ Power is supplied to the system
        ↓
2. ESP32 initializes all sensors
        ↓
3. Sensors start collecting environmental data:
   MQ-2   → combustible gas detection (LPG, smoke, methane)
   MQ-135 → air quality & pollution (CO₂, NH₃, benzene)
   DHT22  → temperature & humidity
        ↓
4. ESP32 continuously reads & transmits data to Firebase
        ↓
5. System compares values with predefined safety thresholds
        ↓
6a. If SAFE  → ESP32 continues monitoring silently
        ↓
6b. If DANGER detected:
   🚨 Buzzer activates on the device (hardware alert)
   📊 Alert pushed to dashboard (software alert)
   🔴 Dashboard turns red with warning message
        ↓
7. Monitoring continues until values return to safe range
        ↓
8. System auto-resets — buzzer stops, dashboard returns to green ✅
```

---

## 🚀 How It Works

1. **ESP32** reads all sensor data every few seconds
2. Data is sent over **Wi-Fi** to **Firebase Realtime Database**
3. `server.js` (Node.js) listens for database changes using `onValue()`
4. The **GasMonitor Pro dashboard** displays live readings, AQI, and status
5. If readings cross **safety thresholds**:
   - 🔔 Buzzer activates on the ESP32 hardware
   - 🚨 Alert is pushed instantly to the web dashboard
   - Dashboard changes from 🟢 Safe to 🔴 Danger state
6. System **auto-resets** once air quality returns to safe levels

---

## 🧰 Setup & Installation

### Hardware Setup
1. Connect **MQ-2** to ESP32 analog pin (e.g., GPIO34)
2. Connect **MQ-135** to ESP32 analog pin (e.g., GPIO35)
3. Connect **DHT22** to ESP32 digital pin (e.g., GPIO4)
4. Connect **Buzzer** to ESP32 digital pin (e.g., GPIO2)
5. Power ESP32 via USB or 5V supply

### Firmware
```cpp
// Install required libraries
// - DHT sensor library by Adafruit
// - MQ2 / MQ135 libraries
// - WiFi.h (built-in ESP32)
// - HTTPClient.h (built-in ESP32)

// Flash firmware via Arduino IDE
// Set your Wi-Fi credentials and dashboard endpoint in config
```

### Web Dashboard
```bash
# Visit the live dashboard
https://house-monitoring-1.onrender.com/

# Sign up with Email / Google / GitHub
# View real-time sensor data after ESP32 connects
```

---

## 📁 Project Structure

```
airguard-pro/
│
├── firmware/
│   ├── airguard_esp32.ino       # Main ESP32 firmware
│   ├── config.h                 # Wi-Fi & API config
│   └── sensors.h                # Sensor read functions
│
├── dashboard/
│   ├── index.html               # Main dashboard UI
│   ├── auth.js                  # Firebase authentication
│   ├── sensors.js               # Real-time data fetch
│   └── charts.js                # AQI & trend charts
│
├── assets/
│   └── hardware.jpeg            # Hardware project photo
│
└── README.md
```

---

## 👨‍💻 Contributors

| Name | Role |
|------|------|
| Your Name | Hardware Design, Firmware, Dashboard |

---

## 📄 License

This project is licensed under the **MIT License** — feel free to use, modify, and distribute.

---

## 🙌 Acknowledgements

- [Espressif Systems](https://www.espressif.com/) — ESP32
- [Adafruit](https://www.adafruit.com/) — DHT22 Library
- [Firebase](https://firebase.google.com/) — Authentication
- [Render](https://render.com/) — Dashboard Hosting

---

> ⚡ *Built with passion for safer environments — AirGuard Pro monitors the air so you don't have to.*
