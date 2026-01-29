import React, { useState, useEffect } from 'react';
import { Package, MapPin, Calendar, ArrowRight, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBatch } from '../../context/BatchContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { calculateRisk } from '../../utils/riskCalculator';
import { generateSmartAlert } from '../../utils/decisionEngine';
import { useWeatherForecast } from '../../hooks/useWeatherForecast';

import RiskAlertModal from '../RiskAlertModal';
import PredictionCard from '../PredictionCard';
import WeatherDashboard from '../WeatherDashboard';
import RiskSummaryCard from './RiskSummaryCard';

const ActiveBatchesSection = () => {
    const { batches, completeBatch } = useBatch();
    const { userData } = useAuth();
    const { t } = useLanguage();

    const [showRiskAlert, setShowRiskAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [hasShownAlert, setHasShownAlert] = useState(false); // Prevent infinite loop

    const location = userData?.location?.split(',')[0] || 'Dhaka';
    const { weatherData: weatherForecast, loading: loadingWeather } = useWeatherForecast(location);

    // Filter active batches (assuming 'active' status or no status means active)
    const activeBatches = batches.filter(batch => !batch.status || batch.status === 'Active' || batch.status === 'Processing');

    // Check for High Risk Batches and Trigger Alert
    useEffect(() => {
        if (!weatherForecast || activeBatches.length === 0 || hasShownAlert) return;

        let highRiskFound = false;
        let message = "";

        activeBatches.forEach(batch => {
            const cropName = batch.cropType || batch.crop || '';
            const isDemoBatch = cropName.trim() === "Demo Potato" || cropName.includes("Demo Potato");

            // Mock weather for demo if needed
            const demoWeatherMock = {
                current: { temp: 28, humidity: 90, weather: "Rain" },
                forecast: Array(7).fill({
                    date: new Date().toISOString(),
                    temp: 28, rainProb: 80, humidity: 90, weather: "Rain", weatherCode: 61
                })
            };

            const baseWeather = weatherForecast || (isDemoBatch ? demoWeatherMock : null);

            const effectiveWeather = isDemoBatch && baseWeather ? {
                ...baseWeather,
                current: { ...baseWeather.current, humidity: 90, temp: 28 },
                forecast: [
                    { ...baseWeather.forecast[0], weather: "Rain", weatherCode: 61 },
                    ...baseWeather.forecast.slice(1)
                ]
            } : baseWeather;

            if (effectiveWeather) {
                let riskData = calculateRisk(batch, effectiveWeather);

                // Force Critical for Demo
                if (isDemoBatch) {
                    riskData = { ...riskData, riskLevel: 'CRITICAL' };
                }

                if (riskData.riskLevel === 'CRITICAL' || riskData.riskLevel === 'HIGH') {
                    highRiskFound = true;
                    // Generate a simple message or use the smart alert
                    const smartAlert = generateSmartAlert({
                        cropType: cropName,
                        currentRisk: riskData.riskLevel,
                        weatherData: effectiveWeather,
                        humidity: effectiveWeather.current?.humidity || 0
                    });
                    message = smartAlert || `High risk detected for your ${cropName} batch!`;
                }
            }
        });

        if (highRiskFound) {
            setAlertMessage(message);
            setShowRiskAlert(true);
            setHasShownAlert(true); // Only show once per session/mount
        }
    }, [weatherForecast, activeBatches, hasShownAlert]);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8">
            <RiskAlertModal
                isOpen={showRiskAlert}
                onClose={() => setShowRiskAlert(false)}
                message={alertMessage}
            />

            {/* Hyper-Local Weather Dashboard */}
            <div className="mb-6">
                <WeatherDashboard />
            </div>

            {activeBatches.map((batch) => {
                // --- DEMO TRIGGER LOGIC ---
                // Robust check for "Demo Potato"
                const cropName = batch.cropType || batch.crop || '';
                const isDemoBatch = cropName.trim() === "Demo Potato" || cropName.includes("Demo Potato");

                // Create a safe mock weather object if real weather is missing but it's a demo
                const demoWeatherMock = {
                    current: { temp: 28, humidity: 90, weather: "Rain" },
                    forecast: Array(7).fill({
                        date: new Date().toISOString(),
                        temp: 28,
                        rainProb: 80,
                        humidity: 90,
                        weather: "Rain",
                        weatherCode: 61
                    })
                };

                const baseWeather = weatherForecast || (isDemoBatch ? demoWeatherMock : null);

                const effectiveWeather = isDemoBatch && baseWeather ? {
                    ...baseWeather,
                    current: { ...baseWeather.current, humidity: 90, temp: 28 },
                    forecast: [
                        { ...baseWeather.forecast[0], weather: "Rain", weatherCode: 61 },
                        ...baseWeather.forecast.slice(1)
                    ]
                } : baseWeather;

                // Calculate risk using effective weather
                let riskData = effectiveWeather
                    ? calculateRisk(batch, effectiveWeather)
                    : {
                        riskLevel: 'LOADING',
                        etclHours: 120,
                        advice: t('activeBatches.loadingWeather'),
                        color: 'green',
                        riskFactors: []
                    };

                // FORCE CRITICAL RISK FOR DEMO
                // This ensures the Red Alert Box appears
                if (isDemoBatch && effectiveWeather) {
                    riskData = {
                        ...riskData,
                        riskLevel: 'CRITICAL',
                        color: 'red'
                    };
                }

                // Generate Smart Alert using the new Decision Engine
                const smartAlert = effectiveWeather
                    ? generateSmartAlert({
                        cropType: cropName,
                        currentRisk: riskData.riskLevel,
                        weatherData: effectiveWeather,
                        humidity: effectiveWeather.current?.humidity || 0
                    })
                    : null;

                return (
                    <div key={batch.id} className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex flex-col justify-between h-auto min-h-full hover:shadow-md transition-shadow">
                        <div>
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h4 className="font-bold text-gray-900 text-lg break-words whitespace-normal">{batch.cropType || batch.crop}</h4>
                                    <p className="text-xs text-gray-500">{batch.variety}</p>
                                </div>
                                <span className="bg-white px-2 py-1 rounded text-xs font-bold border border-gray-200 shadow-sm">
                                    {batch.weight} kg
                                </span>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 mb-4">
                                <div className="flex items-center gap-2">
                                    <Calendar size={14} className="text-gray-400" />
                                    <span>{t('activeBatches.harvest')}: {batch.harvestDate}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <MapPin size={14} className="text-gray-400" />
                                    <span>{batch.storageLocation || batch.location}</span>
                                </div>
                            </div>

                            {/* Risk Summary Card */}
                            <RiskSummaryCard
                                batch={batch}
                                riskData={riskData}
                                weather={effectiveWeather}
                                smartAlert={smartAlert}
                            />

                            {/* New Prediction Engine Card */}
                            <div className="mt-4">
                                <PredictionCard batch={batch} />
                            </div>

                            {/* Smart Alert Box */}
                            {smartAlert && (
                                <div className={`p-3 rounded-lg text-sm font-medium mb-4 flex gap-2 items-start ${riskData.riskLevel === 'CRITICAL' || riskData.riskLevel === 'HIGH'
                                    ? 'bg-red-50 text-red-800 border border-red-100'
                                    : 'bg-blue-50 text-blue-800 border border-blue-100'
                                    }`}>
                                    <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                    <p>{smartAlert}</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-auto pt-3 border-t border-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                {riskData.riskLevel === 'HIGH' && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                        <AlertTriangle size={12} /> {t('activeBatches.risk.high')}
                                    </span>
                                )}
                                {riskData.riskLevel === 'MEDIUM' && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-full">
                                        <AlertTriangle size={12} /> {t('activeBatches.risk.medium')}
                                    </span>
                                )}
                                {riskData.riskLevel === 'LOW' && (
                                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                                        <AlertTriangle size={12} /> {t('activeBatches.risk.low')}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={async () => {
                                        if (window.confirm(t('riskPage.confirmComplete'))) {
                                            try {
                                                await completeBatch(batch.id);
                                            } catch (err) {
                                                alert('Failed to complete batch');
                                            }
                                        }
                                    }}
                                    className="text-gray-500 text-xs font-bold hover:text-green-600 transition-colors"
                                >
                                    {t('riskPage.completeBatch')}
                                </button>
                                <Link to="/risk-analysis" className="text-emerald-600 text-xs font-bold hover:underline flex items-center gap-1">
                                    {t('activeBatches.analyze')} <ArrowRight size={12} />
                                </Link>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ActiveBatchesSection;
