import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import farmixLogo from '../assets/farmix_logo.png';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { language, toggleLanguage, t } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const location = useLocation();
    const isLanding = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: t('nav.home'), path: '/' },
        { name: t('nav.about'), path: '/about' },
        { name: t('nav.problem'), path: '/problem' },
        { name: t('nav.approach'), path: '/approach' },
        ...(user ? [
            { name: t('nav.dashboard'), path: '/harvest' },
            { name: t('nav.risk'), path: '/risk-analysis' },
            { name: 'Community Map', path: '/community-map' }
        ] : []),
    ];

    return (
        <nav
            className={`fixed w-full z-50 transition-all duration-300 ${isLanding
                ? scrolled
                    ? 'bg-white/90 backdrop-blur-md shadow-sm py-4'
                    : 'bg-transparent py-6'
                : 'bg-white shadow-sm py-4'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-0 group">
                    <div className={`transition-colors ${isLanding && !scrolled ? 'bg-transparent' : 'bg-transparent'}`}>
                        <img
                            src={farmixLogo}
                            alt="Farmix Logo"
                            className={`h-16 w-auto object-contain ${isLanding && !scrolled ? 'brightness-0 invert' : ''}`}
                        />
                    </div>
                    <span className={`text-2xl font-playfair font-bold ${isLanding && !scrolled ? 'text-white' : 'text-farm-dark'}`}>
                        Farmix
                    </span>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`text-sm font-medium transition-colors hover:text-farm-lime ${isLanding && !scrolled ? 'text-white/90' : 'text-gray-600'
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}

                    {user && (
                        <Link
                            to="/scanner"
                            className={`text-sm font-bold transition-colors flex items-center gap-2 ${isLanding && !scrolled ? 'text-farm-lime hover:text-white' : 'text-farm-lime hover:text-lime-700'}`}
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                            </span>
                            {t('nav.scanner')}
                        </Link>
                    )}

                    <button
                        onClick={toggleLanguage}
                        className={`px-3 py-1 rounded-full text-xs font-bold border transition-all ${isLanding && !scrolled
                            ? 'border-white/30 text-white hover:bg-white/10'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        {language === 'en' ? 'BN' : 'EN'}
                    </button>

                    {!user ? (
                        <Link
                            to="/auth"
                            className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${isLanding && !scrolled
                                ? 'bg-white text-farm-dark hover:bg-gray-100'
                                : 'bg-farm-lime text-farm-dark hover:bg-opacity-90 shadow-lg shadow-farm-lime/20'
                                }`}
                        >
                            {t('nav.register')}
                        </Link>
                    ) : (
                        <button
                            onClick={logout}
                            className={`px-5 py-2.5 rounded-full text-sm font-bold border transition-all ${isLanding && !scrolled
                                ? 'border-white/30 text-white hover:bg-white/10'
                                : 'border-red-100 text-red-500 hover:bg-red-50'
                                }`}
                        >
                            {t('nav.logout')}
                        </button>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`md:hidden p-2 rounded-lg transition-colors ${isLanding && !scrolled ? 'text-white hover:bg-white/10' : 'text-gray-600 hover:bg-gray-100'
                        }`}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
                    >
                        <div className="p-4 space-y-4 flex flex-col">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.path}
                                    to={link.path}
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-600 font-medium py-2 hover:text-farm-lime"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            {user && (
                                <Link
                                    to="/scanner"
                                    onClick={() => setIsOpen(false)}
                                    className="text-farm-lime font-bold py-2 hover:text-lime-600 transition-colors flex items-center gap-1"
                                >
                                    <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                    {t('nav.scanner')}
                                </Link>
                            )}
                            <div className="h-px bg-gray-100 my-2" />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-500">{t('nav.language')}</span>
                                <button
                                    onClick={toggleLanguage}
                                    className="px-3 py-1 rounded-full text-xs font-bold border border-gray-200 text-gray-600"
                                >
                                    {language === 'en' ? 'BN' : 'EN'}
                                </button>
                            </div>
                            {!user ? (
                                <Link
                                    to="/auth"
                                    onClick={() => setIsOpen(false)}
                                    className="w-full py-3 bg-farm-lime text-farm-dark rounded-xl font-bold text-center shadow-lg shadow-farm-lime/20"
                                >
                                    {t('nav.register')}
                                </Link>
                            ) : (
                                <button
                                    onClick={() => {
                                        logout();
                                        setIsOpen(false);
                                    }}
                                    className="w-full py-3 border border-red-100 text-red-500 rounded-xl font-bold hover:bg-red-50"
                                >
                                    {t('nav.logout')}
                                </button>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};

export default Navbar;
