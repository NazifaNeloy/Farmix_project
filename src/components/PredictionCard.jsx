import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Cloud, AlertTriangle, CheckCircle } from 'lucide-react';
import { getMockWeatherForecast, calculatePrediction } from '../utils/predictionEngine';

const PredictionCard = ({ batch }) => {
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!batch) return;

        // Simulate API/Calculation delay
        setLoading(true);

        // 1. Generate Mock Weather
        // Use batch location or default to Dhaka
        const district = batch.location || "Dhaka";
        const mockWeather = getMockWeatherForecast(district);

        // 2. Calculate Risk
        const result = calculatePrediction(batch, mockWeather);

        setPrediction(result);
        setLoading(false);

    }, [batch]);

    if (loading) {
        return <div className="animate-pulse h-48 bg-gray-100 rounded-xl"></div>;
    }

    if (!prediction) return null;

    const { etclHours, riskLevel, color, message, forecast } = prediction;

    // Color mapping for Tailwind
    const colorClasses = {
        green: 'bg-green-500 text-green-700 border-green-200 bg-green-50',
        yellow: 'bg-yellow-500 text-yellow-700 border-yellow-200 bg-yellow-50',
        orange: 'bg-orange-500 text-orange-700 border-orange-200 bg-orange-50',
        red: 'bg-red-500 text-red-700 border-red-200 bg-red-50'
    };

    const barColors = {
        green: 'bg-green-500',
        yellow: 'bg-yellow-400',
        orange: 'bg-orange-500',
        red: 'bg-red-600'
    };

    // Risk Meter Width
    let width = '25%';
    if (riskLevel === 'Medium') width = '50%';
    if (riskLevel === 'High') width = '75%';
    if (riskLevel === 'Critical') width = '100%';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 font-inter">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="text-xl">🔮</span> Prediction Engine
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${colorClasses[color].split(' ')[1]} ${colorClasses[color].split(' ')[3]}`}>
                    {riskLevel} Risk
                </span>
            </div>

            {/* Risk Meter */}
            <div className="mb-6">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Safe</span>
                    <span>Critical</span>
                </div>
                <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ease-out ${barColors[color]}`}
                        style={{ width }}
                    ></div>
                </div>
                <p className="text-right text-xs font-bold mt-1 text-gray-600">
                    ETCL: {etclHours} Hours
                </p>
            </div>

            {/* Weather Row */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {forecast.map((day, idx) => (
                    <div key={idx} className="flex-1 min-w-[80px] bg-gray-50 rounded-lg p-2 flex flex-col items-center text-center border border-gray-100">
                        <span className="text-[10px] text-gray-500 font-medium mb-1">
                            {idx === 0 ? 'Today' : idx === 1 ? 'Tmrrw' : `Day ${idx + 1}`}
                        </span>
                        {day.condition === 'Rain' ? (
                            <CloudRain size={20} className="text-blue-500 mb-1" />
                        ) : day.condition === 'Cloudy' ? (
                            <Cloud size={20} className="text-gray-400 mb-1" />
                        ) : (
                            <Sun size={20} className="text-orange-400 mb-1" />
                        )}
                        <span className="text-xs font-bold text-gray-700">{day.temp}°C</span>
                        <span className="text-[10px] text-gray-400">{day.rainProb}% Rain</span>
                    </div>
                ))}
            </div>

            {/* Advisory Message */}
            <div className={`p-4 rounded-lg border ${colorClasses[color].split(' ')[2]} ${colorClasses[color].split(' ')[3]}`}>
                <div className="flex gap-3">
                    {riskLevel === 'Critical' || riskLevel === 'High' ? (
                        <AlertTriangle className={`shrink-0 ${colorClasses[color].split(' ')[1]}`} size={20} />
                    ) : (
                        <CheckCircle className={`shrink-0 ${colorClasses[color].split(' ')[1]}`} size={20} />
                    )}
                    <p className={`text-sm font-medium ${colorClasses[color].split(' ')[1]}`}>
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PredictionCard;
