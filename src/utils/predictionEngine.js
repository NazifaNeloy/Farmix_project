import { addDays, format } from 'date-fns';

// 1. MOCK WEATHER GENERATOR
export const getMockWeatherForecast = (district) => {
    const today = new Date();
    const forecast = [];

    // Demo Constraint: Ensure at least one day in the next 3 days has rain
    const rainDayIndex = Math.floor(Math.random() * 3); // 0, 1, or 2

    for (let i = 0; i < 7; i++) {
        const date = addDays(today, i);
        const dateStr = format(date, 'yyyy-MM-dd');

        let isRainDay = i === rainDayIndex;

        // Randomize other days
        if (i > 2) {
            isRainDay = Math.random() > 0.7;
        }

        const temp = Math.floor(Math.random() * (36 - 28 + 1)) + 28; // 28-36
        const humidity = Math.floor(Math.random() * (95 - 60 + 1)) + 60; // 60-95

        let rainProb = Math.floor(Math.random() * 101); // 0-100
        let condition = "Sunny";

        if (isRainDay) {
            rainProb = Math.floor(Math.random() * (100 - 61 + 1)) + 61; // > 60
            condition = "Rain";
        } else {
            rainProb = Math.floor(Math.random() * 60); // < 60
            condition = rainProb > 30 ? "Cloudy" : "Sunny";
        }

        forecast.push({
            date: dateStr,
            temp,
            humidity,
            rainProb,
            condition
        });
    }

    return forecast;
};

// 2. THE ETCL ALGORITHM
export const calculatePrediction = (batchData, weatherForecast) => {
    // A. Baseline Calculation
    let etclHours = 120; // Default for Paddy
    const cropType = batchData.cropType || 'Paddy';

    // Adjust base ETCL for other crops if needed, but requirement says "Start with 120 Hours for fresh Paddy"
    // We'll stick to the requirement for now, or add simple switches if batchData has other crops.

    // Moisture Penalty
    const moisture = parseFloat(batchData.moistureContent || 0);
    const safeMoisture = 14;
    if (moisture > safeMoisture) {
        const excess = moisture - safeMoisture;
        const penalty = Math.ceil(excess) * 5; // 5 hours per 1%
        etclHours -= penalty;
    }

    // Heat Penalty
    // Assuming current temp is from the first day of forecast (Today)
    const currentTemp = weatherForecast[0]?.temp || 30;
    if (currentTemp > 30) {
        etclHours -= 10;
    }

    // B. Weather Refinement (The "Smart" Part)
    let riskFactor = null;

    // Look at next 3 days (indices 0, 1, 2)
    const etclDays = etclHours / 24;
    const daysToCheck = Math.min(3, Math.ceil(etclDays)); // Check relevant days up to 3

    for (let i = 0; i < daysToCheck; i++) {
        const day = weatherForecast[i];
        if (day.rainProb > 50) {
            // The "dryingTrap" Rule
            etclHours = etclHours * 0.5; // Reduce by 50% immediately
            riskFactor = "Rain Blocking Drying";
            break; // Apply once
        }
    }

    // 3. OUTPUT FORMATTING
    let riskLevel = "Low";
    let color = "green";
    let message = `Stable. Moisture is ${moisture}%. Weather is favorable.`;

    if (etclHours < 24) {
        riskLevel = "Critical";
        color = "red";
    } else if (etclHours < 48) {
        riskLevel = "High";
        color = "orange";
    } else if (etclHours < 72) {
        riskLevel = "Medium";
        color = "yellow";
    }

    // Construct Message
    if (riskLevel === "Critical" || riskLevel === "High") {
        if (riskFactor === "Rain Blocking Drying") {
            message = `${riskLevel} Risk of Spoilage (ETCL: ${Math.round(etclHours)} hours). Rain is predicted, making sun-drying impossible. Use indoor aeration immediately.`;
        } else if (moisture > safeMoisture) {
            message = `${riskLevel} Risk (ETCL: ${Math.round(etclHours)} hours). Moisture is critically high (${moisture}%). Immediate drying required.`;
        } else {
            message = `${riskLevel} Risk (ETCL: ${Math.round(etclHours)} hours). Conditions are degrading rapidly.`;
        }
    } else {
        if (riskFactor === "Rain Blocking Drying") {
            message = `Caution. Rain predicted. Sun-drying may be difficult. (ETCL: ${Math.round(etclHours)} hours)`;
            color = "yellow"; // Upgrade warning
        } else {
            message = `Stable. Moisture is ${moisture}%. Weather looks good for now.`;
        }
    }

    return {
        etclHours: Math.round(etclHours),
        riskLevel,
        color,
        message,
        forecast: weatherForecast.slice(0, 3) // Return next 3 days for UI
    };
};
