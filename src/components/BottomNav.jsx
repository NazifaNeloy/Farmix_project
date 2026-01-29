import React from 'react';
import { NavLink } from 'react-router-dom';
import { Sprout, Scan, User, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const BottomNav = () => {
    const { t } = useLanguage();

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe z-50">
            <div className="flex justify-around items-center h-16 max-w-md mx-auto">
                <NavLink
                    to="/harvest"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-farm-green-600' : 'text-gray-400 hover:text-gray-600'}`
                    }
                >
                    <Sprout size={24} />
                    <span className="text-xs font-medium">{t('bottomNav.harvest')}</span>
                </NavLink>

                <NavLink
                    to="/risk-analysis"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-farm-green-600' : 'text-gray-400 hover:text-gray-600'}`
                    }
                >
                    <AlertTriangle size={24} />
                    <span className="text-xs font-medium">{t('bottomNav.risk')}</span>
                </NavLink>

                <NavLink
                    to="/scanner"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-farm-green-600' : 'text-gray-400 hover:text-gray-600'}`
                    }
                >
                    <Scan size={24} />
                    <span className="text-xs font-medium">{t('bottomNav.scanner')}</span>
                </NavLink>

                <NavLink
                    to="/profile"
                    className={({ isActive }) =>
                        `flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-farm-green-600' : 'text-gray-400 hover:text-gray-600'}`
                    }
                >
                    <User size={24} />
                    <span className="text-xs font-medium">{t('bottomNav.profile')}</span>
                </NavLink>
            </div>
        </div>
    );
};

export default BottomNav;
