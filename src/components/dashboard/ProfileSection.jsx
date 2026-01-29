import React from 'react';
import { useBatch } from '../../context/BatchContext';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { Sprout, Download, Award, Settings, MapPin, Phone, CheckCircle, AlertTriangle, ShieldCheck, Package } from 'lucide-react';
import Papa from 'papaparse';

const ProfileSection = ({ onAddBatch }) => {
    const { userData, user: authUser } = useAuth();
    const { batches } = useBatch();
    const { t, language } = useLanguage();

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return 'March 2024';
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return 'March 2024';
            return date.toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US', { month: 'long', year: 'numeric' });
        } catch (e) {
            return 'March 2024';
        }
    };

    // Calculate stats
    const totalWeight = batches.reduce((acc, batch) => {
        const weight = typeof batch.weight === 'string' ? parseFloat(batch.weight) : (batch.weight || 0);
        return acc + weight;
    }, 0);

    // Badge Logic
    const badges = [
        {
            id: 'first_harvest',
            name: t('profileSection.badges.firstHarvest.name'),
            icon: Sprout,
            color: 'text-emerald-600 bg-emerald-100',
            earned: batches.length >= 1,
            desc: t('profileSection.badges.firstHarvest.desc')
        },
        {
            id: 'scale_farmer',
            name: t('profileSection.badges.scaleFarmer.name'),
            icon: Award,
            color: 'text-amber-600 bg-amber-100',
            earned: totalWeight > 1000,
            desc: t('profileSection.badges.scaleFarmer.desc')
        },
        {
            id: 'risk_expert',
            name: t('profileSection.badges.riskExpert.name'),
            icon: ShieldCheck,
            color: 'text-blue-600 bg-blue-100',
            earned: true, // Mock logic as requested
            desc: t('profileSection.badges.riskExpert.desc')
        }
    ];

    const [userProfile, setUserProfile] = React.useState(null);
    const [loadingProfile, setLoadingProfile] = React.useState(true);

    // Explicitly fetch user profile from Firestore to ensure fresh data
    React.useEffect(() => {
        let isMounted = true;
        const fetchProfile = async () => {
            if (authUser?.uid) {
                try {
                    const { doc, getDoc } = await import('firebase/firestore');
                    const { db } = await import('../../lib/firebase');

                    const docRef = doc(db, "users", authUser.uid);
                    const docSnap = await getDoc(docRef);

                    if (isMounted && docSnap.exists()) {
                        setUserProfile(docSnap.data());
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error);
                } finally {
                    if (isMounted) setLoadingProfile(false);
                }
            }
        };
        fetchProfile();
        return () => { isMounted = false; };
    }, [authUser]);

    // Prioritize fetched profile, then context data, then auth defaults
    const user = {
        name: (userProfile?.name || userData?.name || authUser?.displayName || t('dashboard.defaultName')),
        location: userProfile?.location || userData?.location || 'Bangladesh',
        phone: userProfile?.phone || userData?.phone || authUser?.phoneNumber || 'N/A',
        memberSince: formatDate(userProfile?.createdAt || userData?.createdAt || authUser?.metadata?.creationTime),
        photoURL: userProfile?.photoURL || userData?.photoURL || authUser?.photoURL
    };

    // Special translation for demo user "neel"
    if (language === 'bn' && user.name && user.name.toLowerCase() === 'neel') {
        user.name = 'নীল';
    }

    const handleExport = () => {
        if (batches.length === 0) {
            alert(t('profileSection.export.noData'));
            return;
        }

        // Prepare data for PapaParse
        const csvData = batches.map(batch => ({
            "Batch ID": batch.id,
            "Crop Type": batch.cropType,
            "Weight (kg)": batch.weight,
            "Harvest Date": batch.harvestDate,
            "Division": batch.division || "N/A",
            "Storage Type": batch.storageType || "N/A",
            "Created At": new Date(batch.createdAt).toLocaleDateString()
        }));

        const csv = Papa.unparse(csvData);

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", "harvest_report.csv");
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-6 mb-8">
            {/* Top: User Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6">
                <div className="relative">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-farm-lime/20 shadow-lg">
                        {user.photoURL ? (
                            <img src={user.photoURL} alt={user.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-3xl font-bold">
                                {user.name.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-1 right-1 bg-emerald-500 text-white p-1 rounded-full border-2 border-white">
                        <CheckCircle size={14} />
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-gray-500 text-sm mt-1">
                        <div className="flex items-center gap-1">
                            <MapPin size={14} />
                            {user.location}
                        </div>
                        <div className="flex items-center gap-1">
                            <Phone size={14} />
                            {user.phone}
                        </div>
                    </div>
                    <div className="mt-3 flex gap-2 justify-center md:justify-start">
                        <button className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg transition-colors">
                            {t('profileSection.editProfile')}
                        </button>
                        <button onClick={handleExport} className="px-4 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-bold rounded-lg transition-colors flex items-center gap-1">
                            <Download size={14} /> {t('profileSection.exportReport')}
                        </button>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="text-center px-6 py-2 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="text-xs text-gray-500 font-bold uppercase">{t('profileSection.totalSaved')}</div>
                        <div className="text-xl font-bold text-emerald-600">{totalWeight} kg</div>
                    </div>
                    <div className="text-center px-6 py-2 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="text-xs text-gray-500 font-bold uppercase">{t('profileSection.batches')}</div>
                        <div className="text-xl font-bold text-gray-900">{batches.length}</div>
                    </div>
                </div>
            </div>

            {/* Middle: Harvest List & Actions */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Sprout size={20} className="text-emerald-600" />
                            {t('profileSection.yourHarvests')}
                        </h3>
                        <button onClick={onAddBatch} className="text-sm font-bold text-emerald-600 hover:text-emerald-700">
                            {t('profileSection.addNew')}
                        </button>
                    </div>

                    <div className="space-y-3">
                        {batches.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm">
                                {t('profileSection.noHarvests')}
                            </div>
                        ) : (
                            batches.slice(0, 3).map((batch, idx) => (
                                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white rounded-lg shadow-sm">
                                            <Package size={18} className="text-emerald-600" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <div className="font-bold text-gray-800">{t(`batchData.crops.${batch.cropType}`) !== `batchData.crops.${batch.cropType}` ? t(`batchData.crops.${batch.cropType}`) : batch.cropType}</div>
                                                {batch.status === 'Completed' && (
                                                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                                                        ✓
                                                    </span>
                                                )}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(batch.harvestDate).toLocaleDateString(language === 'bn' ? 'bn-BD' : 'en-US')} • {t(`batchData.divisions.${batch.division}`) !== `batchData.divisions.${batch.division}` ? t(`batchData.divisions.${batch.division}`) : batch.division}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-gray-900">{batch.weight} {language === 'bn' ? 'কেজি' : 'kg'}</div>
                                        <div className="text-xs text-gray-500">{t(`batchData.storage.${batch.storageType}`) !== `batchData.storage.${batch.storageType}` ? t(`batchData.storage.${batch.storageType}`) : batch.storageType}</div>
                                    </div>
                                </div>
                            ))
                        )}
                        {batches.length > 3 && (
                            <button className="w-full py-2 text-xs font-bold text-gray-500 hover:text-gray-700">
                                {t('profileSection.viewAll')} ({batches.length})
                            </button>
                        )}
                    </div>
                </div>

                {/* Bottom: Achievements */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <Award size={20} className="text-amber-500" />
                        {t('profileSection.achievements')}
                    </h3>
                    <div className="space-y-3">
                        {badges.map((badge) => (
                            <div key={badge.id} className={`flex items-center gap-3 p-3 rounded-xl border ${badge.earned ? 'bg-white border-gray-100' : 'bg-gray-50 border-transparent opacity-60'}`}>
                                <div className={`p-2 rounded-full ${badge.earned ? badge.color : 'bg-gray-200 text-gray-400'}`}>
                                    <badge.icon size={18} />
                                </div>
                                <div>
                                    <div className="font-bold text-sm text-gray-900">{badge.name}</div>
                                    <div className="text-xs text-gray-500">{badge.desc}</div>
                                </div>
                                {badge.earned && (
                                    <CheckCircle size={16} className="ml-auto text-emerald-500" />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileSection;
