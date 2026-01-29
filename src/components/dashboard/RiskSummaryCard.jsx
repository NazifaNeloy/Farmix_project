import React from 'react';
import { AlertTriangle, Clock, Thermometer, Droplets, Wind, CheckCircle } from 'lucide-react';

const RiskSummaryCard = ({ batch, riskData }) => {
    const { riskLevel, etclHours, advice, color, riskFactors } = riskData;

    // Color mapping
    const colorClasses = {
        red: 'bg-red-50 border-red-200 text-red-800',
        orange: 'bg-orange-50 border-orange-200 text-orange-800',
        green: 'bg-emerald-50 border-emerald-200 text-emerald-800'
    };

    const barColorClasses = {
        red: 'bg-red-500',
        orange: 'bg-orange-500',
        green: 'bg-emerald-500'
    };

    // Parse bold text in advice
    const renderAdvice = (text) => {
        const parts = text.split(/(\*\*.*?\*\*)/);
        return parts.map((part, index) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                return <strong key={index}>{part.slice(2, -2)}</strong>;
            }
            return part;
        });
    };

    return (
        <div className={`rounded-xl border p-4 mb-3 h-auto ${colorClasses[color]}`}>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-2">
                    {riskLevel === 'CRITICAL' && <AlertTriangle className="text-red-600" size={20} />}
                    {riskLevel === 'HIGH' && <AlertTriangle className="text-orange-600" size={20} />}
                    {riskLevel === 'SAFE' && <CheckCircle className="text-emerald-600" size={20} />}
                    <h4 className="font-bold text-lg">{batch.cropType} Batch</h4>
                </div>
                <div className="text-xs font-bold px-2 py-1 rounded-full bg-white/50 border border-current">
                    {riskLevel} RISK
                </div>
            </div>

            {/* ETCL Meter */}
            <div className="mb-4">
                <div className="flex justify-between text-xs font-bold mb-1 opacity-80">
                    <span>Time to Spoilage (ETCL)</span>
                    <span>{Math.round(etclHours)} Hours</span>
                </div>
                <div className="h-2 bg-white/50 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-500 ${barColorClasses[color]}`}
                        style={{ width: `${Math.min(100, (etclHours / 120) * 100)}%` }}
                    ></div>
                </div>
            </div>

            {/* Advice */}
            <div className="bg-white/60 rounded-lg p-3 text-sm leading-relaxed mb-3 break-words whitespace-normal">
                {renderAdvice(advice)}
            </div>

            {/* Factors */}
            {riskFactors.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {riskFactors.map((factor, idx) => (
                        <span key={idx} className="text-[10px] font-bold px-2 py-0.5 bg-white/50 rounded-full border border-current opacity-70">
                            {factor}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RiskSummaryCard;
