# 🛡️ AirGuard Pro — IoT-Based Hazardous Gas & Temperature Detection System

![Project Banner](https://house-monitoring-1.onrender.com/)

> **Real-time air quality monitoring, hazardous gas detection, and temperature sensing — powered by ESP32 with a live web dashboard.**

---

## 📸 Project Hardware

![AirGuard Pro Hardware Setup](https://raw.githubusercontent.com/yourusername/airguard-pro/main/assets/hardware.jpeg)

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
- [Dashboard Features](#dashboard-features)
- [How It Works](#how-it-works)
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

The web dashboard **[GasMonitor Pro](https://house-monitoring-1.onrender.com/)** is the software interface of this project. Here's a detailed breakdown of every feature:

---

### 🔐 1. Secure Authentication System

The dashboard is protected with an enterprise-grade authentication system:

| Auth Feature | Details |
|---|---|
| **Email & Password Login** | Standard credential-based login with password strength indicator |
| **Google OAuth** | One-click sign-in via Google account |
| **GitHub OAuth** | Developer-friendly login via GitHub account |
| **Sign Up / Register** | New user registration with full name, email, and password |
| **Forgot Password** | Built-in password recovery flow |
| **MFA Ready** | Multi-Factor Authentication support for extra security |
| **256-bit SSL** | All data transmitted over encrypted HTTPS connection |
| **Firebase Auth** | Powered by Google Firebase — industry-standard auth backend |
| **Zero Trust Security** | Every request is verified; no implicit trust granted |
| **Session Security** | Sessions are securely managed and validated on each load |

> The login page displays **"Session secure"** and **"Sensors Online"** status badges, confirming both security and hardware connectivity at a glance.

---

### 📡 2. Real-Time Sensor Telemetry

Once logged in, the dashboard displays **live data** streamed directly from the ESP32:

- 🟠 **MQ-2 Combustible Gas Levels** — Real-time PPM values for LPG, methane, smoke, and flammable gases
- 🟣 **MQ-135 Air Quality Data** — Continuous pollution readings for CO₂, NH₃, benzene, and harmful vapors
- 🌡️ **DHT22 Temperature & Humidity** — Ambient temperature and humidity streamed live

Data refreshes automatically — no page reload needed.

---

### 📊 3. Live AQI Index (Air Quality Index)

- Calculates a **real-time AQI score** based on MQ-135 sensor readings
- Displays the **current air quality status** (Good / Moderate / Unhealthy / Hazardous)
- Shows **historical trend charts** so you can track air quality over time
- Helps users understand long-term pollution patterns in their environment

---

### 🚨 4. Smart Hazard Alert System

- Automatically **detects when gas levels exceed preset safety thresholds**
- Triggers **instant alerts on the dashboard** when dangerous levels are detected
- Works in sync with the **physical buzzer** on the ESP32 hardware
- Alerts remain active until gas levels **return to safe range**
- Designed for **immediate human response** in case of gas leaks or fire hazards

---

### 📈 5. Historical Data & Trend Charts

- Logs all sensor readings over time
- Displays **graphical trend charts** for gas levels and temperature
- Allows users to **analyze patterns** — e.g., recurring high CO₂ at certain hours
- Helps in **predictive safety monitoring** over days/weeks

---

### ☁️ 6. Cloud-Connected & Always-On

- **99.9% sensor uptime** — Dashboard always reflects current hardware status
- ESP32 pushes data to cloud continuously via **Wi-Fi HTTP requests**
- Dashboard is hosted on **Render.com** — accessible from any device, anywhere
- **"Sensors Online"** badge confirms live ESP32 connection on the login screen itself

---

---

## 🚀 How It Works

1. **ESP32** reads sensor data every few seconds
2. Data is sent over **Wi-Fi** to the cloud backend
3. The **web dashboard** displays live readings, AQI, and alerts
4. If readings cross **safety thresholds**:
   - 🔔 Buzzer activates on the device
   - 🚨 Alert is pushed to the dashboard
5. System **auto-resets** when air quality returns to safe levels

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
