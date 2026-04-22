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

### Software & Firmware
- **Arduino IDE / ESP-IDF** — Firmware programming
- **C/C++** — Embedded code
- **Wi-Fi** — ESP32 data transmission to cloud

### Web Dashboard
- **Frontend** — HTML, CSS, JavaScript
- **Auth** — Firebase Authentication (MFA, Google, GitHub OAuth)
- **Security** — 256-bit SSL, Zero Trust Architecture
- **Hosting** — Render.com
- **Real-time Data** — Live telemetry from ESP32 sensors

---

## 📊 Dashboard Features

| Feature | Description |
|---------|-------------|
| 🟢 Live Sensor Feed | Real-time MQ-2 & MQ-135 gas telemetry |
| 📈 AQI Index | Live Air Quality Index with historical charts |
| 🚨 Smart Alerts | Notifications when gas exceeds safe thresholds |
| 🔐 Secure Login | Firebase Auth with MFA protection |
| ☁️ Cloud Sync | Sensor data streamed to dashboard via ESP32 Wi-Fi |

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

---

## 🙌 Acknowledgements

- [Espressif Systems](https://www.espressif.com/) — ESP32
- [Adafruit](https://www.adafruit.com/) — DHT22 Library
- [Firebase](https://firebase.google.com/) — Authentication
- [Render](https://render.com/) — Dashboard Hosting

---

> ⚡ *Built with passion for safer environments — AirGuard Pro monitors the air so you don't have to.*
