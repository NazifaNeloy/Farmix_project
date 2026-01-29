import React from 'react';
import { Award, CheckCircle, Lock, ChevronRight, TrendingUp } from 'lucide-react';
import { useBatch } from '../../context/BatchContext';
import { useLanguage } from '../../context/LanguageContext';

const BottomSection = () => {
    const { batches } = useBatch();
    const { t } = useLanguage();

    // Filter for completed batches
    const completedBatches = batches.filter(b => b.status === 'Completed');

    // Simple icons for badges
    const SproutIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10" /><path d="M10 20c5.5-2.5.8-6.4 3-10" /><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.2.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z" /><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1.7-1.3 2.9-1.3 3-1.2-1.4 1.9-2.3 3.2-5.4 2.6-1.9-.4-3.2-4-3.2-4z" /></svg>;
    const TrendingIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18" /><polyline points="17 6 23 6 23 12" /></svg>;
    const ShieldIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>;
    const LeafIcon = () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.77 10-10 10Z" /><path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" /></svg>;

    const badges = [
        { id: 1, name: t('bottomSection.badges.firstHarvest.name'), icon: <SproutIcon />, unlocked: true, description: t('bottomSection.badges.firstHarvest.desc') },
        { id: 2, name: t('bottomSection.badges.highYield.name'), icon: <TrendingIcon />, unlocked: true, description: t('bottomSection.badges.highYield.desc') },
        { id: 3, name: t('bottomSection.badges.riskMaster.name'), icon: <ShieldIcon />, unlocked: false, description: t('bottomSection.badges.riskMaster.desc') },
        { id: 4, name: t('bottomSection.badges.ecoFarmer.name'), icon: <LeafIcon />, unlocked: false, description: t('bottomSection.badges.ecoFarmer.desc') },
    ];

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Completed Batches List */}
            <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">{t('bottomSection.completedBatches')}</h2>
                    <button className="text-emerald-600 font-bold text-sm hover:text-emerald-700">{t('bottomSection.viewAll')}</button>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    {completedBatches.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            {t('bottomSection.noCompleted')}
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {completedBatches.map((batch) => (
                                <div key={batch.id} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group cursor-pointer">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                            <CheckCircle size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">{batch.crop} - {batch.variety}</h4>
                                            <p className="text-sm text-gray-500">{batch.harvestDate} • {batch.weight}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <div className="text-right hidden sm:block">
                                            <div className="font-bold text-emerald-600">{t('bottomSection.completed')}</div>
                                            <div className="text-xs text-gray-400">{t('bottomSection.viewReport')}</div>
                                        </div>
                                        <ChevronRight size={20} className="text-gray-300 group-hover:text-emerald-500 transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Badges Gallery */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-900">{t('bottomSection.badgesGallery')}</h2>
                    <span className="text-sm text-gray-500">2/12 {t('bottomSection.unlocked')}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    {badges.map((badge) => (
                        <div key={badge.id} className={`p-4 rounded-2xl border ${badge.unlocked ? 'bg-white border-emerald-100 shadow-sm' : 'bg-gray-50 border-gray-100 opacity-70'} flex flex-col items-center text-center gap-3 transition-transform hover:scale-105`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${badge.unlocked ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-200 text-gray-400'}`}>
                                {badge.unlocked ? badge.icon : <Lock size={20} />}
                            </div>
                            <div>
                                <h4 className={`font-bold text-sm ${badge.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>{badge.name}</h4>
                                <p className="text-xs text-gray-400 mt-1 line-clamp-2">{badge.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BottomSection;
