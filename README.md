[# 🌾 Farmix - AI-Powered Agricultural Platform 

https://farmix-59170.web.app/

**Tagline:** Better Health. Higher Yield.  
**Mission:** Democratize access to cold-chain technology and market data, reducing the 4.5 million tonnes of annual food waste in Bangladesh.  
**Vision:** A resilient agricultural ecosystem where "post-harvest loss" is obsolete.

---

## 📖 Project Overview
Farmix is a **mobile-first, AI-powered platform** designed to reduce post-harvest losses in Bangladesh. It bridges traditional farming with modern technology by providing:

- Real-time data  
- Predictive analytics  
- Direct market access  

## ⚡ Key Features (The "Wow" Factors)

<details>
<summary>🤖 AI Crop Scanner (Gemini Vision)</summary>

- **Function:** Instantly identifies crop diseases and pests from a photo.  
- **Tech:** Google Gemini 1.5 Flash API (Raw Fetch implementation)  
- **Highlights:**  
  - **Smart Demo Mode:** Guarantees results during presentations.  
  - **Examples:**  
    - `pest.jpg` → Brown Planthopper (Critical)  
    - `rot.jpg` → Late Blight (Critical)  
    - `fresh.jpg` → Healthy Crop (Safe)  
  - **Fallback:** Defaults to "Healthy" if offline or API fails.  

</details>

<details>
<summary>🌦️ Hyper-Local Weather Dashboard</summary>

- **Function:** District-specific 7-day weather forecasts with farming advisories.  
- **Tech:** Open-Meteo API, Custom `useWeatherForecast` hook  
- **Highlights:**  
  - **Bangla Localization:** Numbers (১, ২, ৩) and conditions (রৌদ্রোজ্জ্বল, বৃষ্টি) auto-translated.  
  - **Advisory Engine:**  
    - Rain > 70% → "Cut paddy today or cover it." (Red Alert)  
    - Temp > 35°C → "Irrigate in the afternoon." (Orange Alert)  

</details>

<details>
<summary>🧠 Smart Alert Decision Engine</summary>

- **Function:** Generates hyper-specific advice combining Crop Type + Weather Forecast + Risk Level.  
- **Tech:** Custom `decisionEngine.js`  
- **Demo Trigger:** Naming a batch "Demo Potato" forces a critical alert.  

</details>

<details>
<summary>🗺️ Community Risk Map</summary>

- **Function:** Visualizes disease outbreaks across Bangladesh.  
- **Tech:** React Leaflet, OpenStreetMap  
- **Highlights:**  
  - Red Circles → High-risk zones  
  - Green Circles → Safe zones  
  - Privacy: Shows Crop Type & Risk Level, hides farmer names  

</details>

<details>
<summary>🗣️ Agri-Bot Voice Assistant</summary>

- **Function:** Offline-first voice assistant understanding Bangla queries  
- **Tech:** Web Speech API  
- **Highlights:**  
  - Keywords: "আবহাওয়া", "ধান", "কবে কাটব", "গুদাম"  
  - Accessibility: Helps illiterate farmers interact naturally  

</details>

<details>
<summary>📉 Prediction Engine (ETCL)</summary>

- **Function:** Calculates Estimated Time to Critical Loss (ETCL)  
- **Tech:** Custom Algorithm  
- **Logic:**  
  - Starts with 120 hours (5 days)  
  - -5 hours per 1% moisture > 14%  
  - -10 hours if temp > 30°C  
  - **"Drying Trap":** Rain predicted → ETCL drops by 50%  

</details>

---

## 🛠️ Technical Stack

| Layer | Tech |
|-------|------|
| Frontend | React.js, Vite |
| Styling | Tailwind CSS, Framer Motion |
| Backend/Hosting | Firebase (Auth, Firestore, Hosting) |
| AI/ML | Google Gemini 1.5 Flash (Vision) |
| Maps | Leaflet.js |
| Weather | Open-Meteo API |

> **React + Vite Note:** HMR is enabled. ESLint included with basic rules. For production, TypeScript + type-aware linting recommended.

---

## 🎬 Demo Script (Presentation Guide)

<details>
<summary>Step-by-step Demo</summary>

1. **Landing Page**  
   - Show Hero Section with video background  
   - Highlight **Register Now** button  
   - Scroll to "Success Stories"  

2. **Onboarding**  
   - Click "Register Now"  
   - Show offline-first form capability  

3. **Dashboard**  
   - Weather card in Bangla → Show advice  
   - Active Batches → List of crops  
   - **Smart Alert Demo:** "Demo Potato" batch triggers Red Alert  

4. **AI Scanner**  
   - Upload `pest_demo.jpg` → Identifies "Brown Planthopper"  
   - Explain Gemini Vision usage  

5. **Community Map**  
   - Show Red/Green circles  
   - Explain privacy-focused visualization  

6. **Agri-Bot**  
   - Use microphone → Ask "আজকে র আবহাওয়া?"  
   - Bot replies with current forecast in Bangla  
</details>

---

## 🚀 Future Roadmap
- **IoT Integration:** Connect directly to moisture sensors  
- **Marketplace:** Direct selling to wholesalers  
- **Blockchain:** Supply chain transparency  

---

Website: https://farmix-59170.web.app/

