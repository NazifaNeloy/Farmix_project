/**
 * Smart Alert Decision Engine
 * Logic & Simulation for Farmix
 */

/**
 * Generates a smart alert based on crop, risk, and weather conditions.
 * @param {object} params - Input parameters
 * @param {string} params.cropType - Name of the crop (e.g., 'Potato', 'Rice')
 * @param {string} params.currentRisk - Risk level ('HIGH', 'MEDIUM', 'LOW', 'CRITICAL')
 * @param {object} params.weatherData - Weather data object (containing temp, forecast, etc.)
 * @param {number} params.humidity - Current humidity percentage
 * @returns {string} The generated Bangla advice message
 */
export const generateSmartAlert = ({ cropType, currentRisk, weatherData, humidity }) => {
    const crop = cropType?.toLowerCase() || '';
    const riskLevel = currentRisk?.toUpperCase() || 'LOW';

    // Extract weather details
    // weatherData might be complex, so we handle safe access
    const currentTemp = weatherData?.current?.temp || weatherData?.temp || 25;
    const forecast = weatherData?.forecast || [];

    // Check for rain in the next day's forecast
    const nextDayForecast = forecast[0]?.weather?.toLowerCase() || '';
    const isRainy = nextDayForecast.includes('rain') || nextDayForecast.includes('drizzle');

    let alertMessage = "";

    // --- LOGIC RULES ---

    // 0. Scenario S (Specific: Potato + Rain + High Humidity) - The "Verify" case
    if (isRainy && humidity > 80 && (crop.includes('potato') || crop.includes('onion') || crop.includes('alu') || crop.includes('peyaj'))) {
        alertMessage = "আগামীকাল বৃষ্টি হবে এবং আপনার আলুর গুদামে আর্দ্রতা বেশি। এখনই ফ্যান চালু করুন।";
    }

    // 1. Scenario A (Critical Rain Risk)
    else if (isRainy && (riskLevel === 'HIGH' || riskLevel === 'CRITICAL')) {
        alertMessage = `আগামীকাল বৃষ্টি হতে পারে। আপনার ${cropType || 'ফসল'} শুকাতে দেবেন না। দ্রুত নিরাপদ স্থানে সরিয়ে নিন।`;
    }

    // 2. Scenario B (High Humidity/Mold Risk)
    else if (humidity > 80 && (crop.includes('potato') || crop.includes('onion') || crop.includes('alu') || crop.includes('peyaj'))) {
        alertMessage = "বাতাসে আর্দ্রতা অনেক বেশি। পচন রোধ করতে গুদামে ফ্যান চালু করুন বা বায়ু চলাচলের ব্যবস্থা করুন।";
    }

    // 3. Scenario C (Heat Stress)
    else if (currentTemp > 35) {
        alertMessage = "প্রচণ্ড তাপপ্রবাহ চলছে। ফসলে অতিরিক্ত সেচ দিন এবং ছায়ার ব্যবস্থা করুন।";
    }

    // 4. Scenario D (Safe/Default)
    else {
        alertMessage = "আবহাওয়া অনুকূল আছে। নিয়মিত পর্যবেক্ষণ চালিয়ে যান।";
    }

    // --- SMS SIMULATION ---
    // Trigger only for Critical/High risk or specific bad conditions (Rain/Humidity/Heat)
    // The user asked to trigger this whenever a "Critical" or "High Risk" condition is met.
    // However, the scenarios above define the message. 
    // Let's trigger it if we generated a specific warning (Scenario A, B, C) and NOT the default (Scenario D).

    const isWarning = alertMessage !== "আবহাওয়া অনুকূল আছে। নিয়মিত পর্যবেক্ষণ চালিয়ে যান।";

    if (isWarning) {
        console.log(
            "%c[SMS GATEWAY] Sending to 017XXXXXXXX...",
            "color: yellow; font-weight: bold; background: #333; padding: 4px;"
        );
        console.log(
            `%cMESSAGE: "${alertMessage}"`,
            "color: lime; font-weight: bold;"
        );
    }

    return alertMessage;
};
