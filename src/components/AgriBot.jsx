import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, MessageSquare, Play, ExternalLink, Loader } from 'lucide-react';
import { sendMessageToGemini } from '../services/geminiService';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';

const AgriBot = () => {
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const messagesEndRef = useRef(null);

    // Initialize messages with translated initial message
    useEffect(() => {
        setMessages([
            { type: 'bot', text: t('agribot.initialMessage'), speech: null }
        ]);
    }, [language, t]);

    // if (!user) return null; // Removed to prevent hook violation

    // Speech Recognition Setup
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = SpeechRecognition ? new SpeechRecognition() : null;

    if (recognition) {
        recognition.continuous = false;
        recognition.lang = language === 'bn' ? 'bn-BD' : 'en-US';
        recognition.interimResults = false;
    }

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleMicClick = () => {
        if (!recognition) {
            alert(t('agribot.voiceNotSupported'));
            return;
        }

        if (isListening) {
            recognition.stop();
            setIsListening(false);
        } else {
            recognition.start();
            setIsListening(true);
        }
    };

    if (recognition) {
        recognition.onresult = async (event) => {
            const text = event.results[0][0].transcript;
            setIsListening(false);
            await handleUserMessage(text);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };
    }

    const handleUserMessage = async (text) => {
        setMessages(prev => [...prev, { type: 'user', text }]);
        setIsProcessing(true);

        const response = await sendMessageToGemini(text);

        setMessages(prev => [...prev, {
            type: 'bot',
            text: response.text,
            videoQuery: response.videoQuery
        }]);

        setIsProcessing(false);
        speak(response.speech);
    };

    const speak = (text) => {
        if (!text) return;
        const utterance = new SpeechSynthesisUtterance(text);
        // Try to detect language roughly
        utterance.lang = /[অ-ঔক-হ]/.test(text) ? 'bn-BD' : 'en-US';
        window.speechSynthesis.speak(utterance);
    };

    if (!user) return null;

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-xl z-50 transition-all ${isOpen ? 'bg-red-500 rotate-45' : 'bg-farm-green-600 hover:bg-farm-green-700'
                    } text-white`}
            >
                {isOpen ? <X size={24} /> : <Mic size={24} />}
            </button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.9 }}
                        className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden flex flex-col max-h-[600px]"
                    >
                        {/* Header */}
                        <div className="bg-farm-green-600 p-4 text-white flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-full">
                                <MessageSquare size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold">{t('agribot.title')}</h3>
                                <p className="text-xs text-farm-green-100">{t('agribot.subtitle')}</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.type === 'user'
                                            ? 'bg-farm-green-600 text-white rounded-tr-none'
                                            : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                                            }`}
                                    >
                                        <p>{msg.text}</p>

                                        {/* Video Recommendation */}
                                        {msg.videoQuery && (
                                            <a
                                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(msg.videoQuery)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-3 block bg-red-50 hover:bg-red-100 border border-red-100 rounded-xl p-2 transition-colors group"
                                            >
                                                <div className="flex items-center gap-2 text-red-600 font-bold text-xs mb-1">
                                                    <Play size={12} className="fill-current" />
                                                    {t('agribot.watchTutorial')}
                                                </div>
                                                <div className="text-xs text-gray-600 flex items-center justify-between">
                                                    <span>{t('agribot.clickToView')}</span>
                                                    <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </div>
                                            </a>
                                        )}
                                    </div>
                                </div>
                            ))}
                            {isProcessing && (
                                <div className="flex justify-start">
                                    <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-gray-100">
                                        <Loader className="animate-spin text-farm-green-600" size={20} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <button
                                onClick={handleMicClick}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isListening
                                    ? 'bg-red-50 text-red-600 animate-pulse border border-red-200'
                                    : 'bg-farm-green-50 text-farm-green-700 hover:bg-farm-green-100 border border-farm-green-200'
                                    }`}
                            >
                                <Mic size={20} className={isListening ? 'animate-bounce' : ''} />
                                {isListening ? t('agribot.listening') : t('agribot.tapToSpeak')}
                            </button>
                            <p className="text-center text-[10px] text-gray-400 mt-2">
                                {t('agribot.supports')}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AgriBot;
