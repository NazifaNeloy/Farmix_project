import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, RefreshCw, ArrowLeft, AlertTriangle, CheckCircle, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { identifyPest } from '../services/geminiService';

const ScannerPage = () => {
    const { t } = useLanguage();
    // const { loading: modelLoading, error: modelError, predict } = useTeachableMachine(); // Removed TM hook
    const [image, setImage] = useState(null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState(null);
    const [cameraActive, setCameraActive] = useState(false);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);

    // Start Camera
    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setCameraActive(true);
                setResult(null);
                setImage(null);
            }
        } catch (err) {
            console.error("Camera access denied:", err);
            alert("Could not access camera. Please upload a photo instead.");
        }
    };

    // Stop Camera
    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
            setCameraActive(false);
        }
    };

    // Capture from Camera
    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageUrl = canvas.toDataURL('image/jpeg');
            setImage(imageUrl);
            stopCamera();
            analyzeImage(canvas); // Pass canvas directly
        }
    };

    // Handle File Upload
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    setImage(event.target.result);
                    setResult(null);
                    analyzeImage(img, file.name); // Pass filename
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    // Analyze Logic
    const analyzeImage = async (imageElement, filename = "camera_capture.jpg") => {
        setAnalyzing(true);
        try {
            // Convert imageElement to Base64 if it's a canvas or image tag
            let base64Image = image;

            // If passed a canvas directly (from camera capture)
            if (imageElement instanceof HTMLCanvasElement) {
                base64Image = imageElement.toDataURL('image/jpeg');
            }
            // If passed an Image element (from file upload), we need to draw to canvas to get base64
            else if (imageElement instanceof HTMLImageElement) {
                const canvas = document.createElement('canvas');
                canvas.width = imageElement.naturalWidth;
                canvas.height = imageElement.naturalHeight;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(imageElement, 0, 0);
                base64Image = canvas.toDataURL('image/jpeg');
            }

            const prediction = await identifyPest(base64Image, filename);
            setResult(prediction);
        } catch (err) {
            console.error("Analysis failed:", err);
            alert("Analysis failed. Please try again.");
        } finally {
            setAnalyzing(false);
        }
    };

    useEffect(() => {
        return () => stopCamera(); // Cleanup on unmount
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 font-inter text-gray-900">
            <main className="container mx-auto px-4 py-8 pt-24 max-w-md">
                <div className="mb-6 flex items-center gap-4">
                    <Link to="/harvest" className="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors shadow-sm border border-gray-200">
                        <ArrowLeft size={20} className="text-gray-600" />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-900">{t('scanner.title')}</h1>
                </div>

                {/* Main Scanner Area */}
                <div className="relative bg-white rounded-3xl overflow-hidden aspect-[3/4] shadow-xl border border-gray-200 mb-6">
                    {/* Loading State - Removed modelLoading check as we use API now */}

                    {/* Camera View */}
                    {cameraActive && (
                        <>
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            {/* Laser Scan Animation */}
                            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                                <div className="w-full h-1 bg-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.8)] animate-[scan_2s_linear_infinite]"></div>
                            </div>
                            <button
                                onClick={captureImage}
                                className="absolute bottom-6 left-1/2 -translate-x-1/2 w-16 h-16 bg-white rounded-full border-4 border-gray-300 shadow-lg active:scale-95 transition-transform"
                            ></button>
                        </>
                    )}

                    {/* Image Preview */}
                    {!cameraActive && image && (
                        <img src={image} alt="Scan" className="w-full h-full object-cover" />
                    )}

                    {/* Placeholder / Start State */}
                    {!cameraActive && !image && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                            <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
                                <Camera size={40} className="text-gray-400" />
                            </div>
                            <p className="text-gray-500 mb-6">{t('scanner.placeholder.text')}</p>
                            <button
                                onClick={startCamera}
                                className="w-full py-3 bg-farm-lime text-farm-dark font-bold rounded-xl mb-3 hover:bg-lime-400 transition-colors shadow-lg shadow-farm-lime/20"
                            >
                                {t('scanner.placeholder.camera')}
                            </button>
                            <button
                                onClick={() => fileInputRef.current.click()}
                                className="w-full py-3 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <Upload size={18} /> {t('scanner.placeholder.upload')}
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                className="hidden"
                                accept="image/*"
                                onChange={handleFileUpload}
                            />
                        </div>
                    )}

                    {/* Analyzing Overlay */}
                    {analyzing && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-40">
                            <div className="w-16 h-16 border-4 border-farm-lime border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-800 font-bold text-lg">{t('scanner.analyzing')}</p>
                        </div>
                    )}
                </div>

                {/* Result Card */}
                {result && (
                    <div className={`rounded-2xl p-6 border animate-in slide-in-from-bottom-4 fade-in duration-500 ${result.status === 'CRITICAL' ? 'bg-red-50 border-red-100' :
                        result.status === 'SAFE' ? 'bg-emerald-50 border-emerald-100' :
                            'bg-white border-gray-100 shadow-sm'
                        }`}>
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-full shrink-0 ${result.status === 'CRITICAL' ? 'bg-red-100 text-red-600' :
                                result.status === 'SAFE' ? 'bg-emerald-100 text-emerald-600' :
                                    'bg-gray-100 text-gray-600'
                                }`}>
                                {result.status === 'CRITICAL' && <AlertTriangle size={32} />}
                                {result.status === 'SAFE' && <CheckCircle size={32} />}
                                {result.status === 'UNCERTAIN' && <HelpCircle size={32} />}
                            </div>
                            <div>
                                <h3 className={`text-xl font-bold mb-1 ${result.status === 'CRITICAL' ? 'text-red-700' :
                                    result.status === 'SAFE' ? 'text-emerald-700' :
                                        'text-gray-900'
                                    }`}>
                                    {result.pestName || (result.status === 'CRITICAL' ? t('scanner.result.rotten') :
                                        result.status === 'SAFE' ? t('scanner.result.fresh') : t('scanner.result.uncertain'))}
                                </h3>
                                <p className="text-gray-600 text-sm mb-3 leading-relaxed">{result.message}</p>
                                <div className="text-xs font-mono text-gray-400">
                                    {t('scanner.result.confidence')}: {(result.probability * 100).toFixed(1)}%
                                </div>
                            </div>
                        </div>

                        <div className="mt-4 flex gap-3">
                            <button
                                onClick={() => { setImage(null); setResult(null); startCamera(); }}
                                className="flex-1 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-colors shadow-sm"
                            >
                                {t('scanner.result.scanAgain')}
                            </button>
                            <button
                                onClick={() => { setImage(null); setResult(null); fileInputRef.current.click(); }}
                                className="flex-1 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold transition-colors shadow-sm flex items-center justify-center gap-2"
                            >
                                <Upload size={18} /> {t('scanner.placeholder.upload')}
                            </button>
                        </div>
                    </div>
                )}

                {/* Hidden Canvas for processing */}
                <canvas ref={canvasRef} className="hidden"></canvas>

            </main>
        </div>
    );
};

export default ScannerPage;
