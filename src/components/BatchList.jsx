import React from 'react';
import { useBatch } from '../context/BatchContext';
import { Cloud, CloudOff, Download, Package } from 'lucide-react';

const BatchList = () => {
    const { batches } = useBatch();

    const downloadCSV = () => {
        if (batches.length === 0) return;

        const headers = ["ID", "Crop", "Weight (kg)", "Date", "Location", "Status", "Synced"];
        const rows = batches.map(b => [
            b.id,
            b.cropType,
            b.weight,
            b.harvestDate,
            b.storageLocation,
            b.status,
            b.synced ? "Yes" : "No"
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "farmix_harvest_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (batches.length === 0) {
        return (
            <div className="text-center py-12 text-gray-400">
                <Package size={48} className="mx-auto mb-4 opacity-50" />
                <p>No harvest batches recorded yet.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-farm-green-900">Recent Batches</h3>
                <button
                    onClick={downloadCSV}
                    className="text-sm text-farm-green-700 font-medium flex items-center gap-1 hover:underline"
                >
                    <Download size={16} /> Export CSV
                </button>
            </div>

            {batches.map((batch) => (
                <div key={batch.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-gray-900">{batch.cropType}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${batch.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                {batch.status}
                            </span>
                        </div>
                        <div className="text-sm text-gray-500">
                            {batch.weight} kg • {batch.harvestDate} • {batch.storageLocation}
                        </div>
                    </div>

                    <div title={batch.synced ? "Synced to Cloud" : "Saved Locally (Waiting for Internet)"}>
                        {batch.synced ? (
                            <Cloud size={20} className="text-farm-green-500" />
                        ) : (
                            <CloudOff size={20} className="text-gray-400" />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default BatchList;
