import React from 'react';
import CommunityMap from '../components/CommunityMap';
import { MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const CommunityMapPage = () => {
    const { t } = useLanguage();

    return (
        <div className="max-w-7xl mx-auto space-y-8 pt-24">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative z-10">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                        <MapPin className="text-emerald-600" size={32} />
                        Community Risk Map
                    </h1>
                    <p className="text-gray-500 mt-2 max-w-2xl">
                        Visualize crop risks in your area. Red dots indicate high risk or critical status, while green dots indicate safe crops.
                        This helps in understanding regional pest outbreaks or weather impacts.
                    </p>
                </div>
            </div>

            <CommunityMap />

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h3 className="font-bold text-blue-800 mb-2">Privacy Note</h3>
                <p className="text-blue-600 text-sm">
                    This map shows approximate locations of crops to help the community.
                    No personal information or exact farm locations are shared.
                    Data is anonymized for your safety.
                </p>
            </div>
        </div>
    );
};

export default CommunityMapPage;
