import React from 'react';
import { Award, Wheat, Sprout, Droplets } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const BADGE_ICONS = {
    'harvest_hero': Wheat,
    'water_wizard': Droplets,
    'early_bird': Sprout,
    'default': Award
};

const BadgeCase = ({ badges = [] }) => {
    const { t } = useLanguage();

    if (!badges || badges.length === 0) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Award className="text-gray-400" size={32} />
                </div>
                <p className="text-gray-500">No badges yet. Start your journey!</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-farm-green-900 mb-4">Your Achievements</h3>
            <div className="grid grid-cols-3 gap-4">
                {badges.map((badge, index) => {
                    const Icon = BADGE_ICONS[badge.type] || BADGE_ICONS['default'];
                    return (
                        <div key={index} className="flex flex-col items-center">
                            <div className="w-14 h-14 bg-farm-green-100 rounded-full flex items-center justify-center mb-2 text-farm-green-700">
                                <Icon size={24} />
                            </div>
                            <span className="text-xs text-center font-medium text-gray-700">{badge.name}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default BadgeCase;
