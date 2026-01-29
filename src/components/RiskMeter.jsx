import React from 'react';
import { calculateETCL, getRiskLevel, getRiskColor } from '../utils/predictionEngine';
import { AlertOctagon, Clock, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const RiskMeter = ({ humidity = 70, temp = 30, rainIn24Hours = false, crop = 'Rice' }) => {
    const { language } = useLanguage();

    const etcl = calculateETCL(humidity, temp, rainIn24Hours, crop);
    const riskLevel = getRiskLevel(etcl);
    const colorClass = getRiskColor(riskLevel);

    const getIcon = () => {
        switch (riskLevel) {
            case 'High': return <AlertOctagon size={32} />;
            case 'Medium': return <Clock size={32} />;
            case 'Low': return <ShieldCheck size={32} />;
            default: return <ShieldCheck size={32} />;
        }
    };

    const getMessage = () => {
        if (language === 'bn') {
            if (riskLevel === 'High') return `ঝুঁকি বেশি! ${etcl} ঘন্টার মধ্যে আপনার ফসল শুকিয়ে নিন।`;
            if (riskLevel === 'Medium') return `সতর্ক থাকুন। আপনার হাতে ${etcl} ঘন্টা সময় আছে।`;
            return `আপনার ফসল নিরাপদ। আনুমানিক সময়: ${etcl} ঘন্টা।`;
        } else {
            if (riskLevel === 'High') return `Risk Level: High. Dry your crops within ${etcl} hours.`;
            if (riskLevel === 'Medium') return `Moderate Risk. You have approx ${etcl} hours.`;
            return `Crops are safe. Estimated time: ${etcl} hours.`;
        }
    };

    return (
        <div className={`p-6 rounded-2xl border mb-6 flex items-center gap-4 ${colorClass}`}>
            <div className="shrink-0">
                {getIcon()}
            </div>
            <div>
                <h3 className="text-lg font-bold uppercase tracking-wide mb-1">
                    {language === 'bn' ? 'ঝুঁকি মিটার' : 'Risk Meter'}
                </h3>
                <p className="font-medium text-lg leading-snug">
                    {getMessage()}
                </p>
            </div>
        </div>
    );
};

export default RiskMeter;
