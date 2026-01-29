import React, { useEffect, useState, useRef } from 'react';
import { motion, useInView, useSpring, useMotionValue } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Leaf, ShieldCheck, Zap, Sprout, BarChart3, Users, Cloud, Sun, Droplets, Wind, Wheat, Tractor, Plus, MapPin, Quote, TrendingUp } from 'lucide-react';
import logo from '../assets/logo.png';
import heroVideo from '../assets/betterhealth2.MP4';
import abdulKarim from '../assets/abdul_karim.jpeg';
import rahimaKhatun from '../assets/rahima_khatun.jpeg';
import mohammadAli from '../assets/mohammad_ali.jpeg';
import smartMonitoring from '../assets/smart_monitoring.jpeg';
import preciousAnalysis from '../assets/precious_analysis.jpeg';
import automatedCare from '../assets/automated_care.jpeg';
import smartFarming from '../assets/smart_farming.jpeg';
import joinUsInTheFight from '../assets/join_us_in_the_fight.jpeg';
import preciousAnalysisNew from '../assets/precious_analysis_new.jpeg';

const CountUp = ({ value, suffix = '' }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, margin: "-100px" });
    const motionValue = useMotionValue(0);
    const springValue = useSpring(motionValue, { duration: 3000 });
    const [displayValue, setDisplayValue] = useState(0);

    useEffect(() => {
        if (isInView) {
            motionValue.set(value);
        } else {
            motionValue.set(0);
        }
    }, [isInView, value, motionValue]);

    useEffect(() => {
        springValue.on("change", (latest) => {
            setDisplayValue(Math.floor(latest));
        });
    }, [springValue]);

    return <span ref={ref}>{displayValue}{suffix}</span>;
};

const Card = ({ item, index }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            layout
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.2 }}
            className="relative rounded-[2.5rem] overflow-hidden cursor-pointer group h-[500px] md:h-full shadow-sm hover:shadow-2xl transition-shadow duration-500"
        >
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500"></div>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
                <div className="flex justify-between items-start">
                    <span className="bg-white/20 backdrop-blur-md text-white px-4 py-1 rounded-full text-sm font-medium border border-white/30">
                        0{index + 1}
                    </span>
                    <motion.div
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-farm-dark"
                    >
                        <ArrowRight size={20} className={isOpen ? "" : "-rotate-45"} />
                    </motion.div>
                </div>

                <div>
                    <h3 className="text-3xl font-bold text-white mb-2">{item.title}</h3>
                    <motion.p
                        initial={{ opacity: 0, height: 0 }}
                        whileHover={{ opacity: 1, height: "auto" }}
                        className="text-gray-200 font-medium"
                    >
                        {item.shortDesc}
                    </motion.p>
                </div>
            </div>

            {/* Slide-up Detail Panel */}
            <motion.div
                initial={{ y: "100%" }}
                animate={{ y: isOpen ? "0%" : "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="absolute inset-0 bg-white p-8 flex flex-col justify-center z-20"
            >
                <h3 className="text-2xl font-bold text-farm-dark mb-4">{item.title}</h3>
                <p className="text-gray-600 leading-relaxed mb-8">
                    {item.fullDesc}
                </p>
                <button className="flex items-center gap-2 text-farm-lime font-bold hover:gap-4 transition-all">
                    {item.ctaText || "Learn more"} <ArrowRight size={20} />
                </button>
            </motion.div>
        </motion.div>
    );
};



const LandingPage = () => {
    const { language, toggleLanguage, t } = useLanguage();
    const { user } = useAuth();

    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <div className="min-h-screen bg-farm-cream font-sans text-farm-dark overflow-x-hidden">




            {/* Navbar removed - handled by App.jsx */}

            {/* Hero Section */}
            <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
                {/* Background Video */}
                <video
                    src={heroVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute top-0 left-0 w-full h-full object-cover z-0"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 z-0"></div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 text-center">
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        variants={staggerContainer}
                        className="flex flex-col items-center"
                    >
                        {/* Floating Tags */}
                        <div className="flex flex-wrap justify-center gap-4 mb-8">
                            <motion.span variants={fadeInUp} className="px-4 py-1 rounded-full border border-white/30 text-white backdrop-blur-sm text-sm font-medium">
                                {t('hero.tags.ai')}
                            </motion.span>
                            <motion.span variants={fadeInUp} className="px-4 py-1 rounded-full border border-white/30 text-white backdrop-blur-sm text-sm font-medium">
                                {t('hero.tags.realtime')}
                            </motion.span>
                            <motion.span variants={fadeInUp} className="px-4 py-1 rounded-full border border-white/30 text-white backdrop-blur-sm text-sm font-medium">
                                {t('hero.tags.accuracy')}
                            </motion.span>
                        </div>

                        <motion.h1
                            variants={fadeInUp}
                            className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight tracking-tight"
                        >
                            {t('hero.headline')}
                        </motion.h1>

                        <motion.p
                            variants={fadeInUp}
                            className="text-xl text-gray-200 mb-10 max-w-2xl mx-auto"
                        >
                            {t('hero.subheadline')}
                        </motion.p>

                        <motion.div variants={fadeInUp}>
                            <Link
                                to={user ? "/harvest" : "/auth"}
                                className="group relative inline-flex items-center gap-3 bg-farm-lime text-farm-dark px-8 py-4 rounded-full text-lg font-bold hover:bg-white transition-all duration-300 transform hover:scale-105"
                            >
                                {t('hero.cta')}
                                <span className="bg-farm-dark/10 p-1 rounded-full group-hover:bg-farm-dark/20 transition-colors">
                                    <ArrowRight size={20} />
                                </span>
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Bar */}
            <div className="bg-white py-12 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                        { label: t('stats.farmers'), value: 50, suffix: '+', icon: Users },
                        { label: t('stats.crops'), value: 120, suffix: 'k+', icon: Sprout },
                        { label: t('stats.disease'), value: 98, suffix: '%', icon: ShieldCheck },
                        { label: t('stats.yield'), value: 30, suffix: '%', icon: BarChart3 },
                    ].map((stat, i) => (
                        <div key={i} className="flex flex-col items-center md:items-start">
                            <h3 className="text-4xl font-bold text-farm-dark mb-1">
                                <CountUp value={stat.value} suffix={stat.suffix} />
                            </h3>
                            <p className="text-gray-500 text-sm font-medium uppercase tracking-wider flex items-center gap-2">
                                <stat.icon size={16} className="text-farm-lime" />
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>



            {/* New "Elevates Operations" Section */}
            {/* New "Elevates Operations" Section */}
            <section className="py-32 px-4 bg-white">
                <div className="max-w-7xl mx-auto">
                    {/* Headline */}
                    <div className="text-center mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 bg-farm-cream px-4 py-2 rounded-full mb-6"
                        >
                            <span className="w-2 h-2 bg-farm-lime rounded-full"></span>
                            <span className="text-farm-dark font-medium text-sm uppercase tracking-wider">{t('elevates.badge')}</span>
                        </motion.div>
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-7xl font-bold text-farm-dark leading-tight max-w-5xl mx-auto"
                        >
                            {t('elevates.headline')}
                        </motion.h2>
                    </div>

                    {/* Interactive Cards Grid */}
                    <div className="grid md:grid-cols-3 gap-8 h-auto md:h-[600px]">
                        {[
                            {
                                title: t('elevates.cards.monitoring.title'),
                                image: smartMonitoring,
                                shortDesc: t('elevates.cards.monitoring.short'),
                                fullDesc: t('elevates.cards.monitoring.full'),
                                ctaText: t('elevates.cards.monitoring.cta')
                            },
                            {
                                title: t('elevates.cards.analysis.title'),
                                image: preciousAnalysisNew,
                                shortDesc: t('elevates.cards.analysis.short'),
                                fullDesc: t('elevates.cards.analysis.full'),
                                ctaText: t('elevates.cards.analysis.cta')
                            },
                            {
                                title: t('elevates.cards.care.title'),
                                image: automatedCare,
                                shortDesc: t('elevates.cards.care.short'),
                                fullDesc: t('elevates.cards.care.full'),
                                ctaText: t('elevates.cards.care.cta')
                            }
                        ].map((item, i) => (
                            <Card key={i} item={item} index={i} />
                        ))}
                    </div>
                </div>
            </section>

            {/* Agricultural Support Section */}
            <section className="py-24 px-4 bg-white font-inter overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    {/* Top Row */}
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-block px-4 py-1 rounded-full border border-gray-300 text-xs font-bold tracking-widest text-gray-500 uppercase mb-8">
                                {t('support.badge')}
                            </div>
                            <h2 className="text-5xl md:text-7xl font-playfair text-gray-900 mb-8 leading-tight">
                                {t('support.headline')}
                            </h2>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-farm-lime text-farm-dark px-8 py-3 rounded-full font-bold flex items-center gap-2 hover:shadow-lg hover:shadow-farm-lime/30 transition-all"
                            >
                                • {t('support.readMore')}
                            </motion.button>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative h-[400px] rounded-[2rem] overflow-hidden group"
                        >
                            <img
                                src={smartFarming}
                                alt="Industrial Railway"
                                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-100 group-hover:scale-110"
                            />
                        </motion.div>
                    </div>

                    {/* Features Grid */}
                    <div className="grid md:grid-cols-3 gap-12">
                        {[
                            {
                                icon: Wheat,
                                title: t('support.features.sustainability.title'),
                                desc: t('support.features.sustainability.desc')
                            },
                            {
                                icon: Tractor,
                                title: t('support.features.farmer.title'),
                                desc: t('support.features.farmer.desc')
                            },
                            {
                                icon: Sprout,
                                title: t('support.features.innovation.title'),
                                desc: t('support.features.innovation.desc')
                            }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2, duration: 0.6 }}
                                className="group"
                            >
                                <div className="w-12 h-12 bg-transparent rounded-xl flex items-center justify-start text-gray-700 mb-6 group-hover:text-farm-lime transition-colors">
                                    <feature.icon size={32} strokeWidth={1.5} />
                                </div>
                                <h3 className="text-xl font-medium text-gray-800 mb-4 group-hover:text-farm-dark transition-colors">{feature.title}</h3>
                                <p className="text-gray-500 leading-relaxed mb-8 text-sm">
                                    {feature.desc}
                                </p>
                                <motion.button
                                    whileHover={{ scale: 1.1, rotate: 90 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-10 h-10 rounded-full bg-farm-lime flex items-center justify-center text-farm-dark hover:bg-farm-dark hover:text-farm-lime transition-colors shadow-md"
                                >
                                    <Plus size={20} />
                                </motion.button>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Success Stories Section */}
            <section className="py-24 px-4 bg-gray-50 font-inter">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 text-green-800 font-medium mb-4">
                            <Users size={18} />
                            <span className="text-sm uppercase tracking-wider">{t('stories.badge')}</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{t('stories.headline')}</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            {t('stories.subheadline')}
                        </p>
                    </div>

                    {/* Card Grid */}
                    <div className="grid md:grid-cols-3 gap-8">
                        {(Array.isArray(t('stories.list')) ? t('stories.list') : []).map((story, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                            >
                                {/* Top Half: Image */}
                                <div className="relative h-64">
                                    <img
                                        src={[abdulKarim, rahimaKhatun, mohammadAli][i]}
                                        alt={story.name}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <h3 className="text-xl font-bold mb-1">{story.name}</h3>
                                        <div className="flex items-center gap-1 text-sm text-gray-200">
                                            <MapPin size={14} />
                                            <span>{story.location}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Bottom Half: Content */}
                                <div className="p-6">
                                    <Quote size={32} className="text-green-700 mb-4 opacity-80" />
                                    <p className="text-gray-600 leading-relaxed mb-6 min-h-[100px]">
                                        "{story.quote}"
                                    </p>

                                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                            <TrendingUp size={16} className="text-green-600" />
                                            {t('stories.saved')}
                                        </div>
                                        <span className="text-green-700 font-bold text-lg">{story.savedAmount}</span>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Big Feature Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto bg-farm-dark rounded-[3rem] overflow-hidden text-white relative">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-farm-lime/5 skew-x-12 transform translate-x-20"></div>

                    <div className="grid md:grid-cols-2 gap-12 items-center p-8 md:p-16 relative z-10">
                        <div>
                            <span className="text-farm-lime font-bold tracking-wider uppercase text-sm mb-4 block">{t('feature.badge')}</span>
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                                {t('feature.headline')}
                            </h2>
                            <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                                {t('feature.desc')}
                            </p>

                            <ul className="space-y-4 mb-10">
                                {[t('feature.list.instant'), t('feature.list.offline'), t('feature.list.expert')].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-gray-200">
                                        <div className="w-6 h-6 rounded-full bg-farm-lime flex items-center justify-center text-farm-dark">
                                            <ArrowRight size={12} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                to={user ? "/scanner" : "/auth"}
                                className="inline-block bg-white text-farm-dark px-8 py-4 rounded-full font-bold hover:bg-farm-lime transition-colors relative z-20"
                            >
                                {t('feature.cta')}
                            </Link>
                        </div>

                        <div className="relative h-[500px] rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white/10 group">
                            <img
                                src="https://images.unsplash.com/photo-1586771107445-d3ca888129ff?q=80&w=2072&auto=format&fit=crop"
                                alt="Farmer using phone"
                                className="w-full h-full object-cover"
                            />

                            {/* Scanning Animation */}
                            <motion.div
                                className="absolute top-0 left-0 right-0 h-1 bg-farm-lime shadow-[0_0_20px_rgba(204,243,129,0.8)] z-20"
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />
                            <motion.div
                                className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-farm-lime/20 to-transparent z-10"
                                animate={{ top: ["0%", "100%", "0%"] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                            />

                            {/* Floating UI Element */}
                            <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 z-30">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center text-white">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <p className="text-white font-bold">{t('feature.analysis')}</p>
                                        <p className="text-green-300 text-sm">{t('feature.healthy')}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* New Eco-Themed Section */}
            <section className="py-24 px-4 bg-white relative overflow-hidden">
                {/* Decorative Circle */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-farm-lime/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
                        {/* Left Content */}
                        <div>
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="mb-8"
                            >
                                <h2 className="text-5xl md:text-7xl font-bold text-farm-dark leading-tight mb-6 relative z-10">
                                    {t('eco.headline')}
                                </h2>
                                <p className="text-xl text-gray-500 leading-relaxed max-w-lg">
                                    {t('eco.desc')}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.2 }}
                                className="flex flex-wrap items-center gap-6"
                            >
                                <div className="flex items-center gap-4 bg-white p-2 pr-6 rounded-full shadow-lg border border-gray-100">
                                    <div className="flex -space-x-4">
                                        <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" alt="User" />
                                        <img className="w-10 h-10 rounded-full border-2 border-white" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop" alt="User" />
                                    </div>
                                    <Link to="/auth" className="bg-farm-dark text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-farm-lime hover:text-farm-dark transition-colors">
                                        {t('eco.join')}
                                    </Link>
                                </div>

                                <button className="px-8 py-3 rounded-full border-2 border-gray-200 font-bold text-gray-600 hover:border-farm-dark hover:text-farm-dark transition-colors flex items-center gap-2">
                                    {t('eco.learn')} <ArrowRight size={18} />
                                </button>
                            </motion.div>
                        </div>

                        {/* Right Image Banner */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="h-[500px] rounded-[3rem] overflow-hidden shadow-2xl relative">
                                <img
                                    src={joinUsInTheFight}
                                    alt="Wind Turbines"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>

                            {/* Floating Stats Box */}
                            <motion.div
                                initial={{ opacity: 0, y: 20, x: -20 }}
                                whileInView={{ opacity: 1, y: 0, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4 }}
                                className="absolute bottom-12 left-0 md:-left-12 bg-white/90 backdrop-blur-xl p-8 rounded-[2rem] shadow-xl border border-white/50 max-w-xs"
                            >
                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-12 h-12 bg-farm-lime/20 rounded-2xl flex items-center justify-center text-farm-dark">
                                        <Wheat size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-bold text-farm-dark">+685</h3>
                                        <p className="text-sm font-bold text-gray-500 uppercase tracking-wider">{t('eco.statTitle')}</p>
                                    </div>
                                </div>
                                <p className="text-gray-500 text-sm leading-relaxed">
                                    {t('eco.statDesc')}
                                </p>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Integrated Sponsor Marquee */}
                    <div className="pt-12 border-t border-gray-100">
                        <div className="flex relative overflow-hidden">
                            <motion.div
                                className="flex gap-16 items-center whitespace-nowrap"
                                animate={{ x: "-50%" }}
                                transition={{
                                    repeat: Infinity,
                                    ease: "linear",
                                    duration: 30
                                }}
                            >
                                {/* Duplicate list for infinite loop */}
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="flex gap-16 items-center opacity-50 hover:opacity-100 transition-opacity duration-300">
                                        <div className="flex items-center gap-2 text-gray-400 font-bold text-2xl"><Cloud size={32} /> AgriCloud</div>
                                        <div className="flex items-center gap-2 text-gray-400 font-bold text-2xl"><Sun size={32} /> SolarGrow</div>
                                        <div className="flex items-center gap-2 text-gray-400 font-bold text-2xl"><Droplets size={32} /> PureWater</div>
                                        <div className="flex items-center gap-2 text-gray-400 font-bold text-2xl"><Wind size={32} /> EcoFarm</div>
                                        <div className="flex items-center gap-2 text-gray-400 font-bold text-2xl"><Leaf size={32} /> GreenTech</div>
                                        <div className="flex items-center gap-2 text-gray-400 font-bold text-2xl"><Sprout size={32} /> FutureSeeds</div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>
        </div >
    );
};

export default LandingPage;
