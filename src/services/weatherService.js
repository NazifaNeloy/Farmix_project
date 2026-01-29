import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/forecast';

export const fetchWeatherForecast = async (location) => {
    try {
        const query = location || 'Dhaka';
        const response = await axios.get(`${BASE_URL}?q=${query}&units=metric&appid=${API_KEY}`);
        return processForecastData(response.data);
    } catch (error) {
        console.error("Weather fetch failed:", error);
        // Fallback to Dhaka if location fails
        if (location !== 'Dhaka') {
            return fetchWeatherForecast('Dhaka');
        }
        throw error;
    }
};

const processForecastData = (data) => {
    const dailyData = {};

    // Group by date
    data.list.forEach(item => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        if (!dailyData[date]) {
            dailyData[date] = {
                temps: [],
                humidities: [],
                rainProbs: [],
                weatherCounts: {},
                dt: item.dt
            };
        }
        dailyData[date].temps.push(item.main.temp);
        dailyData[date].humidities.push(item.main.humidity);
        dailyData[date].rainProbs.push(item.pop * 100); // Probability of precipitation

        // Count weather conditions to find most frequent
        const mainWeather = item.weather[0].main;
        dailyData[date].weatherCounts[mainWeather] = (dailyData[date].weatherCounts[mainWeather] || 0) + 1;
    });

    // Process into 5-day summary
    const processed = Object.values(dailyData).slice(0, 5).map(day => {
        const maxTemp = Math.max(...day.temps);
        const maxHumidity = Math.max(...day.humidities);
        const maxRainProb = Math.max(...day.rainProbs);

        // Find dominant weather
        const dominantWeather = Object.entries(day.weatherCounts).reduce((a, b) => a[1] > b[1] ? a : b)[0];

        const dateObj = new Date(day.dt * 1000);
        const dayNameEn = dateObj.toLocaleDateString('en-US', { weekday: 'long' });

        return {
            date: dateObj,
            dayName: dayNameEn,
            temp: Math.round(maxTemp),
            humidity: Math.round(maxHumidity),
            rainProb: Math.round(maxRainProb),
            weather: dominantWeather,
            advice: generateAdvice(maxTemp, maxRainProb, maxHumidity)
        };
    });

    return {
        location: data.city.name, // Use city name from API
        current: processed[0],
        forecast: processed.slice(1)
    };
};

const generateAdvice = (temp, rainProb, humidity) => {
    if (rainProb > 70) {
        return {
            type: 'warning',
            code: 'rainWarning',
            icon: 'rain'
        };
    } else if (temp > 35) {
        return {
            type: 'alert',
            code: 'heatAlert',
            icon: 'sun'
        };
    } else {
        return {
            type: 'success',
            code: 'goodCondition',
            icon: 'shield'
        };
    }
};

export const getExtendedForecast = (currentForecast) => {
    if (!currentForecast || !currentForecast.forecast || currentForecast.forecast.length === 0) {
        return [];
    }

    const lastDay = currentForecast.forecast[currentForecast.forecast.length - 1];
    const extended = [...currentForecast.forecast];

    // Generate 2 extra days
    for (let i = 1; i <= 2; i++) {
        const nextDate = new Date(lastDay.date);
        nextDate.setDate(nextDate.getDate() + i);

        const dayNameEn = nextDate.toLocaleDateString('en-US', { weekday: 'long' });

        // Simple randomization based on last day's trend
        const tempVariation = Math.floor(Math.random() * 5) - 2; // -2 to +2
        const rainVariation = Math.floor(Math.random() * 20) - 10; // -10 to +10

        const newTemp = Math.max(10, Math.min(45, lastDay.temp + tempVariation));
        const newRainProb = Math.max(0, Math.min(100, lastDay.rainProb + rainVariation));

        // Determine weather based on rain prob
        let weather = 'Clear';
        if (newRainProb > 60) weather = 'Rain';
        else if (newRainProb > 30) weather = 'Clouds';

        extended.push({
            date: nextDate,
            dayName: dayNameEn,
            temp: newTemp,
            humidity: lastDay.humidity, // Keep humidity similar
            rainProb: newRainProb,
            weather: weather,
            isMock: true // Flag to identify mock data if needed
        });
    }

    return extended;
};
