import React, { useState } from 'react';
import { useBatch } from '../context/BatchContext';
import { useLanguage } from '../context/LanguageContext';
import { Plus, Save } from 'lucide-react';

const AddBatchForm = () => {
    const { addBatch } = useBatch();
    const { t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);

    const [formData, setFormData] = useState({
        cropType: 'Paddy',
        weight: '',
        harvestDate: new Date().toISOString().split('T')[0],
        storageLocation: '',
        storageType: 'Silo',
        status: 'Active'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        addBatch({
            ...formData,
            weight: Number(formData.weight)
        });
        setIsOpen(false);
        // Reset form
        setFormData({
            cropType: 'Paddy',
            weight: '',
            harvestDate: new Date().toISOString().split('T')[0],
            storageLocation: '',
            storageType: 'Silo',
            status: 'Active'
        });
    };

    if (!isOpen) {
        return (
            <button
                id="add-batch-btn"
                onClick={() => setIsOpen(true)}
                className="w-full py-4 bg-farm-green-100 border-2 border-dashed border-farm-green-300 rounded-2xl text-farm-green-700 font-bold flex items-center justify-center gap-2 hover:bg-farm-green-200 transition-colors"
            >
                <Plus /> Add New Harvest Batch
            </button>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
            <h3 className="text-lg font-bold text-farm-green-900 mb-4">New Harvest Entry</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
                        <select
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                            value={formData.cropType}
                            onChange={e => setFormData({ ...formData, cropType: e.target.value })}
                        >
                            <option value="Paddy">Paddy (ধান)</option>
                            <option value="Wheat">Wheat (গম)</option>
                            <option value="Potato">Potato (আলু)</option>
                            <option value="Corn">Corn (ভুট্টা)</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                        <input
                            type="number"
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                            value={formData.weight}
                            onChange={e => setFormData({ ...formData, weight: e.target.value })}
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Harvest Date</label>
                    <input
                        type="date"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                        value={formData.harvestDate}
                        onChange={e => setFormData({ ...formData, harvestDate: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Storage Location (District)</label>
                    <input
                        type="text"
                        required
                        placeholder="e.g. Rangpur"
                        className="w-full px-4 py-2 border border-gray-300 rounded-xl"
                        value={formData.storageLocation}
                        onChange={e => setFormData({ ...formData, storageLocation: e.target.value })}
                    />
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-xl transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="flex-1 py-3 bg-farm-green-500 text-white font-bold rounded-xl hover:bg-farm-green-600 transition-colors flex items-center justify-center gap-2"
                    >
                        <Save size={20} /> Save Batch
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBatchForm;
