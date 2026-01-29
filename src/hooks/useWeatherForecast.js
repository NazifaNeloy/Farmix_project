import { useState, useEffect } from 'react';

const DISTRICT_COORDINATES = {
    "Dhaka": { lat: 23.8103, lon: 90.4125 },
    "Chittagong": { lat: 22.3569, lon: 91.7832 },
    "Sylhet": { lat: 24.8949, lon: 91.8687 },
    "Khulna": { lat: 22.8456, lon: 89.5403 },
    "Rajshahi": { lat: 24.3636, lon: 88.6241 },
    "Rangpur": { lat: 25.7439, lon: 89.2752 },
    "Barisal": { lat: 22.7010, lon: 90.3535 },
    "Mymensingh": { lat: 24.7471, lon: 90.4203 },
    "Comilla": { lat: 23.4607, lon: 91.1809 }
};

export const useWeatherForecast = (districtName) => {
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchWeather = async () => {
            setLoading(true);
            setError(null);

            try {
                // 1. Get Coordinates
                const cleanDistrict = districtName?.split(',')[0]?.trim() || "Dhaka";
                const coords = DISTRICT_COORDINATES[cleanDistrict] || DISTRICT_COORDINATES["Dhaka"];
                const { lat, lon } = coords;

                // 2. Fetch Data from Open-Meteo
                const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,precipitation_probability_max,relative_humidity_2m_max,weather_code&timezone=auto&forecast_days=7`;

                const response = await fetch(url);
                if (!response.ok) throw new Error('Weather fetch failed');
                const data = await response.json();

                // 3. Format Data
                const daily = data.daily;
                const formattedForecast = daily.time.map((date, index) => {
                    // Map WMO weather codes to readable strings
                    const code = daily.weather_code[index];
                    let weatherDesc = "Clear";
                    if (code >= 1 && code <= 3) weatherDesc = "Clouds";
                    if (code >= 51 && code <= 67) weatherDesc = "Rain";
                    if (code >= 80 && code <= 82) weatherDesc = "Rain";
                    if (code >= 95) weatherDesc = "Thunderstorm";

                    return {
                        date: date,
                        temp: daily.temperature_2m_max[index],
                        rainProb: daily.precipitation_probability_max[index],
                        humidity: daily.relative_humidity_2m_max[index],
                        weather: weatherDesc,
                        weatherCode: code
                    };
                });

                // Structure for compatibility with existing components
                setWeatherData({
                    current: {
                        temp: formattedForecast[0].temp,
                        humidity: formattedForecast[0].humidity,
                        weather: formattedForecast[0].weather
                    },
                    forecast: formattedForecast
                });

            } catch (err) {
                console.error("Weather hook error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
    }, [districtName]);

    return { weatherData, loading, error };
};
