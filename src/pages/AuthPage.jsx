import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { motion } from 'framer-motion';
import { Camera, Upload, MapPin, X } from 'lucide-react';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Form States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [location, setLocation] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [showCamera, setShowCamera] = useState(false);

    const videoRef = useRef(null);
    const fileInputRef = useRef(null);

    const { login, signup } = useAuth();
    const { language, toggleLanguage, t } = useLanguage();
    const navigate = useNavigate();

    const startCamera = async () => {
        try {
            setShowCamera(true);
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Camera error:", err);
            setError(t('auth.error.camera'));
            setShowCamera(false);
        }
    };

    const capturePhoto = () => {
        if (videoRef.current) {
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

            canvas.toBlob((blob) => {
                const file = new File([blob], "profile_capture.jpg", { type: "image/jpeg" });
                setImageFile(file);
                setImagePreview(URL.createObjectURL(blob));
                stopCamera();
            }, 'image/jpeg');
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }
        setShowCamera(false);
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Safety timeout
        const timeout = setTimeout(() => {
            setLoading(false);
            setError(t('auth.error.timeout'));
        }, 30000); // Increased timeout for image upload

        try {
            console.log("Attempting authentication...");
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password, name, phone, language, location, imageFile);
            }
            clearTimeout(timeout);
            console.log("Authentication successful, navigating...");
            navigate('/harvest');
        } catch (err) {
            clearTimeout(timeout);
            console.error("Auth Error:", err);
            if (err.code === 'auth/email-already-in-use') {
                setError(t('auth.error.exists'));
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-farm-cream font-inter flex flex-col">
            <main className="flex-grow flex items-center justify-center p-4 pt-24">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md my-8 border border-gray-100"
                >
                    <h2 className="text-3xl font-playfair font-bold text-farm-dark mb-6 text-center">
                        {isLogin ? t('auth.welcomeBack') : t('auth.joinFarmix')}
                    </h2>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <>
                                {/* Profile Picture Section */}
                                <div className="flex flex-col items-center mb-4">
                                    <div className="relative w-24 h-24 bg-gray-50 rounded-full overflow-hidden mb-3 border-2 border-farm-lime">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                <Upload size={32} />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleFileSelect}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current.click()}
                                            className="px-3 py-1.5 bg-gray-100 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-1"
                                        >
                                            <Upload size={14} /> {t('auth.upload')}
                                        </button>
                                        <button
                                            type="button"
                                            onClick={startCamera}
                                            className="px-3 py-1.5 bg-farm-lime/20 text-farm-dark text-xs font-medium rounded-lg hover:bg-farm-lime/30 transition-colors flex items-center gap-1"
                                        >
                                            <Camera size={14} /> {t('auth.camera')}
                                        </button>
                                    </div>

                                    {/* Camera Modal */}
                                    {showCamera && (
                                        <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4">
                                            <div className="relative w-full max-w-sm aspect-[3/4] bg-black rounded-2xl overflow-hidden mb-4">
                                                <video
                                                    ref={videoRef}
                                                    autoPlay
                                                    playsInline
                                                    className="w-full h-full object-cover"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={stopCamera}
                                                    className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full"
                                                >
                                                    <X size={24} />
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={capturePhoto}
                                                className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center"
                                            >
                                                <div className="w-12 h-12 bg-farm-lime rounded-full"></div>
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.fullName')}</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-farm-lime outline-none"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.phone')}</label>
                                    <input
                                        type="tel"
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-farm-lime outline-none"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.location')}</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder={t('auth.locationPlaceholder')}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-farm-lime outline-none pl-10"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                        />
                                        <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>

                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.preferredLanguage')}</label>
                                    <div className="flex bg-gray-100 p-1 rounded-xl">
                                        <button
                                            type="button"
                                            onClick={() => language !== 'bn' && toggleLanguage()}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${language === 'bn' ? 'bg-white shadow-sm text-farm-dark' : 'text-gray-500'}`}
                                        >
                                            বাংলা (BN)
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => language !== 'en' && toggleLanguage()}
                                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${language === 'en' ? 'bg-white shadow-sm text-farm-dark' : 'text-gray-500'}`}
                                        >
                                            English (EN)
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.email')}</label>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-farm-lime outline-none"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('auth.password')}</label>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-farm-lime outline-none"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-farm-lime text-farm-dark py-3 rounded-xl font-bold hover:bg-opacity-80 transition-colors disabled:opacity-50 shadow-lg hover:shadow-farm-lime/20"
                        >
                            {loading ? t('auth.processing') : (isLogin ? t('auth.login') : t('auth.register'))}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-farm-dark font-medium hover:underline"
                        >
                            {isLogin ? t('auth.noAccount') : t('auth.hasAccount')}
                        </button>
                    </div>
                </motion.div>
            </main>
        </div >
    );
};

export default AuthPage;
