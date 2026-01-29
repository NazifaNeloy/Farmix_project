import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useLanguage } from '../context/LanguageContext';

const AboutPage = () => {
    const { t } = useLanguage();

    useEffect(() => {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50
        });
    }, []);

    return (
        <div className="bg-cream min-h-screen overflow-x-hidden text-slate-800 font-sans">
            <style>{`
                .blob { position: absolute; filter: blur(80px); z-index: 0; opacity: 0.5; }
                
                /* Timeline Line Styling */
                .timeline-line::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    left: 50%;
                    width: 2px;
                    background: #e2e8f0;
                    transform: translateX(-50%);
                    z-index: 0;
                }
                
                @media (max-width: 768px) {
                    .timeline-line::before {
                        left: 20px;
                    }
                }
            `}</style>

            {/* Background Ambience */}
            <div className="blob bg-green-200 w-96 h-96 rounded-full top-20 right-0 translate-x-1/2 pointer-events-none"></div>
            <div className="blob bg-orange-100 w-[600px] h-[600px] rounded-full top-[40%] left-0 -translate-x-1/2 pointer-events-none"></div>

            {/* ========================================== */}
            {/* HERO SECTION */}
            {/* ========================================== */}
            <section className="max-w-7xl mx-auto px-6 pt-32 pb-16 text-center relative z-10">
                <div data-aos="fade-down">
                    <span className="inline-block py-1 px-4 rounded-full bg-forest-900 text-white text-xs font-bold tracking-widest uppercase mb-8 shadow-lg shadow-forest-900/20 relative z-20">
                        {t('about.hero.badge')}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-forest-900 mb-6 leading-tight">
                        {t('about.hero.title')}<br />
                        <span className="text-green-700 italic">{t('about.hero.subtitle')}</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed font-light">
                        {t('about.hero.desc')}
                    </p>
                </div>
            </section>

            {/* ========================================== */}
            {/* MISSION & VISION (Split Panel) */}
            {/* ========================================== */}
            <section className="max-w-7xl mx-auto px-6 py-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Mission */}
                    <div className="bg-forest-900 text-white p-10 md:p-14 rounded-3xl relative overflow-hidden group" data-aos="fade-right">
                        <div className="absolute top-0 right-0 p-20 bg-green-600 rounded-full blur-3xl opacity-20 -mr-10 -mt-10 transition-opacity duration-500 group-hover:opacity-30"></div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-6 text-green-300">
                                <i className="ph ph-target text-2xl"></i>
                            </div>
                            <h3 className="text-3xl font-serif font-bold mb-4">{t('about.mission.title')}</h3>
                            <p className="text-green-100/80 leading-relaxed text-lg">
                                {t('about.mission.desc')}
                            </p>
                        </div>
                    </div>

                    {/* Vision */}
                    <div className="bg-white border border-orange-100 p-10 md:p-14 rounded-3xl relative overflow-hidden shadow-xl shadow-orange-900/5 group" data-aos="fade-left">
                        <div className="absolute bottom-0 left-0 p-20 bg-orange-100 rounded-full blur-3xl opacity-40 -ml-10 -mb-10 transition-opacity duration-500 group-hover:opacity-60"></div>

                        <div className="relative z-10">
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center mb-6 text-orange-600">
                                <i className="ph ph-eye text-2xl"></i>
                            </div>
                            <h3 className="text-3xl font-serif font-bold text-forest-900 mb-4">{t('about.vision.title')}</h3>
                            <p className="text-slate-600 leading-relaxed text-lg">
                                {t('about.vision.desc')}
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            {/* ========================================== */}
            {/* STRATEGIC PILLARS (Replaces Team Section) */}
            {/* ========================================== */}
            <section className="max-w-7xl mx-auto px-6 py-24 relative z-10">
                <div className="text-center mb-16" data-aos="fade-up">
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest-900">{t('about.pillars.title')}</h2>
                    <p className="text-slate-500 mt-2">{t('about.pillars.subtitle')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Pillar 1 */}
                    <div className="bg-white p-8 rounded-2xl border-t-4 border-green-600 shadow-lg shadow-slate-200/50" data-aos="fade-up" data-aos-delay="0">
                        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-700">
                            <i className="ph ph-brain text-3xl"></i>
                        </div>
                        <h3 className="text-xl font-bold text-forest-900 mb-3">{t('about.pillars.p1.title')}</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {t('about.pillars.p1.desc')}
                        </p>
                    </div>

                    {/* Pillar 2 */}
                    <div className="bg-white p-8 rounded-2xl border-t-4 border-orange-500 shadow-lg shadow-slate-200/50" data-aos="fade-up" data-aos-delay="100">
                        <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mb-6 text-orange-600">
                            <i className="ph ph-warehouse text-3xl"></i>
                        </div>
                        <h3 className="text-xl font-bold text-forest-900 mb-3">{t('about.pillars.p2.title')}</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {t('about.pillars.p2.desc')}
                        </p>
                    </div>

                    {/* Pillar 3 */}
                    <div className="bg-white p-8 rounded-2xl border-t-4 border-blue-500 shadow-lg shadow-slate-200/50" data-aos="fade-up" data-aos-delay="200">
                        <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-6 text-blue-600">
                            <i className="ph ph-chart-line-up text-3xl"></i>
                        </div>
                        <h3 className="text-xl font-bold text-forest-900 mb-3">{t('about.pillars.p3.title')}</h3>
                        <p className="text-slate-600 leading-relaxed">
                            {t('about.pillars.p3.desc')}
                        </p>
                    </div>
                </div>
            </section>

            {/* ========================================== */}
            {/* VALUES SECTION */}
            {/* ========================================== */}
            <section className="max-w-7xl mx-auto px-6 pb-24 relative z-10">
                <div className="text-center mb-16" data-aos="fade-up">
                    <span className="text-green-600 font-semibold tracking-wide text-sm">{t('about.values.badge')}</span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest-900 mt-2">{t('about.values.title')}</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-green-200 transition-colors duration-300" data-aos="fade-up" data-aos-delay="0">
                        <i className="ph ph-trend-up text-4xl text-green-600 mb-4"></i>
                        <h4 className="font-bold text-lg text-forest-900 mb-2">{t('about.values.v1.title')}</h4>
                        <p className="text-sm text-slate-500">{t('about.values.v1.desc')}</p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-green-200 transition-colors duration-300" data-aos="fade-up" data-aos-delay="100">
                        <i className="ph ph-hand-heart text-4xl text-green-600 mb-4"></i>
                        <h4 className="font-bold text-lg text-forest-900 mb-2">{t('about.values.v2.title')}</h4>
                        <p className="text-sm text-slate-500">{t('about.values.v2.desc')}</p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-green-200 transition-colors duration-300" data-aos="fade-up" data-aos-delay="200">
                        <i className="ph ph-users-three text-4xl text-green-600 mb-4"></i>
                        <h4 className="font-bold text-lg text-forest-900 mb-2">{t('about.values.v3.title')}</h4>
                        <p className="text-sm text-slate-500">{t('about.values.v3.desc')}</p>
                    </div>

                    <div className="bg-white p-8 rounded-2xl border border-slate-100 hover:border-green-200 transition-colors duration-300" data-aos="fade-up" data-aos-delay="300">
                        <i className="ph ph-leaf text-4xl text-green-600 mb-4"></i>
                        <h4 className="font-bold text-lg text-forest-900 mb-2">{t('about.values.v4.title')}</h4>
                        <p className="text-sm text-slate-500">{t('about.values.v4.desc')}</p>
                    </div>
                </div>
            </section>

            {/* ========================================== */}
            {/* TIMELINE (JOURNEY) */}
            {/* ========================================== */}
            <section className="max-w-5xl mx-auto px-6 py-20 relative border-t border-slate-200 z-10">
                <div className="text-center mb-20" data-aos="fade-up">
                    <span className="bg-green-100 text-green-800 py-1 px-3 rounded-full text-xs font-bold uppercase">{t('about.journey.badge')}</span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-forest-900 mt-4">{t('about.journey.title')}</h2>
                </div>

                <div className="timeline-line relative">

                    {/* Item 1 (Left) */}
                    <div className="relative z-10 mb-16 md:w-1/2 md:pr-12 md:text-right md:ml-0 ml-12" data-aos="fade-right">
                        <div className="absolute top-2 -right-[57px] w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-md hidden md:block"></div>
                        <div className="absolute top-2 -left-[29px] w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-md md:hidden"></div>

                        <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded mb-2">{t('about.journey.i1.year')}</span>
                        <h3 className="text-xl font-bold text-forest-900">{t('about.journey.i1.title')}</h3>
                        <p className="text-slate-500 text-sm mt-2">{t('about.journey.i1.desc')}</p>
                    </div>

                    {/* Item 2 (Right) */}
                    <div className="relative z-10 mb-16 md:w-1/2 md:pl-12 md:ml-auto ml-12" data-aos="fade-left">
                        <div className="absolute top-2 -left-[58px] w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-md hidden md:block"></div>
                        <div className="absolute top-2 -left-[29px] w-4 h-4 bg-green-500 rounded-full border-4 border-white shadow-md md:hidden"></div>

                        <span className="inline-block bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded mb-2">{t('about.journey.i2.year')}</span>
                        <h3 className="text-xl font-bold text-forest-900">{t('about.journey.i2.title')}</h3>
                        <p className="text-slate-500 text-sm mt-2">{t('about.journey.i2.desc')}</p>
                    </div>

                    {/* Item 3 (Left) */}
                    <div className="relative z-10 mb-16 md:w-1/2 md:pr-12 md:text-right md:ml-0 ml-12" data-aos="fade-right">
                        <div className="absolute top-2 -right-[57px] w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-md hidden md:block"></div>
                        <div className="absolute top-2 -left-[29px] w-4 h-4 bg-orange-500 rounded-full border-4 border-white shadow-md md:hidden"></div>

                        <span className="inline-block bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded mb-2">{t('about.journey.i3.year')}</span>
                        <h3 className="text-xl font-bold text-forest-900">{t('about.journey.i3.title')}</h3>
                        <p className="text-slate-500 text-sm mt-2">{t('about.journey.i3.desc')}</p>
                    </div>

                    {/* Item 4 (Right) */}
                    <div className="relative z-10 mb-16 md:w-1/2 md:pl-12 md:ml-auto ml-12" data-aos="fade-left">
                        <div className="absolute top-2 -left-[58px] w-4 h-4 bg-slate-400 rounded-full border-4 border-white shadow-md hidden md:block"></div>
                        <div className="absolute top-2 -left-[29px] w-4 h-4 bg-slate-400 rounded-full border-4 border-white shadow-md md:hidden"></div>

                        <span className="inline-block bg-slate-200 text-slate-700 text-xs font-bold px-2 py-1 rounded mb-2">{t('about.journey.i4.year')}</span>
                        <h3 className="text-xl font-bold text-forest-900">{t('about.journey.i4.title')}</h3>
                        <p className="text-slate-500 text-sm mt-2">{t('about.journey.i4.desc')}</p>
                    </div>

                </div>
            </section>
        </div>
    );
};

export default AboutPage;
