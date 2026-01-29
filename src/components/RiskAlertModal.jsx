import React from 'react';

const RiskAlertModal = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-10">
            {/* Backdrop (optional, but good for focus) */}
            <div
                className="fixed inset-0 bg-black/20 transition-opacity"
                onClick={onClose}
            ></div>

            {/* Modal Content - Mimicking Browser Alert (Dark Mode) */}
            <div className="bg-[#2B2B2B] text-white rounded-xl shadow-2xl w-[400px] max-w-[90vw] overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 relative z-50 border border-gray-700">
                {/* Header */}
                <div className="px-6 pt-6 pb-2">
                    <h3 className="text-lg font-medium text-white">farmix-59170.web.app says</h3>
                </div>

                {/* Message */}
                <div className="px-6 py-4">
                    <p className="text-gray-300 text-sm leading-relaxed">
                        {message}
                    </p>
                </div>

                {/* Footer / Actions */}
                <div className="px-6 pb-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-[#3B82F6] hover:bg-[#2563EB] text-white px-6 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#2B2B2B]"
                    >
                        OK
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RiskAlertModal;
