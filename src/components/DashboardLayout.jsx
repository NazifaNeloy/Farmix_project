import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import { Sprout, Scan, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';


const DashboardLayout = ({ children }) => {
    const { logout } = useAuth();
    const { language, toggleLanguage } = useLanguage();
    const location = useLocation();

    return (
        <div className="min-h-screen bg-farm-cream font-inter flex flex-col">
            {/* Main Content */}
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:p-6 pt-32 pb-24 md:pb-6">
                {children}
            </main>

            {/* Mobile Bottom Navigation for Dashboard Sub-pages */}
            <div className="md:hidden">
                <BottomNav />
            </div>
        </div>
    );
};

export default DashboardLayout;
