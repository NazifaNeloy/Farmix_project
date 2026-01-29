import React, { useState, useEffect } from 'react';
import { Package, ArrowLeft, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBatch } from '../context/BatchContext';
import { useAuth } from '../context/AuthContext';
import { fetchWeatherForecast, getExtendedForecast } from '../services/weatherService';
import { calculateRisk } from '../utils/riskCalculator';
import RiskSummaryCard from '../components/dashboard/RiskSummaryCard';
import { useLanguage } from '../context/LanguageContext';

const RiskAnalysisPage = () => {
    const { t } = useLanguage();
    const { batches, completeBatch } = useBatch();
    const { userData } = useAuth();
    const [weatherForecast, setWeatherForecast] = useState(null);
    const [loadingWeather, setLoadingWeather] = useState(true);

    // Filter active batches
    const activeBatches = batches.filter(batch => !batch.status || batch.status === 'Active' || batch.status === 'Processing');

    useEffect(() => {
        const loadWeather = async () => {
            try {
                const location = userData?.location?.split(',')[0] || 'Dhaka';
                const data = await fetchWeatherForecast(location);

                // Extend forecast to 7 days
                const extended = getExtendedForecast(data);

                setWeatherForecast({
                    ...data,
                    forecast: extended
                });
            } catch (err) {
                console.error("Weather load failed for risk calc:", err);
            } finally {
                setLoadingWeather(false);
            }
        };

        loadWeather();
    }, [userData?.location]);

    return (
        <div className="min-h-screen bg-gray-50 font-inter">
            <main className="container mx-auto px-4 py-8 pt-24">
                <div className="mb-8 flex items-center gap-4">
                    <Link to="/harvest" className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <AlertTriangle className="text-farm-lime" size={28} />
                            {t('riskPage.title')}
                        </h1>
                        <p className="text-gray-500 text-sm">{t('riskPage.subtitle')}</p>
                    </div>
                </div>

                {loadingWeather ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-farm-lime border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500">{t('riskPage.loading')}</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {activeBatches.length === 0 ? (
                            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 shadow-sm">
                                <Package className="mx-auto text-gray-300 mb-4" size={48} />
                                <h3 className="text-lg font-bold text-gray-800 mb-2">{t('riskPage.noBatches.title')}</h3>
                                <p className="text-gray-500 mb-6">{t('riskPage.noBatches.desc')}</p>
                                <Link to="/harvest" className="px-6 py-2 bg-farm-lime text-farm-dark font-bold rounded-full hover:bg-lime-400 transition-colors">
                                    {t('riskPage.noBatches.cta')}
                                </Link>
                            </div>
                        ) : (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                                    let riskData = effectiveWeather
                                        ? calculateRisk(batch, effectiveWeather)
                                        : null;

                                    // FORCE CRITICAL RISK FOR DEMO
                                    if (isDemoBatch && effectiveWeather && riskData) {
                                        riskData = {
                                            ...riskData,
                                            riskLevel: 'CRITICAL',
                                            color: 'red',
                                            // Ensure advice reflects the demo scenario if calculateRisk didn't catch it
                                            advice: riskData.advice.includes('Rain') ? riskData.advice : "CRITICAL: Heavy rain and high humidity detected. Immediate action required to prevent spoilage."
                                        };
                                    }

                                    if (!riskData) return null;

                                    return (
                                        <div key={batch.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col gap-4">
                                            {/* Batch Header */}
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-bold text-lg text-gray-900">{batch.cropType || batch.crop}</h3>
                                                    <p className="text-sm text-gray-500">{batch.variety}</p>
                                                </div>
                                                <span className="bg-gray-100 px-3 py-1 rounded-full text-xs font-bold text-gray-600">
                                                    {batch.weight} kg
                                                </span>
                                            </div>

                                            {/* Risk Card Component */}
                                            <RiskSummaryCard batch={batch} riskData={riskData} />

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
                                                className="w-full mt-2 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors text-sm"
                                            >
                                                {t('riskPage.completeBatch')}
                                            </button>

                                            {/* Additional Details */}
                                            <div className="pt-4 border-t border-gray-50 grid grid-cols-2 gap-4 text-xs text-gray-500">
                                                <div>
                                                    <span className="block text-gray-400 mb-1">{t('riskPage.harvestDate')}</span>
                                                    <span className="font-medium text-gray-700">{batch.harvestDate}</span>
                                                </div>
                                                <div>
                                                    <span className="block text-gray-400 mb-1">{t('riskPage.storage')}</span>
                                                    <span className="font-medium text-gray-700">{batch.storageType || t('riskPage.openAir')}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
};

export default RiskAnalysisPage;
