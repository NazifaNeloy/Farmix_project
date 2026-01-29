import React, { useState, useEffect } from 'react';
import { Cloud, CloudRain, Sun, CloudLightning, Wind, Droplets, Thermometer, ShieldCheck, AlertTriangle } from 'lucide-react';
import { fetchWeatherForecast } from '../services/weatherService';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const WeatherWidget = () => {
    const { userData } = useAuth();
    const { t, language } = useLanguage();
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadWeather = async () => {
            try {
                // Use user's location or default to Dhaka
                const location = userData?.location?.split(',')[0] || 'Dhaka';
                const data = await fetchWeatherForecast(location);
                setWeatherData(data);
            } catch (err) {
                console.error("Failed to load weather:", err);
                setError("Weather data unavailable");
            } finally {
                setLoading(false);
            }
        };

        loadWeather();
    }, [userData?.location]);

    if (loading) {
        return (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse h-64 flex items-center justify-center">
                <div className="text-gray-400">{t('weather.loading')}</div>
            </div>
        );
    }

    if (error || !weatherData) {
        return (
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100 text-center text-red-600">
                <AlertTriangle className="mx-auto mb-2" />
                <p>{t('weather.unavailable')}</p>
            </div>
        );
    }

    const { current, forecast, location } = weatherData;

    // Helper to get icon
    const getWeatherIcon = (weatherCode, size = 24, className = "") => {
        switch (weatherCode) {
            case 'Clear': return <Sun size={size} className={`text-orange-500 ${className}`} />;
            case 'Clouds': return <Cloud size={size} className={`text-gray-500 ${className}`} />;
            case 'Rain': return <CloudRain size={size} className={`text-blue-500 ${className}`} />;
            case 'Thunderstorm': return <CloudLightning size={size} className={`text-purple-500 ${className}`} />;
            default: return <Cloud size={size} className={`text-gray-400 ${className}`} />;
        }
    };

    // Advisory Styles
    const advisoryStyles = {
        warning: 'bg-red-50 border-red-200 text-red-800',
        alert: 'bg-orange-50 border-orange-200 text-orange-800',
        success: 'bg-emerald-50 border-emerald-200 text-emerald-800'
    };

    return (
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
            {/* Header */}
            <div className="bg-farm-dark p-4 flex justify-between items-center text-white">
                <div className="flex items-center gap-2">
                    <MapPinIcon className="text-farm-lime" size={18} />
                    <span className="font-bold text-lg">{location}</span>
                </div>
                <div className="text-sm opacity-80">
                    {new Date().toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' })}
                </div>
            </div>

            <div className="p-6">
                {/* Main Current Weather & Advisory */}
                <div className="flex flex-col md:flex-row gap-6 mb-8">
                    {/* Left: Current Stats */}
                    <div className="flex-1 flex items-center gap-6">
                        <div className="p-4 bg-gray-50 rounded-full">
                            {getWeatherIcon(current.weather, 64)}
                        </div>
                        <div>
                            <div className="text-5xl font-bold text-gray-900 font-inter">
                                {current.temp}°<span className="text-2xl text-gray-500">C</span>
                            </div>
                            <div className="text-lg text-gray-600 font-medium mt-1">
                                {t(`weather.condition.${current.weather}`) || current.weather}
                            </div>
                            <div className="flex gap-4 mt-2 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Droplets size={14} /> {current.humidity}% {t('weather.humidity')}
                                </div>
                                <div className="flex items-center gap-1">
                                    <CloudRain size={14} /> {current.rainProb}% {t('weather.rainProb')}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right: Advisory Box */}
                    <div className={`flex-1 p-5 rounded-2xl border-2 flex items-start gap-4 ${advisoryStyles[current.advice.type]}`}>
                        <div className="p-2 bg-white/50 rounded-full shrink-0">
                            {current.advice.type === 'warning' && <CloudRain size={24} />}
                            {current.advice.type === 'alert' && <Sun size={24} />}
                            {current.advice.type === 'success' && <ShieldCheck size={24} />}
                        </div>
                        <div>
                            <h4 className="font-bold text-lg mb-1">{t('weather.adviceTitle')}</h4>
                            <p className="font-medium leading-relaxed">
                                {t(`weather.advice.${current.advice.code}`)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* 5-Day Forecast Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {forecast.map((day, idx) => (
                        <div key={idx} className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                            <span className="text-sm font-bold text-gray-600 mb-2">
                                {t(`weather.days.${day.dayName}`) || day.dayName}
                            </span>
                            {getWeatherIcon(day.weather, 28, "mb-2")}
                            <div className="font-bold text-gray-900 mb-1">{day.temp}°C</div>
                            <div className="text-xs text-gray-500 flex items-center gap-1">
                                <CloudRain size={10} /> {day.rainProb}%
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Simple MapPin component for internal use if needed, or import from lucide
const MapPinIcon = ({ size, className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
    </svg>
);

export default WeatherWidget;
