import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Trophy, TrendingUp } from 'lucide-react';
import { useBatch } from '../../context/BatchContext';
import { useLanguage } from '../../context/LanguageContext';

const AnalyticsSection = () => {
    const { batches } = useBatch();
    const { t } = useLanguage();

    // Calculate Storage Distribution
    const storageCounts = batches.reduce((acc, batch) => {
        const storage = batch.storageType || batch.storage || 'Other';
        acc[storage] = (acc[storage] || 0) + 1;
        return acc;
    }, {});

    const storageData = Object.keys(storageCounts).map(key => ({
        name: key,
        value: storageCounts[key]
    }));

    // If no data, show placeholders
    const finalStorageData = storageData.length > 0 ? storageData : [
        { name: t('analytics.storageDistribution.noData'), value: 1 }
    ];

    const COLORS = ['#059669', '#10B981', '#34D399', '#6EE7B7'];

    // Calculate Harvest Trends
    const harvestData = batches
        .filter(b => b.harvestDate && (b.weight !== undefined && b.weight !== null))
        .map(b => {
            const weight = typeof b.weight === 'string'
                ? parseFloat(b.weight)
                : (b.weight || 0);
            const date = new Date(b.harvestDate);
            const monthKey = date.toLocaleDateString('en-US', { month: 'short' });
            return {
                name: t(`analytics.months.${monthKey}`) || monthKey,
                yield: weight
            };
        })
        .slice(0, 6); // Last 6 batches

    const finalHarvestData = harvestData.length > 0 ? harvestData : [
        { name: t('analytics.months.Jan'), yield: 0 },
        { name: t('analytics.months.Feb'), yield: 0 },
        { name: t('analytics.months.Mar'), yield: 0 },
        { name: t('analytics.months.Apr'), yield: 0 },
        { name: t('analytics.months.May'), yield: 0 },
        { name: t('analytics.months.Jun'), yield: 0 },
    ];

    return (
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
            {/* Harvest Trends Chart */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900">{t('analytics.harvestTrends.title')}</h3>
                    <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                        <TrendingUp size={16} />
                        <span>{t('analytics.harvestTrends.growth')}</span>
                    </div>
                </div>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={finalHarvestData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{ stroke: '#10B981', strokeWidth: 2 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="yield"
                                stroke="#059669"
                                strokeWidth={3}
                                dot={{ fill: '#059669', strokeWidth: 2, r: 4, stroke: '#fff' }}
                                activeDot={{ r: 6, strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Storage Distribution */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900 mb-6">{t('analytics.storageDistribution.title')}</h3>
                <div className="h-64 relative">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={finalStorageData}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {finalStorageData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    {/* Center Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-3xl font-bold text-gray-900">{batches.length}</span>
                        <span className="text-xs text-gray-500 uppercase tracking-wider">{t('analytics.storageDistribution.batches')}</span>
                    </div>
                </div>
                <div className="flex justify-center gap-4 mt-4">
                    {finalStorageData.slice(0, 3).map((entry, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs text-gray-600">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                            {entry.name}
                        </div>
                    ))}
                </div>
            </div>

            {/* Gamification / Progress */}
            <div className="bg-gradient-to-br from-emerald-900 to-emerald-800 p-6 rounded-2xl shadow-lg text-white flex flex-col justify-between relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/20 rounded-full blur-2xl -ml-12 -mb-12"></div>

                {/* Dynamic Logic Calculation */}
                {(() => {
                    // 1. Calculate Total Points
                    // Rule: 50 points per batch + 1 point per 10kg harvested
                    const totalPoints = batches.reduce((acc, batch) => {
                        const weight = parseFloat(batch.weight) || 0;
                        return acc + 50 + Math.floor(weight / 10);
                    }, 0);

                    // 2. Determine Level & Thresholds
                    let level = 1;
                    let minPoints = 0;
                    let maxPoints = 200;
                    let nextLevel = 2;

                    if (totalPoints >= 500) {
                        level = 3;
                        minPoints = 500;
                        maxPoints = 1000;
                        nextLevel = 4;
                    } else if (totalPoints >= 200) {
                        level = 2;
                        minPoints = 200;
                        maxPoints = 500;
                        nextLevel = 3;
                    }

                    // 3. Calculate Progress Percentage
                    // Avoid division by zero
                    const progress = Math.min(100, Math.max(0, ((totalPoints - minPoints) / (maxPoints - minPoints)) * 100));
                    const pointsToNext = maxPoints - totalPoints;

                    return (
                        <>
                            <div>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                        <Trophy size={24} className="text-yellow-400" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">Level {level} Farmer</h3>
                                        <p className="text-emerald-200 text-sm">{pointsToNext} points to Level {nextLevel}</p>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-6">
                                    <div className="flex justify-between text-sm font-medium">
                                        <span>{t('analytics.gamification.progress')}</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-2 bg-black/20 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.5)] transition-all duration-1000 ease-out"
                                            style={{ width: `${progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/10">
                                <h4 className="font-bold text-sm mb-2">{t('analytics.gamification.nextAchievement')}</h4>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-xl">
                                        {level === 1 ? '🌱' : level === 2 ? '🌾' : '🚜'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">
                                            {level === 1 ? t('analytics.gamification.masterHarvester') :
                                                level === 2 ? 'Expert Cultivator' : 'Master Agronomist'}
                                        </p>
                                        <p className="text-xs text-emerald-200">
                                            {level === 1 ? t('analytics.gamification.nextGoal') :
                                                level === 2 ? 'Harvest 500kg total' : 'Maintain 95% crop health'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </>
                    );
                })()}
            </div>
        </div>
    );
};

export default AnalyticsSection;
