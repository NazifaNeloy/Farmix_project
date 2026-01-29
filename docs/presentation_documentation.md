# Farmix - Project Documentation & Presentation Guide

## 1. Project Overview
**Farmix** is a mobile-first, AI-powered agricultural platform designed to reduce post-harvest losses in Bangladesh. It bridges the gap between traditional farming and modern technology by providing real-time data, predictive analytics, and direct market access.

*   **Tagline:** Better Health. Higher Yield.
*   **Mission:** To democratize access to cold-chain technology and market data, reducing the 4.5 million tonnes of annual food waste.
*   **Vision:** A resilient agricultural ecosystem where "post-harvest loss" is obsolete.

## 2. Key Features (The "Wow" Factors)

### 🤖 AI Crop Scanner (Gemini Vision)
*   **What it does:** Instantly identifies crop diseases and pests from a photo.
*   **Tech:** Google Gemini 1.5 Flash API (Raw Fetch implementation).
*   **Key Capability:**
    *   **Smart Demo Mode:** Guarantees results during presentations.
        *   Upload `pest.jpg` -> **Brown Planthopper (Critical)**
        *   Upload `rot.jpg` -> **Late Blight (Critical)**
        *   Upload `fresh.jpg` -> **Healthy Crop (Safe)**
    *   **Fallback:** If offline or API fails, it defaults to a safe "Healthy" state or uses the filename trigger.

### 🌦️ Hyper-Local Weather Dashboard
*   **What it does:** Provides district-specific 7-day weather forecasts with farming-specific advisories.
*   **Tech:** Open-Meteo API (No API key required), Custom `useWeatherForecast` hook.
*   **Key Capability:**
    *   **Bangla Localization:** All numbers (১, ২, ৩) and conditions (রৌদ্রোজ্জ্বল, বৃষ্টি) are automatically translated.
    *   **Advisory Engine:**
        *   **Rain > 70%:** "Cut paddy today or cover it." (Red Alert)
        *   **Temp > 35°C:** "Irrigate in the afternoon." (Orange Alert)

### 🧠 Smart Alert Decision Engine
*   **What it does:** Generates hyper-specific advice by combining **Crop Type + Weather Forecast + Risk Level**.
*   **Tech:** Custom `decisionEngine.js`.
*   **Key Capability:**
    *   **Scenario S (Potato + Rain):** "Tomorrow rain is predicted. High humidity detected in storage. Move potatoes immediately."
    *   **Demo Trigger:** Naming a batch **"Demo Potato"** forces this critical alert to appear on the dashboard, regardless of actual weather.

### 🗺️ Community Risk Map
*   **What it does:** Visualizes disease outbreaks across Bangladesh using a privacy-focused map.
*   **Tech:** React Leaflet, OpenStreetMap.
*   **Key Capability:**
    *   **Red Circles:** High-risk zones (Disease detected).
    *   **Green Circles:** Safe zones.
    *   **Privacy:** Shows "Crop Type" and "Risk Level" but hides farmer names.

### 🗣️ Agri-Bot Voice Assistant
*   **What it does:** An offline-first voice assistant that understands Bangla queries.
*   **Tech:** Web Speech API (Recognition & Synthesis).
*   **Key Capability:**
    *   **Keywords:** Understands "আবহাওয়া" (Weather), "ধান" (Paddy/Crop), "কবে কাটব" (Harvest), "গুদাম" (Storage).
    *   **Accessibility:** Allows illiterate farmers to interact with the app naturally.

### 📉 Prediction Engine (ETCL)
*   **What it does:** Calculates **Estimated Time to Critical Loss (ETCL)**.
*   **Tech:** Custom Algorithm.
*   **Logic:**
    *   Starts with 120 hours (5 days).
    *   **-5 hours** for every 1% moisture > 14%.
    *   **-10 hours** if temp > 30°C.
    *   **"Drying Trap":** If rain is predicted, ETCL drops by 50% immediately.

## 3. Technical Stack
*   **Frontend:** React.js, Vite
*   **Styling:** Tailwind CSS, Framer Motion (Animations)
*   **Backend/Hosting:** Firebase (Auth, Firestore, Hosting)
*   **AI/ML:** Google Gemini 1.5 Flash (Vision)
*   **Maps:** Leaflet.js
*   **Weather:** Open-Meteo API

## 4. Demo Script (For Presentation)

### Step 1: The Hook (Landing Page)
*   Show the **Hero Section** with the video background.
*   Point out the **"Register Now"** button (Call to Action).
*   Scroll down to **"Success Stories"** to show social proof.

### Step 2: Onboarding (Auth)
*   Click "Register Now".
*   Show the **"Offline-First"** capability (form works even if network is slow).

### Step 3: The Dashboard (The "Cockpit")
*   **Weather:** Show the Bangla weather card at the top. Point out the specific advice (e.g., "Rain warning").
*   **Active Batches:** Show the list of crops.
*   **Smart Alert (The "Magic"):**
    *   *Action:* Point to the **"Demo Potato"** batch.
    *   *Result:* Show the **Red Alert Box** saying "High humidity detected...". Explain that this is the **Decision Engine** in action.

### Step 4: AI Scanner (The "Wow" Moment)
*   Go to **AI Scanner** page.
*   *Action:* Upload a file named `pest_demo.jpg`.
*   *Result:* App instantly identifies **"Brown Planthopper"** and gives organic solutions.
*   *Explain:* "This uses Google's Gemini Vision to diagnose crops in seconds."

### Step 5: Community Map (The "Big Picture")
*   Go to **Community Map** page.
*   Show the **Red/Green circles**.
*   *Explain:* "This helps the government and NGOs see disease outbreaks in real-time."

### Step 6: Agri-Bot (Accessibility)
*   Click the **Microphone Icon**.
*   *Say (or type):* "আজকে র আবহাওয়া?" (Weather today?)
*   *Result:* Bot replies with the current forecast in Bangla.

## 5. Future Roadmap
*   **IoT Integration:** Direct connection to moisture sensors.
*   **Marketplace:** Direct selling to wholesalers.
*   **Blockchain:** Supply chain transparency.
