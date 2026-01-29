import React, { useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useBatch } from '../context/BatchContext';
import BadgeCase from '../components/BadgeCase';
import { User, MapPin, Phone, LogOut, Activity, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';

const ProfilePage = () => {
    const { userData, logout } = useAuth();
    const { batches, scans } = useBatch();
    const { t } = useLanguage();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    // Calculate Stats & Badges
    const stats = useMemo(() => {
        const totalSaved = batches.reduce((sum, b) => {
            const w = typeof b.weight === 'string' ? parseFloat(b.weight) : (b.weight || 0);
            return sum + w;
        }, 0);

        const freshScans = scans.filter(s => s.result === 'fresh').length;
        const rottenScans = scans.filter(s => s.result === 'rotten').length;

        // Dynamic Badges
        const earnedBadges = [];
        if (batches.length > 0) earnedBadges.push('first_harvest');
        if (freshScans >= 5) earnedBadges.push('risk_expert');
        if (totalSaved > 1000) earnedBadges.push('yield_master');
        if (batches.length >= 10) earnedBadges.push('community_leader');

        return { totalSaved, freshScans, rottenScans, earnedBadges };
    }, [batches, scans]);

    // Combine Activity Feed
    const activityFeed = useMemo(() => {
        const all = [
            ...batches.map(b => ({ type: 'batch', date: new Date(b.createdAt), data: b })),
            ...scans.map(s => ({ type: 'scan', date: new Date(s.timestamp || s.createdAt), data: s }))
        ];
        return all.sort((a, b) => b.date - a.date).slice(0, 5); // Last 5 items
    }, [batches, scans]);

    if (!userData) {
        return <div className="p-8 text-center">{t('profile.loading')}</div>;
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto">
                {/* Header - Mobile Only */}
                <div className="flex justify-between items-center mb-6 md:hidden">
                    <h1 className="text-2xl font-bold text-farm-dark">{t('profile.title')}</h1>
                    <button
                        onClick={handleLogout}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                    >
                        <LogOut size={24} />
                    </button>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                    {/* Left Column: Profile Card */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex flex-col items-center text-center mb-6">
                                <div className="w-24 h-24 bg-farm-lime/20 rounded-full flex items-center justify-center text-farm-dark mb-4 overflow-hidden border-2 border-farm-lime">
                                    {userData.photoURL ? (
                                        <img src={userData.photoURL} alt={userData.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={48} />
                                    )}
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-farm-dark">{userData.name}</h2>
                                    <p className="text-gray-500 text-sm">{t('profile.role')}</p>
                                </div>
                            </div>

                            <div className="space-y-4 border-t border-gray-100 pt-6">
                                <div className="flex items-center gap-3 text-gray-600">
                                    <Phone size={20} className="text-farm-dark" />
                                    <span>{userData.phone}</span>
                                </div>
                                <div className="flex items-center gap-3 text-gray-600">
                                    <MapPin size={20} className="text-farm-dark" />
                                    <span>{userData.location || t('profile.locationNotSet')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-farm-lime text-farm-dark p-4 rounded-2xl text-center shadow-lg shadow-farm-lime/20">
                                <div className="text-2xl font-bold mb-1">{stats.totalSaved}kg</div>
                                <div className="text-xs font-medium opacity-80">{t('profile.stats.saved')}</div>
                            </div>
                            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 text-center">
                                <div className="text-2xl font-bold text-farm-dark mb-1">{batches.length}</div>
                                <div className="text-xs text-gray-500">{t('profile.stats.activeBatches')}</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Badges & Activity */}
                    <div className="md:col-span-2 space-y-6">
                        <BadgeCase badges={stats.earnedBadges} />

                        {/* Recent Activity */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <div className="flex items-center gap-2 mb-4">
                                <Activity size={20} className="text-farm-green-600" />
                                <h3 className="font-bold text-farm-dark">{t('profile.activity.title')}</h3>
                            </div>
                            <div className="space-y-4">
                                {activityFeed.length === 0 ? (
                                    <p className="text-gray-400 text-sm text-center py-4">{t('profile.activity.empty')}</p>
                                ) : (
                                    activityFeed.map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                            <div className={`p-2 rounded-full ${item.type === 'batch' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                                                {item.type === 'batch' ? <CheckCircle size={16} /> : <Activity size={16} />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm font-bold text-gray-900">
                                                    {item.type === 'batch'
                                                        ? t('profile.activity.addedBatch').replace('{crop}', item.data.cropType || 'Crop')
                                                        : t('profile.activity.scannedCrop').replace('{status}', item.data.result === 'fresh' ? t('profile.activity.healthy') : t('profile.activity.riskDetected'))
                                                    }
                                                </p>
                                                <p className="text-xs text-gray-500">{item.date.toLocaleDateString()}</p>
                                            </div>
                                            {item.type === 'scan' && item.data.result === 'rotten' && (
                                                <div className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded">{t('profile.activity.riskLabel')}</div>
                                            )}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Loss Events (Rotten Scans) */}
                        {stats.rottenScans > 0 && (
                            <div className="bg-red-50 p-6 rounded-3xl border border-red-100">
                                <div className="flex items-center gap-2 mb-4 text-red-700">
                                    <AlertTriangle size={20} />
                                    <h3 className="font-bold">{t('profile.riskEvents.title')}</h3>
                                </div>
                                <p className="text-sm text-red-600 mb-4">
                                    {t('profile.riskEvents.desc').replace('{count}', stats.rottenScans)}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ProfilePage;
