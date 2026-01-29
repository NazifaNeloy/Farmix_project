export const calculateRisk = (batch, weatherForecast) => {
    const cropType = batch.cropType || batch.crop || 'Paddy/Rice';
    const riskFactors = [];

    // 1. Define Crop Profiles
    const profiles = {
        'Paddy/Rice': { baseEtcl: 120, moistureThreshold: 14, tempThreshold: 30, heatSensitive: false },
        'Wheat': { baseEtcl: 96, moistureThreshold: 13.5, tempThreshold: 25, heatSensitive: true },
        'Corn (Maize)': { baseEtcl: 72, moistureThreshold: 15, tempThreshold: 30, heatSensitive: false }, // High sugar/starch = fast spoilage
        'Potato': { baseEtcl: 168, moistureThreshold: 80, tempThreshold: 20, heatSensitive: true }, // Tuber, sensitive to heat not moisture content in same way
        'Mustard': { baseEtcl: 144, moistureThreshold: 10, tempThreshold: 30, heatSensitive: false } // Oilseed
    };

    const profile = profiles[cropType] || profiles['Paddy/Rice'];
    let etclHours = profile.baseEtcl;

    // 2. Moisture Penalty
    // Default to safe-ish high value if missing to trigger warning
    const moisture = batch.moistureContent ? parseFloat(batch.moistureContent) : (cropType === 'Potato' ? 85 : 20);

    if (moisture > profile.moistureThreshold) {
        const excess = moisture - profile.moistureThreshold;
        // Potatoes rot differently (soft rot), grains mold
        const penaltyMultiplier = cropType === 'Potato' ? 5 : 10;
        const penalty = excess * penaltyMultiplier;
        etclHours -= penalty;
        riskFactors.push(`High Moisture (${moisture}%)`);
    }

    // 3. Heat Penalty
    const currentTemp = weatherForecast?.current?.temp || 30;
    if (currentTemp > profile.tempThreshold) {
        // Heat sensitive crops (Wheat, Potato) suffer more
        const heatPenalty = profile.heatSensitive ? 36 : 24;
        etclHours -= heatPenalty;
        riskFactors.push(`High Ambient Temp (${currentTemp}°C)`);
    }

    // 4. Storage Bonus
    const storage = batch.storageType || '';
    if (storage.includes('Silo') || storage.includes('Drum') || storage.includes('Sealed') || storage.includes('Cold')) {
        etclHours += 48;
        // Cold storage bonus for Potato
        if (cropType === 'Potato' && storage.includes('Cold')) {
            etclHours += 72;
        }
    }

    // Ensure ETCL doesn't go below 0
    etclHours = Math.max(0, etclHours);

    // 5. Weather Refinement
    let dryingRisk = false;
    let rainDayIndex = -1;

    if (weatherForecast && weatherForecast.forecast) {
        const daysToCheck = Math.ceil(etclHours / 24);
        for (let i = 0; i < Math.min(daysToCheck, weatherForecast.forecast.length); i++) {
            if (weatherForecast.forecast[i].rainProb > 50) {
                dryingRisk = true;
                rainDayIndex = i;
                break;
            }
        }
    }

    // 6. Determine Risk Level & Advice
    let riskLevel = 'SAFE';
    let color = 'green';
    let advice = "✅ **Stable.** Conditions are favorable.";

    if (etclHours < 24) {
        riskLevel = 'CRITICAL';
        color = 'red';
        advice = "⚠️ **CRITICAL SPOILAGE RISK.** Immediate action required.";
    } else if (etclHours < 48) {
        riskLevel = 'HIGH';
        color = 'orange';
        advice = "⚠️ **High Risk.** Spoilage likely within 2 days.";
    }

    // Crop-Specific Advice Overrides
    if (dryingRisk) {
        const dayStr = rainDayIndex === 0 ? "tomorrow" : `in ${rainDayIndex + 1} days`;
        if (cropType === 'Potato') {
            advice = `⚠️ **Rot Risk.** Rain predicted ${dayStr}. Keep dry and cool to prevent soft rot.`;
        } else {
            advice = `⚠️ **Mold Risk.** Rain predicted ${dayStr}. Outdoor drying impossible. Aerate immediately.`;
        }

        if (riskLevel === 'SAFE') {
            riskLevel = 'HIGH';
            color = 'orange';
        }
    } else if (currentTemp > 35) {
        if (cropType === 'Potato') {
            advice = "🔥 **Heat Stress.** Potatoes degrading rapidly. Move to cold storage or shaded area.";
        } else {
            advice = "🔥 **Heat Stress.** Grain temp high. Turn/Rotate stack to release heat.";
        }
    }

    return {
        riskLevel,
        etclHours,
        advice,
        color,
        riskFactors
    };
};
