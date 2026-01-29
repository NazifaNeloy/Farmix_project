import logo from '../assets/farmix_logo.png';
import { Facebook, Twitter, Instagram, Youtube, Linkedin, ArrowUp } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <footer className="bg-farm-dark text-white pt-24 pb-0 relative overflow-hidden rounded-t-[3rem]">
            <div className="max-w-7xl mx-auto px-4 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                    {/* Brand Column */}
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <img src={logo} alt="Farmix Logo" className="h-12 w-auto object-contain brightness-0 invert" />
                            <span className="text-2xl font-bold text-white">Farmix</span>
                        </div>
                        <p className="text-gray-400 mb-8 leading-relaxed">
                            The easy way to manage your farm, analyze crops, and grow your yield with advanced AI technology.
                        </p>
                        <div className="flex gap-4">
                            {[Facebook, Twitter, Instagram, Youtube, Linkedin].map((Icon, i) => (
                                <a key={i} href="#" className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center hover:bg-farm-lime hover:text-farm-dark hover:border-farm-lime transition-all duration-300">
                                    <Icon size={18} />
                                </a>
                            ))}
                        </div>
                        <p className="text-gray-500 text-sm mt-8">© Copyright 2025 Farmix</p>
                    </div>

                    {/* Links Columns */}
                    <div>
                        <h4 className="text-lg font-bold mb-6">Company</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-farm-lime transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-farm-lime transition-colors">Why Farmix</a></li>
                            <li><a href="#" className="hover:text-farm-lime transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-farm-lime transition-colors">Corporate Responsibility</a></li>
                            <li><a href="#" className="hover:text-farm-lime transition-colors">Careers</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Solutions</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-farm-lime transition-colors">Precision Farming</a></li>
                            <li><a href="#" className="hover:text-farm-lime transition-colors">Crop Analysis</a></li>
                            <li><a href="#" className="hover:text-farm-lime transition-colors">Drone Services</a></li>
                            <li><a href="#" className="hover:text-farm-lime transition-colors">Soil Monitoring</a></li>
                            <li><a href="#" className="hover:text-farm-lime transition-colors">Enterprise</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-6">Popular Products</h4>
                        <ul className="space-y-4 text-gray-400">
                            <li><a href="#" className="hover:text-farm-lime transition-colors">Farmix Pro</a></li>
                            <li><a href="#" className="hover:text-farm-lime transition-colors">Sensor Kit</a></li>
                            <li><a href="#" className="hover:text-farm-lime transition-colors">Drone T50</a></li>
                            <li><a href="#" className="hover:text-farm-lime transition-colors">Smart Irrigation</a></li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Massive Text & Scroll Top */}
            <div className="relative border-t border-white/10 mt-12">
                <h1 className="text-[20vw] md:text-[18vw] font-bold text-white leading-none text-center tracking-tighter select-none pointer-events-none translate-y-[2vw]">
                    Farmix
                </h1>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={scrollToTop}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:left-auto md:translate-x-0 md:right-16 bg-farm-lime text-farm-dark px-6 py-3 rounded-full font-bold flex items-center gap-2 shadow-lg hover:shadow-farm-lime/20 z-10 whitespace-nowrap"
                >
                    Scroll on Top <ArrowUp size={20} />
                </motion.button>
            </div>
        </footer>
    );
};

export default Footer;
