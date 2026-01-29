import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import ProfileSection from '../components/dashboard/ProfileSection';
import AnalyticsSection from '../components/dashboard/AnalyticsSection';
import ActiveBatchesSection from '../components/dashboard/ActiveBatchesSection';
import BottomSection from '../components/dashboard/BottomSection';
import AddBatchModal from '../components/dashboard/AddBatchModal';
import WeatherWidget from '../components/WeatherWidget';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const HarvestPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { userData } = useAuth();
    const { t } = useLanguage();

    const userName = userData?.name || t('dashboard.defaultName');

    return (
        <DashboardLayout>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('dashboard.title')}</h1>
                    <p className="text-gray-500">
                        {t('dashboard.welcome').replace('{name}', userName)}
                    </p>
                </div>

                <WeatherWidget />
                <ProfileSection onAddBatch={() => setIsModalOpen(true)} />
                <AnalyticsSection />
                <ActiveBatchesSection />
                <BottomSection />

                <AddBatchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
            </div>
        </DashboardLayout>
    );
};

export default HarvestPage;
