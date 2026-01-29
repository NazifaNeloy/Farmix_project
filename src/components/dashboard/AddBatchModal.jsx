import React, { useState, useEffect } from 'react';
import { X, Sprout, Calendar, MapPin, Package, AlertTriangle, Wifi, WifiOff } from 'lucide-react';
import { useCropSync } from '../../hooks/useCropSync';
import { useLanguage } from '../../context/LanguageContext';

const AddBatchModal = ({ isOpen, onClose }) => {
    const { saveBatch, isOnline } = useCropSync();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        cropType: 'Paddy/Rice',
        weight: '',
        harvestDate: '',
        division: 'Dhaka',
        storageType: 'Jute Bag',
    });

    useEffect(() => {
        if (isOpen) {
            setLoading(false);
            setFormData({
                cropType: 'Paddy/Rice',
                weight: '',
                harvestDate: '',
                division: 'Dhaka',
                storageType: 'Jute Bag'
            });
        }
    }, [isOpen]);

    // if (!isOpen) return null; // Removed to prevent hook consistency issues

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Safety timeout - increased to 60s for slow connections
        const timeoutId = setTimeout(() => {
            setLoading(false);
            alert(t('addBatch.alert.timeout'));
        }, 60000);

        try {
            const result = await saveBatch({
                ...formData,
                weight: Number(formData.weight)
            });

            if (result.success) {
                clearTimeout(timeoutId); // Clear timeout immediately on success
                setLoading(false);
                onClose(); // Close immediately on success

                if (result.mode === 'offline') {
                    alert(t('addBatch.alert.offline'));
                } else {
                    // Optional: success toast
                }
                // Reset form
                setFormData({
                    cropType: 'Paddy/Rice',
                    weight: '',
                    harvestDate: '',
                    division: 'Dhaka',
                    storageType: 'Jute Bag'
                });
            }
        } catch (error) {
            console.error("Failed to add batch", error);
            alert(t('addBatch.alert.failed'));
        } finally {
            clearTimeout(timeoutId);
            setLoading(false); // Always reset loading state
        }
    };

    const divisions = [
        "Dhaka", "Chittagong", "Sylhet", "Khulna",
        "Rajshahi", "Rangpur", "Barisal", "Mymensingh"
    ];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-gray-100">
                    <div className="flex items-center gap-2">
                        <h2 className="text-xl font-bold text-gray-900">{t('addBatch.title')}</h2>
                        {isOnline ? (
                            <span className="flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                <Wifi size={10} /> {t('addBatch.online')}
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-[10px] bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                                <WifiOff size={10} /> {t('addBatch.offline')}
                            </span>
                        )}
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">{t('addBatch.cropType')}</label>
                        <div className="relative">
                            <Sprout className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <select
                                value={formData.cropType}
                                onChange={(e) => setFormData({ ...formData, cropType: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                <option value="Paddy/Rice">{t('addBatch.crops.paddy')}</option>
                                <option value="Wheat">{t('addBatch.crops.wheat')}</option>
                                <option value="Corn (Maize)">{t('addBatch.crops.corn')}</option>
                                <option value="Potato">{t('addBatch.crops.potato')}</option>
                                <option value="Mustard">{t('addBatch.crops.mustard')}</option>
                                <option value="Demo Potato">{t('addBatch.crops.demo')}</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">{t('addBatch.weight')}</label>
                            <div className="relative">
                                <Package className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="number"
                                    placeholder="0"
                                    required
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Moisture (%)</label>
                            <div className="relative">
                                <AlertTriangle className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="number"
                                    placeholder="14"
                                    required
                                    value={formData.moistureContent || ''}
                                    onChange={(e) => setFormData({ ...formData, moistureContent: e.target.value })}
                                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">{t('addBatch.harvestDate')}</label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="date"
                                required
                                value={formData.harvestDate}
                                onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">{t('addBatch.division')}</label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <select
                                value={formData.division}
                                onChange={(e) => setFormData({ ...formData, division: e.target.value })}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                            >
                                {divisions.map(div => (
                                    <option key={div} value={div}>{div}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">{t('addBatch.storageType')}</label>
                        <select
                            value={formData.storageType}
                            onChange={(e) => setFormData({ ...formData, storageType: e.target.value })}
                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                        >
                            <option value="Jute Bag">{t('addBatch.storage.jute')}</option>
                            <option value="Silo">{t('addBatch.storage.silo')}</option>
                            <option value="Open Area">{t('addBatch.storage.open')}</option>
                            <option value="Plastic Drum">{t('addBatch.storage.plastic')}</option>
                            <option value="Cold Storage">{t('addBatch.storage.cold')}</option>
                        </select>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
                        >
                            {t('addBatch.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`flex-1 font-bold py-3 rounded-xl transition-colors shadow-lg disabled:opacity-50 ${isOnline
                                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                                }`}
                        >
                            {loading ? t('addBatch.saving') : (isOnline ? t('addBatch.saveCloud') : t('addBatch.saveOffline'))}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddBatchModal;
