import React, { useEffect, useRef, useState } from 'react';
import { useImageClassifier } from '../hooks/useImageClassifier';
import { Camera, AlertTriangle, CheckCircle, Loader, Save } from 'lucide-react';
import { useBatch } from '../context/BatchContext';

const Scanner = () => {
    const videoRef = useRef(null);
    const imageRef = useRef(null);
    const fileInputRef = useRef(null);
    const { model, predict, loading, error } = useImageClassifier();
    const { addScan } = useBatch();
    const [predictions, setPredictions] = useState([]);
    const [alert, setAlert] = useState(null); // 'rotten' | 'fresh' | null
    const [isScanning, setIsScanning] = useState(false);
    const [imageURL, setImageURL] = useState(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!imageURL) {
            startCamera();
        }
        return () => stopCamera();
    }, [imageURL]);

    useEffect(() => {
        let interval;
        if (model && (isScanning || imageURL)) {
            const predictImage = async () => {
                const element = imageURL ? imageRef.current : videoRef.current;
                if (element && (imageURL || element.readyState === 4)) {
                    try {
                        const prediction = await predict(element);
                        setPredictions(prediction);
                        analyzePrediction(prediction);
                    } catch (e) {
                        console.error("Prediction error:", e);
                    }
                }
            };

            if (imageURL) {
                // Predict once for image when loaded
                if (imageRef.current) {
                    imageRef.current.onload = predictImage;
                    // Also try immediately in case it's already loaded
                    if (imageRef.current.complete) predictImage();
                }
            } else {
                // Loop for video
                interval = setInterval(predictImage, 500);
            }
        }
        return () => clearInterval(interval);
    }, [model, isScanning, imageURL]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                setIsScanning(true);
            }
        } catch (err) {
            console.error("Camera error:", err);
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            setIsScanning(false);
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImageURL(url);
            stopCamera();
            setSaved(false);
        }
    };

    const clearImage = () => {
        if (imageURL) {
            URL.revokeObjectURL(imageURL);
            setImageURL(null);
            setPredictions([]);
            setAlert(null);
            setSaved(false);
        }
    };

    const analyzePrediction = (prediction) => {
        // Assuming classes are "Rotten" and "Fresh" based on Teachable Machine standard
        const rotten = prediction.find(p => p.className.toLowerCase().includes('rotten'));
        const fresh = prediction.find(p => p.className.toLowerCase().includes('fresh'));

        if (rotten && rotten.probability > 0.8) {
            setAlert('rotten');
        } else if (fresh && fresh.probability > 0.8) {
            setAlert('fresh');
        } else {
            setAlert(null);
        }
    };

    const handleSave = async () => {
        if (!alert || saved) return;
        setSaving(true);
        try {
            await addScan({
                result: alert,
                confidence: predictions.find(p => p.className.toLowerCase().includes(alert))?.probability || 0,
                image: imageURL || 'camera-capture', // In a real app, we'd upload this to Storage
                timestamp: new Date().toISOString()
            });
            setSaved(true);
        } catch (err) {
            console.error("Failed to save scan", err);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-md mx-auto">
            <div className="relative w-full aspect-square bg-black rounded-2xl overflow-hidden shadow-lg mb-6">
                {!imageURL ? (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <img
                        ref={imageRef}
                        src={imageURL}
                        alt="Uploaded crop"
                        className="w-full h-full object-contain bg-gray-900"
                    />
                )}

                {/* Loading / Error Overlays */}
                {loading && (
                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white z-20">
                        <Loader className="animate-spin mb-2" size={32} />
                        <p className="text-sm font-medium">Loading AI Model...</p>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 bg-red-900/80 flex flex-col items-center justify-center text-white p-4 text-center z-20">
                        <AlertTriangle className="mb-2" size={32} />
                        <p className="font-bold">Model Failed to Load</p>
                        <p className="text-xs mt-1 opacity-80">Check your connection</p>
                    </div>
                )}

                {/* Overlay Badges (Only show if model is ready) */}
                {!loading && !error && alert === 'rotten' && (
                    <div className="absolute inset-0 bg-red-500/30 flex items-center justify-center animate-pulse z-10">
                        <div className="bg-white p-4 rounded-xl shadow-xl flex flex-col items-center text-red-600">
                            <AlertTriangle size={48} className="mb-2" />
                            <h2 className="text-xl font-bold">High Moisture/Mold!</h2>
                            <p className="text-sm text-gray-600">Action: Dry Immediately</p>
                        </div>
                    </div>
                )}

                {!loading && !error && alert === 'fresh' && (
                    <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 shadow-lg z-10">
                        <CheckCircle size={20} />
                        <span className="font-bold">Healthy Crop</span>
                    </div>
                )}
            </div>

            {/* Controls - Always Visible */}
            <div className="flex gap-4 mb-6 w-full">
                <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                />
                {!imageURL ? (
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="flex-1 bg-farm-green-500 text-white py-3 rounded-xl font-bold shadow-md hover:bg-farm-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                        <Camera size={20} /> Upload Image
                    </button>
                ) : (
                    <>
                        <button
                            onClick={clearImage}
                            className="flex-1 bg-gray-600 text-white py-3 rounded-xl font-bold shadow-md hover:bg-gray-700 transition-colors"
                        >
                            Retake
                        </button>
                        {alert && (
                            <button
                                onClick={handleSave}
                                disabled={saving || saved}
                                className={`flex-1 py-3 rounded-xl font-bold shadow-md transition-colors flex items-center justify-center gap-2 ${saved
                                        ? 'bg-green-600 text-white'
                                        : 'bg-farm-green-500 text-white hover:bg-farm-green-700'
                                    }`}
                            >
                                {saved ? (
                                    <>
                                        <CheckCircle size={20} /> Saved
                                    </>
                                ) : (
                                    <>
                                        {saving ? <Loader className="animate-spin" size={20} /> : <Save size={20} />}
                                        Save Result
                                    </>
                                )}
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Debug/Stats View */}
            <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-sm font-bold text-gray-500 mb-3 uppercase tracking-wider">Live Analysis</h3>
                {loading ? (
                    <div className="text-center py-4 text-gray-400 text-sm">Initializing AI Model...</div>
                ) : error ? (
                    <div className="text-center py-4 text-red-400 text-sm">Analysis Unavailable</div>
                ) : (
                    <div className="space-y-2">
                        {predictions.map((p, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-24 text-sm font-medium truncate">{p.className}</div>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${p.className.toLowerCase().includes('rotten') ? 'bg-red-500' : 'bg-green-500'}`}
                                        style={{ width: `${p.probability * 100}%` }}
                                    />
                                </div>
                                <div className="w-12 text-xs text-gray-500 text-right">{(p.probability * 100).toFixed(0)}%</div>
                            </div>
                        ))}
                        {predictions.length === 0 && (
                            <div className="text-center py-2 text-gray-400 text-xs">No predictions yet</div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Scanner;
