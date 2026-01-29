/**
 * Generates hyper-specific Bangla advice based on Crop + Weather + Risk.
 * @param {string} crop - The crop name (e.g., 'Potato', 'Paddy')
 * @param {object} weather - Weather data object (temp, humidity, forecast)
 * @param {string} riskLevel - 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
 * @returns {string} Bangla advice message
 */
export const generateSmartAlert = (crop, weather, riskLevel) => {
    const cropName = crop?.toLowerCase() || '';

    // Extract data from the weather object structure returned by weatherService
    const current = weather?.current || {};
    const nextDay = weather?.forecast?.[0] || {};

    const humidity = current.humidity || 0;
    const temp = current.temp || 25;

    // Check tomorrow's forecast for rain logic
    const forecastCondition = nextDay.weather?.toLowerCase() || '';
    const isRainy = forecastCondition.includes('rain') || forecastCondition.includes('drizzle');

    // 1. Potato + High Humidity + Rain (The specific example requested)
    if (cropName.includes('potato') || cropName.includes('alu')) {
        if (humidity > 80 && isRainy) {
            return "আগামীকাল বৃষ্টি হবে এবং আপনার আলুর গুদামে আর্দ্রতা বেশি। এখনই ফ্যান চালু করুন।";
        }
        if (riskLevel === 'CRITICAL' || riskLevel === 'HIGH') {
            return "আলুর ব্লাইট রোগের ঝুঁকি রয়েছে। দ্রুত ছত্রাকনাশক স্প্রে করুন।";
        }
    }

    // 2. Paddy (Rice) Rules
    if (cropName.includes('paddy') || cropName.includes('rice') || cropName.includes('dhan')) {
        if (temp > 35) {
            return "তাপমাত্রা অনেক বেশি, ধানের জমিতে পর্যাপ্ত পানি নিশ্চিত করুন।";
        }
        if (isRainy && riskLevel === 'HIGH') {
            return "ভারী বৃষ্টির সম্ভাবনা। জমির ড্রেনেজ ব্যবস্থা ঠিক রাখুন।";
        }
    }

    // 3. Wheat Rules
    if (cropName.includes('wheat') || cropName.includes('gom')) {
        if (isRainy) {
            return "গম ক্ষেতে পানি জমতে দেবেন না, এতে ফলন কমতে পারে।";
        }
    }

    // 4. General Risk-Based Fallbacks
    if (riskLevel === 'CRITICAL') {
        return "জরুরী সতর্কতা! আপনার ফসলের অবস্থা ঝুঁকিপূর্ণ। বিশেষজ্ঞের পরামর্শ নিন।";
    }
    if (riskLevel === 'HIGH') {
        return "সতর্কতা: আবহাওয়া অনুকূল নয়। নিয়মিত পর্যবেক্ষণ করুন।";
    }
    if (riskLevel === 'MEDIUM') {
        return "ফসলের অবস্থা মোটামুটি ভালো, তবে আবহাওয়ার দিকে খেয়াল রাখুন।";
    }

    return "আবহাওয়া অনুকূল আছে। নিয়মিত পরিচর্যা চালিয়ে যান।";
};

/**
 * Simulates sending an SMS for critical alerts.
 * @param {string} message - The message to send
 * @param {string} phoneNumber - (Optional) Target phone number
 */
export const logSimulatedSMS = (message, phoneNumber = 'User') => {
    console.log(`%c[SMS SENT to ${phoneNumber}]: ${message}`, 'color: #10b981; font-weight: bold; background: #ecfdf5; padding: 4px;');
};
