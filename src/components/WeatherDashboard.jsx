import React from 'react';
import { useWeatherForecast } from '../hooks/useWeatherForecast';
import { useAuth } from '../context/AuthContext';
import { toBanglaDigit, translateWeather, getBanglaDay } from '../utils/banglaUtils';
import { Sun, Cloud, CloudRain, CloudLightning, AlertTriangle, ShieldCheck, ThermometerSun } from 'lucide-react';

const WeatherDashboard = () => {
    const { userData } = useAuth();
    const district = userData?.location?.split(',')[0] || "Dhaka";
    const { weatherData, loading, error } = useWeatherForecast(district);

    if (loading) return <div className="p-6 text-center">লোড হচ্ছে...</div>;
    if (error) return <div className="p-6 text-center text-red-500">তথ্য পাওয়া যাচ্ছে না। আবার চেষ্টা করুন।</div>;
    if (!weatherData) return null;

    const current = weatherData.forecast[0];
    const forecast = weatherData.forecast.slice(1, 5); // Next 4 days

    // 3. THE ADVISORY ENGINE
    const generateAdvice = (temp, rainChance) => {
        if (rainChance > 70) {
            return {
                text: "আগামী ৩ দিন বৃষ্টির সম্ভাবনা ৮০% এর বেশি → আজই ধান কাটুন অথবা ঢেকে রাখুন।",
                icon: <AlertTriangle className="text-red-500" size={24} />,
                color: "bg-red-50 border-red-200 text-red-800"
            };
        } else if (temp > 35) {
            return {
                text: "তাপমাত্রা ৩৬°C এর উপরে উঠতে পারে → বিকেলের দিকে জমিতে সেচ দিন।",
                icon: <ThermometerSun className="text-orange-500" size={24} />,
                color: "bg-orange-50 border-orange-200 text-orange-800"
            };
        } else {
            return {
                text: "আবহাওয়া অনুকূল আছে। নিয়মিত পর্যবেক্ষণ করুন।",
                icon: <ShieldCheck className="text-green-500" size={24} />,
                color: "bg-green-50 border-green-200 text-green-800"
            };
        }
    };

    const advice = generateAdvice(current.temp, current.rainProb);

    const getWeatherIcon = (condition, size = 24) => {
        if (condition === 'Rain') return <CloudRain size={size} className="text-blue-500" />;
        if (condition === 'Thunderstorm') return <CloudLightning size={size} className="text-purple-500" />;
        if (condition === 'Clouds') return <Cloud size={size} className="text-gray-400" />;
        return <Sun size={size} className="text-orange-500" />;
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 font-inter">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">আবহাওয়া পূর্বাভাস</h2>
                    <p className="text-sm text-gray-500">{district}, বাংলাদেশ</p>
                </div>
                <div className="text-right">
                    <p className="text-3xl font-bold text-gray-900">{toBanglaDigit(Math.round(current.temp))}°সে</p>
                    <p className="text-sm text-gray-500">{translateWeather(current.weather)}</p>
                </div>
            </div>

            {/* Current Day Hero */}
            <div className="flex flex-col items-center mb-8">
                <div className="mb-4">
                    {getWeatherIcon(current.weather, 64)}
                </div>

                {/* Advisory Box */}
                <div className={`w-full p-4 rounded-xl border flex items-start gap-3 ${advice.color}`}>
                    <div className="shrink-0 mt-1">{advice.icon}</div>
                    <p className="font-medium text-sm md:text-base">{advice.text}</p>
                </div>
            </div>

            {/* Forecast Grid (4 Days) */}
            <div className="grid grid-cols-4 gap-2 md:gap-4">
                {forecast.map((day, idx) => (
                    <div key={idx} className="flex flex-col items-center p-3 bg-gray-50 rounded-xl border border-gray-100 text-center">
                        <span className="text-xs font-bold text-gray-600 mb-2">{getBanglaDay(day.date)}</span>
                        <div className="mb-2">
                            {getWeatherIcon(day.weather, 24)}
                        </div>
                        <span className="text-sm font-bold text-gray-800">{toBanglaDigit(Math.round(day.temp))}°</span>
                        <span className="text-[10px] text-gray-500 mt-1">
                            {day.rainProb > 0 ? `${toBanglaDigit(day.rainProb)}% বৃষ্টি` : 'শুষ্ক'}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherDashboard;
