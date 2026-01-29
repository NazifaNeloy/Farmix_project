import React, { useEffect, useRef, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useLanguage } from '../context/LanguageContext';

const ProblemPage = () => {
    const { t } = useLanguage();
    const [countersAnimated, setCountersAnimated] = useState(false);
    const statsRef = useRef(null);

    useEffect(() => {
        AOS.init({ duration: 800, once: true, offset: 100 });
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !countersAnimated) {
                        setCountersAnimated(true);
                    }
                });
            },
            { threshold: 0.1 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => {
            if (statsRef.current) {
                observer.unobserve(statsRef.current);
            }
        };
    }, [countersAnimated]);

    return (
        <div className="bg-[#FDFBF7] min-h-screen overflow-x-hidden text-slate-800 font-sans">
            {/* Background Ambience */}
            <div className="fixed top-0 right-0 w-96 h-96 bg-green-200 rounded-full filter blur-[80px] opacity-50 translate-x-1/2 -translate-y-1/2 z-0 pointer-events-none"></div>
            <div className="fixed bottom-0 left-0 w-96 h-96 bg-orange-100 rounded-full filter blur-[80px] opacity-50 -translate-x-1/2 translate-y-1/2 z-0 pointer-events-none"></div>

            <section className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20" data-aos="fade-up">
                    <span className="inline-block py-1 px-4 rounded-full bg-orange-100 text-orange-700 text-xs font-bold tracking-widest uppercase mb-6">
                        {t('problem.header.badge')}
                    </span>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-[#142820] mb-6 leading-tight">
                        {t('problem.header.title')}<br />
                        <span className="text-green-700 italic">{t('problem.header.subtitle')}</span>
                    </h2>
                    <p className="text-lg text-slate-600 leading-relaxed font-light">
                        {t('problem.header.desc')}
                    </p>
                </div>

                {/* Bento Grid Stats */}
                <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-24">
                    {/* Card 1 */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-[#142820]/5 border border-slate-100 group hover:-translate-y-2 transition-transform duration-300" data-aos="fade-up" data-aos-delay="100">
                        <div className="w-14 h-14 bg-green-50 rounded-2xl flex items-center justify-center mb-6 text-green-700">
                            <i className="ph ph-trash text-3xl"></i>
                        </div>
                        <h3 className="text-5xl font-bold text-[#142820] mb-2">
                            <Counter target={4.5} shouldAnimate={countersAnimated} />
                        </h3>
                        <span className="text-xl font-serif text-[#1e3a2f]">{t('problem.stats.c1.label')}</span>
                        <p className="text-sm text-slate-500 mt-3 border-t border-slate-100 pt-3">
                            {t('problem.stats.c1.desc')}
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-[#142820]/5 border border-slate-100 group hover:-translate-y-2 transition-transform duration-300" data-aos="fade-up" data-aos-delay="200">
                        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center mb-6 text-orange-600">
                            <i className="ph ph-chart-line-down text-3xl"></i>
                        </div>
                        <h3 className="text-5xl font-bold text-[#142820] mb-2 flex items-center">
                            <span className="text-2xl mr-1">$</span>
                            <Counter target={1.5} shouldAnimate={countersAnimated} />
                            <span className="text-3xl ml-1">B</span>
                        </h3>
                        <span className="text-xl font-serif text-[#1e3a2f]">{t('problem.stats.c2.label')}</span>
                        <p className="text-sm text-slate-500 mt-3 border-t border-slate-100 pt-3">
                            {t('problem.stats.c2.desc')}
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-[#142820]/5 border border-slate-100 group hover:-translate-y-2 transition-transform duration-300" data-aos="fade-up" data-aos-delay="300">
                        <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                            <i className="ph ph-bowl-food text-3xl"></i>
                        </div>
                        <h3 className="text-5xl font-bold text-[#142820] mb-2 flex items-center">
                            <Counter target={30} shouldAnimate={countersAnimated} isInteger />
                            <span className="text-3xl ml-1">%</span>
                        </h3>
                        <span className="text-xl font-serif text-[#1e3a2f]">{t('problem.stats.c3.label')}</span>
                        <p className="text-sm text-slate-500 mt-3 border-t border-slate-100 pt-3">
                            {t('problem.stats.c3.desc')}
                        </p>
                    </div>
                </div>

                {/* ========================================== */}
                {/*  INTERACTIVE BROKEN CHAIN SECTION STARTS   */}
                {/* ========================================== */}
                <div className="mb-24">
                    <div className="text-center mb-16" data-aos="fade-up">
                        <h3 className="text-3xl font-serif font-bold text-[#142820]">{t('problem.chain.title')}</h3>
                        <p className="text-slate-500 mt-2">{t('problem.chain.subtitle')}</p>
                    </div>

                    <div className="relative">
                        {/* Connector Line */}
                        <div className="hidden md:block absolute top-1/2 left-4 right-4 h-1 bg-gradient-to-r from-green-200 via-orange-200 to-red-200 -translate-y-12 z-0 rounded-full"></div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative z-10">

                            {/* Step 1: Harvesting */}
                            <div className="group relative bg-white p-6 rounded-2xl shadow-md text-center border-b-4 border-green-500 hover:border-red-500 hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer overflow-hidden" data-aos="fade-up" data-aos-delay="0">
                                {/* Hover Background Effect */}
                                <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative z-10">
                                    <div className="w-16 h-16 mx-auto bg-green-50 text-green-700 group-hover:bg-white group-hover:text-red-500 rounded-full flex items-center justify-center text-2xl border-4 border-white mb-4 transition-colors duration-300 group-hover:scale-110">
                                        <i className="ph ph-hand-grabbing"></i>
                                    </div>
                                    <h4 className="font-bold text-lg text-[#142820] group-hover:text-red-700 transition-colors">{t('problem.chain.s1.title')}</h4>
                                    <span className="block text-slate-400 group-hover:text-red-600 group-hover:font-black group-hover:scale-110 font-bold text-sm my-1 transition-all duration-300 transform">{t('problem.chain.s1.loss')}</span>
                                    <p className="text-xs text-slate-500 mt-2">{t('problem.chain.s1.desc')}</p>
                                </div>
                            </div>

                            {/* Step 2: Processing */}
                            <div className="group relative bg-white p-6 rounded-2xl shadow-md text-center border-b-4 border-yellow-400 hover:border-red-500 hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer overflow-hidden" data-aos="fade-up" data-aos-delay="150">
                                <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative z-10">
                                    <div className="w-16 h-16 mx-auto bg-yellow-50 text-yellow-600 group-hover:bg-white group-hover:text-red-500 rounded-full flex items-center justify-center text-2xl border-4 border-white mb-4 transition-colors duration-300 group-hover:scale-110">
                                        <i className="ph ph-drop-half-bottom"></i>
                                    </div>
                                    <h4 className="font-bold text-lg text-[#142820] group-hover:text-red-700 transition-colors">{t('problem.chain.s2.title')}</h4>
                                    <span className="block text-slate-400 group-hover:text-red-600 group-hover:font-black group-hover:scale-110 font-bold text-sm my-1 transition-all duration-300 transform">{t('problem.chain.s2.loss')}</span>
                                    <p className="text-xs text-slate-500 mt-2">{t('problem.chain.s2.desc')}</p>
                                </div>
                            </div>

                            {/* Step 3: Storage */}
                            <div className="group relative bg-white p-6 rounded-2xl shadow-md text-center border-b-4 border-orange-500 hover:border-red-500 hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer overflow-hidden" data-aos="fade-up" data-aos-delay="300">
                                <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative z-10">
                                    <div className="w-16 h-16 mx-auto bg-orange-50 text-orange-600 group-hover:bg-white group-hover:text-red-500 rounded-full flex items-center justify-center text-2xl border-4 border-white mb-4 transition-colors duration-300 group-hover:scale-110">
                                        <i className="ph ph-warehouse"></i>
                                    </div>
                                    <h4 className="font-bold text-lg text-[#142820] group-hover:text-red-700 transition-colors">{t('problem.chain.s3.title')}</h4>
                                    <span className="block text-slate-400 group-hover:text-red-600 group-hover:font-black group-hover:scale-110 font-bold text-sm my-1 transition-all duration-300 transform">{t('problem.chain.s3.loss')}</span>
                                    <p className="text-xs text-slate-500 mt-2">{t('problem.chain.s3.desc')}</p>
                                </div>
                            </div>

                            {/* Step 4: Transport */}
                            <div className="group relative bg-white p-6 rounded-2xl shadow-md text-center border-b-4 border-red-500 hover:border-red-600 hover:shadow-2xl hover:-translate-y-3 transition-all duration-300 cursor-pointer overflow-hidden" data-aos="fade-up" data-aos-delay="450">
                                <div className="absolute inset-0 bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                <div className="relative z-10">
                                    <div className="w-16 h-16 mx-auto bg-red-50 text-red-600 group-hover:bg-white group-hover:text-red-600 rounded-full flex items-center justify-center text-2xl border-4 border-white mb-4 transition-colors duration-300 group-hover:scale-110">
                                        <i className="ph ph-road-horizon"></i>
                                    </div>
                                    <h4 className="font-bold text-lg text-[#142820] group-hover:text-red-700 transition-colors">{t('problem.chain.s4.title')}</h4>
                                    <span className="block text-slate-400 group-hover:text-red-600 group-hover:font-black group-hover:scale-110 font-bold text-sm my-1 transition-all duration-300 transform">{t('problem.chain.s4.loss')}</span>
                                    <p className="text-xs text-slate-500 mt-2">{t('problem.chain.s4.desc')}</p>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                {/* ========================================== */}
                {/*  INTERACTIVE BROKEN CHAIN SECTION ENDS     */}
                {/* ========================================== */}

                {/* Split Section: Chart & Causes */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* Dark Chart Card */}
                    <div className="bg-[#142820] p-8 md:p-12 rounded-[2rem] text-white relative overflow-hidden shadow-2xl" data-aos="fade-right">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2"></div>
                        <h3 className="text-2xl font-serif font-bold mb-2 relative z-10">{t('problem.chart.title')}</h3>
                        <p className="text-green-200/60 text-sm mb-10 relative z-10">{t('problem.chart.subtitle')}</p>
                        <div className="space-y-8 relative z-10">
                            <ProgressBar
                                label={t('problem.chart.veg')}
                                icon="ph-carrot"
                                iconColor="text-orange-400"
                                percentage={32}
                                colorClass="bg-gradient-to-r from-orange-500 to-red-500"
                                shouldAnimate={countersAnimated}
                                wastedText={t('problem.chart.wasted')}
                            />
                            <ProgressBar
                                label={t('problem.chart.pulses')}
                                icon="ph-grains"
                                iconColor="text-yellow-400"
                                percentage={15}
                                colorClass="bg-yellow-400"
                                shouldAnimate={countersAnimated}
                                wastedText={t('problem.chart.wasted')}
                            />
                            <ProgressBar
                                label={t('problem.chart.rice')}
                                icon="ph-plant"
                                iconColor="text-green-400"
                                percentage={12}
                                colorClass="bg-green-500"
                                shouldAnimate={countersAnimated}
                                wastedText={t('problem.chart.wasted')}
                            />
                        </div>
                    </div>

                    {/* Root Causes Grid */}
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-[#142820] mb-8" data-aos="fade-up">{t('problem.causes.title')}</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div className="flex gap-4 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100" data-aos="fade-up" data-aos-delay="100">
                                <div className="text-orange-600 bg-orange-50 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                                    <i className="ph ph-thermometer-hot text-xl"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#142820]">{t('problem.causes.c1.title')}</h4>
                                    <p className="text-sm text-slate-500 mt-1">{t('problem.causes.c1.desc')}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100" data-aos="fade-up" data-aos-delay="200">
                                <div className="text-blue-600 bg-blue-50 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                                    <i className="ph ph-snowflake text-xl"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#142820]">{t('problem.causes.c2.title')}</h4>
                                    <p className="text-sm text-slate-500 mt-1">{t('problem.causes.c2.desc')}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 p-5 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-100" data-aos="fade-up" data-aos-delay="300">
                                <div className="text-purple-600 bg-purple-50 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                                    <i className="ph ph-info text-xl"></i>
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#142820]">{t('problem.causes.c3.title')}</h4>
                                    <p className="text-sm text-slate-500 mt-1">{t('problem.causes.c3.desc')}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
};

const Counter = ({ target, shouldAnimate, isInteger = false }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!shouldAnimate) return;

        let start = 0;
        const duration = 2000;
        const increment = target / (duration / 16);

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                setCount(target);
                clearInterval(timer);
            } else {
                setCount(start);
            }
        }, 16);

        return () => clearInterval(timer);
    }, [target, shouldAnimate]);

    return <>{isInteger ? Math.ceil(count) : count.toFixed(1)}</>;
};

const ProgressBar = ({ label, icon, iconColor, percentage, colorClass, shouldAnimate, wastedText }) => {
    return (
        <div>
            <div className="flex justify-between mb-2 text-sm font-medium">
                <span className="flex items-center gap-2"><i className={`ph ${icon} ${iconColor}`}></i> {label}</span>
                <span className={iconColor}>{percentage}% {wastedText || 'Wasted'}</span>
            </div>
            <div className="w-full bg-[#1e3a2f] rounded-full h-2.5">
                <div
                    className={`progress-bar ${colorClass} h-2.5 rounded-full transition-all duration-1500 ease-out`}
                    style={{ width: shouldAnimate ? `${percentage}%` : '0%' }}
                ></div>
            </div>
        </div>
    );
};

export default ProblemPage;
