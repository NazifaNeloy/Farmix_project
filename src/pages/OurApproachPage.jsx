import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useLanguage } from '../context/LanguageContext';

const OurApproachPage = () => {
    const { t } = useLanguage();

    useEffect(() => {
        AOS.init({ duration: 800, once: true, offset: 50 });
    }, []);

    return (
        <div className="bg-white min-h-screen overflow-x-hidden text-slate-800 font-sans">
            <section className="max-w-7xl mx-auto px-6 pt-32 pb-24 relative z-10">
                <div className="text-center mb-16" data-aos="fade-up">

                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-slate-900 mb-6 leading-tight">
                        {t('approach.hero.title')}<br />

                    </h2>
                    <p className="max-w-3xl mx-auto text-lg text-slate-600 leading-relaxed font-light">
                        {t('approach.hero.desc')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-8">
                        <div className="flex gap-6 items-start" data-aos="fade-right" data-aos-delay="0">
                            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0 text-blue-600">
                                <i className="ph ph-cpu text-3xl"></i>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{t('approach.grid.i1.title')}</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {t('approach.grid.i1.desc')}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start" data-aos="fade-right" data-aos-delay="100">
                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center shrink-0 text-green-600">
                                <i className="ph ph-plant text-3xl"></i>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{t('approach.grid.i2.title')}</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {t('approach.grid.i2.desc')}
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start" data-aos="fade-right" data-aos-delay="200">
                            <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0 text-orange-600">
                                <i className="ph ph-users-three text-3xl"></i>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">{t('approach.grid.i3.title')}</h3>
                                <p className="text-slate-600 leading-relaxed">
                                    {t('approach.grid.i3.desc')}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl group" data-aos="fade-left">
                        <img
                            src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=2070&auto=format&fit=crop"
                            alt="Smart Farming"
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute bottom-0 left-0 p-8 text-white">
                            <div className="bg-white/20 backdrop-blur-md p-4 rounded-xl inline-block mb-4 border border-white/30">
                                <i className="ph ph-chart-line-up text-3xl text-green-400"></i>
                            </div>
                            <h3 className="text-2xl font-bold mb-2">{t('approach.image.title')}</h3>
                            <p className="text-slate-300">
                                {t('approach.image.desc')}
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default OurApproachPage;
