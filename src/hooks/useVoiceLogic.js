import { useState, useEffect, useRef } from 'react';
import { useBatch } from '../context/BatchContext';
import { useAuth } from '../context/AuthContext';
import { useWeatherForecast } from './useWeatherForecast';

export const useVoiceLogic = () => {
    const { userData } = useAuth();
    const { batches } = useBatch();

    // Get location for weather
    const location = userData?.location?.split(',')[0] || 'Dhaka';
    const { weatherData } = useWeatherForecast(location);

    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [response, setResponse] = useState('');
    const [isVoiceSupported, setIsVoiceSupported] = useState(true);

    const recognitionRef = useRef(null);

    // Initialize Speech Recognition
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.lang = 'bn-BD'; // Bangla, Bangladesh
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => setIsListening(true);
            recognition.onend = () => setIsListening(false);

            recognition.onresult = (event) => {
                const text = event.results[0][0].transcript;
                setTranscript(text);
                processCommand(text);
            };

            recognition.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsListening(false);
                if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
                    setIsVoiceSupported(false);
                }
            };

            recognitionRef.current = recognition;
        } else {
            setIsVoiceSupported(false);
        }
    }, [weatherData, batches]); // Re-init if data changes (though logic is in processCommand)

    // Text-to-Speech
    const speakBangla = (text) => {
        if (!text) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);

        // Try to find a Bangla voice
        const voices = window.speechSynthesis.getVoices();
        const banglaVoice = voices.find(v => v.lang.includes('bn'));
        if (banglaVoice) utterance.voice = banglaVoice;

        utterance.lang = 'bn-BD';
        utterance.rate = 1.0;
        utterance.pitch = 1.0;

        window.speechSynthesis.speak(utterance);
    };

    // Fuzzy Matching & Logic Engine
    const processCommand = (text) => {
        const lowerText = text.toLowerCase();
        let reply = "দুঃখিত, আমি বুঝতে পারিনি। আবার বলুন।"; // Default fallback

        // 0. Greetings
        if (checkKeywords(lowerText, ['hello', 'hi', 'hey', 'kemon acho', 'kemon aso', 'ki khobor', 'salam', 'assalamu alaikum'])) {
            reply = "আমি ভালো আছি। আপনি কেমন আছেন? আমি আপনাকে আবহাওয়া, ফসলের অবস্থা এবং গুদামজাতকরণ নিয়ে সাহায্য করতে পারি।";
        }

        // 1. Weather
        // Added 'আবহাওয়া' (User spelling) and 'আজকে'
        else if (checkKeywords(lowerText, ['আবহাওয়া', 'আবহাওয়া', 'বৃষ্টি', 'রোদ', 'গরম', 'weather', 'temperature', 'bristi', 'rod', 'gorom', 'kemon', 'ajker', 'temp', 'আজকে', 'আজকের'])) {
            if (weatherData?.current) {
                const temp = Math.round(weatherData.current.temp);
                const weatherDesc = weatherData.current.weather === 'Rain' ? 'বৃষ্টি হতে পারে' : 'রৌদ্রোজ্জ্বল';
                reply = `আজকের আবহাওয়া ${weatherDesc}, তাপমাত্রা ${temp} ডিগ্রি।`;
            } else {
                reply = "দুঃখিত, আবহাওয়ার তথ্য এখন পাওয়া যাচ্ছে না।";
            }
        }

        // 2. Crop Status
        // Added 'ধানে', 'ধানের'
        else if (checkKeywords(lowerText, ['ধান', 'ধানে', 'ধানের', 'অবস্থা', 'রোগ', 'পোকা', 'status', 'crop', 'dhan', 'obostha', 'rog', 'poka', 'condition'])) {
            if (batches.length > 0) {
                const latestBatch = batches[0];
                const crop = latestBatch.cropType || latestBatch.crop || 'ফসল';
                // Simple logic: if active, it's growing
                reply = `আপনার ${crop} এখন পুষ্ট হচ্ছে। নিয়মিত পর্যবেক্ষণ করুন।`;
            } else {
                reply = "আপনার কোনো সক্রিয় ব্যাচ নেই।";
            }
        }

        // 3. Harvest Time
        // Added 'কাটব', 'কাটার'
        else if (checkKeywords(lowerText, ['কবে কাটব', 'কাটব', 'কাটার সময়', 'কাটার', 'পেকেছে', 'harvest', 'cut', 'kobe', 'katbo', 'somoy', 'date'])) {
            if (batches.length > 0) {
                const latestBatch = batches[0];
                if (latestBatch.harvestDate) {
                    // Calculate days remaining
                    const today = new Date();
                    const harvest = new Date(latestBatch.harvestDate);
                    const diffTime = Math.abs(harvest - today);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                    reply = `আর মাত্র ${diffDays} দিন পর কাটতে পারবেন।`;
                } else {
                    reply = "কাটার সময় এখনো নির্ধারিত হয়নি।";
                }
            } else {
                reply = "আপনার কোনো সক্রিয় ব্যাচ নেই।";
            }
        }

        // 4. Storage
        // Added 'গুদামে'
        else if (checkKeywords(lowerText, ['গুদাম', 'গুদামে', 'রাখব', 'স্টোর', 'আর্দ্রতা', 'storage', 'gudam', 'rakhbo', 'store'])) {
            reply = "গুদামে আর্দ্রতা পরীক্ষা করুন এবং শুকনো জায়গায় রাখুন। মাঝে মাঝে বাতাস চলাচলের ব্যবস্থা করুন।";
        }

        setResponse(reply);
        speakBangla(reply);
    };

    // Helper for fuzzy matching (simple includes for now)
    const checkKeywords = (text, keywords) => {
        return keywords.some(keyword => text.includes(keyword));
    };

    const startListening = () => {
        if (recognitionRef.current && !isListening) {
            try {
                recognitionRef.current.start();
            } catch (e) {
                console.error("Start error:", e);
            }
        }
    };

    const stopListening = () => {
        if (recognitionRef.current && isListening) {
            recognitionRef.current.stop();
        }
    };

    return {
        isListening,
        transcript,
        response,
        isVoiceSupported,
        startListening,
        stopListening,
        processCommand // Exported for text fallback
    };
};
