import React, { useState, useEffect, useRef } from 'react';
import { Mic, X, MessageSquare, Send, Keyboard } from 'lucide-react';
import { useVoiceLogic } from '../hooks/useVoiceLogic';
import { AnimatePresence, motion } from 'framer-motion';

const VoiceAssistant = () => {
    const {
        isListening,
        transcript,
        response,
        isVoiceSupported,
        startListening,
        stopListening,
        processCommand
    } = useVoiceLogic();

    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [showKeyboard, setShowKeyboard] = useState(false);
    const [inputText, setInputText] = useState('');
    const messagesEndRef = useRef(null);

    // Sync hook state with UI messages
    useEffect(() => {
        if (transcript && !isListening) {
            // Avoid duplicates if possible, or just append
            // For simplicity, we rely on the hook's transcript update
            // But we need to know when a *new* transcript is ready.
            // A better way: The hook could return a "history" or we manage history here.
            // Let's manage history here by watching transcript/response changes.
        }
    }, [transcript, isListening]);

    // Watch for new responses from the hook
    useEffect(() => {
        if (response) {
            setMessages(prev => {
                // Check if the last message was already this response to avoid dupes
                const lastMsg = prev[prev.length - 1];
                if (lastMsg?.text === response && lastMsg?.type === 'bot') return prev;

                return [...prev, { type: 'bot', text: response }];
            });
        }
    }, [response]);

    // Watch for new transcripts (User speech)
    useEffect(() => {
        if (transcript) {
            setMessages(prev => {
                const lastMsg = prev[prev.length - 1];
                // If the last message was user and same text, don't add (dedupe)
                // But transcript updates continuously? No, hook sets it on 'result'.
                // We need to be careful not to add it multiple times.
                // Let's just add it when it changes and is not empty.
                if (lastMsg?.text === transcript && lastMsg?.type === 'user') return prev;
                return [...prev, { type: 'user', text: transcript }];
            });
        }
    }, [transcript]);


    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleMicClick = () => {
        if (isListening) {
            stopListening();
        } else {
            startListening();
        }
    };

    const handleTextSubmit = (e) => {
        e.preventDefault();
        if (!inputText.trim()) return;

        setMessages(prev => [...prev, { type: 'user', text: inputText }]);
        processCommand(inputText); // Use the hook's logic engine
        setInputText('');
    };

    return (
        <>
            {/* Floating Action Button (FAB) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 right-6 p-4 rounded-full shadow-2xl z-50 transition-all duration-300 ${isOpen ? 'bg-red-500 rotate-45' : 'bg-farm-green-500 hover:bg-farm-green-700'
                    } text-white flex items-center justify-center`}
            >
                {isOpen ? <X size={24} /> : <Mic size={24} />}

                {/* Ripple Animation when Listening (and closed? No, usually when open) */}
                {/* Actually, if it's closed and listening (background?), show ripple. 
                    But usually we listen only when open. Let's show ripple on the FAB if listening. */}
                {!isOpen && isListening && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-farm-green-400 opacity-75 animate-ping"></span>
                )}
            </button>

            {/* Chat Interface (Overlay/Modal) */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 overflow-hidden flex flex-col h-[500px]"
                    >
                        {/* Header */}
                        <div className="bg-farm-green-500 p-4 text-white flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-full">
                                    <MessageSquare size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold">Agri-Bot</h3>
                                    <p className="text-xs text-farm-green-100">আপনার কৃষি সহকারী</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowKeyboard(!showKeyboard)}
                                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                                title={showKeyboard ? "Use Voice" : "Use Keyboard"}
                            >
                                {showKeyboard ? <Mic size={18} /> : <Keyboard size={18} />}
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-400 mt-10">
                                    <p>কিভাবে সাহায্য করতে পারি?</p>
                                    <p className="text-xs mt-2">বলুন: "আজকের আবহাওয়া কেমন?"</p>
                                </div>
                            )}

                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.type === 'user'
                                            ? 'bg-farm-green-500 text-white rounded-tr-none'
                                            : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            {showKeyboard || !isVoiceSupported ? (
                                <form onSubmit={handleTextSubmit} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputText}
                                        onChange={(e) => setInputText(e.target.value)}
                                        placeholder="এখানে লিখুন..."
                                        className="flex-1 p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-farm-green-500 text-sm"
                                    />
                                    <button
                                        type="submit"
                                        className="p-3 bg-farm-green-500 text-white rounded-xl hover:bg-farm-green-700 transition-colors"
                                    >
                                        <Send size={20} />
                                    </button>
                                </form>
                            ) : (
                                <div className="flex flex-col items-center gap-2">
                                    <button
                                        onClick={handleMicClick}
                                        className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isListening
                                            ? 'bg-red-50 text-red-600 border-2 border-red-200 shadow-lg shadow-red-100'
                                            : 'bg-farm-green-50 text-farm-green-500 border-2 border-farm-green-100 hover:bg-farm-green-100'
                                            }`}
                                    >
                                        <Mic size={32} className={isListening ? 'animate-pulse' : ''} />
                                    </button>
                                    <p className="text-xs text-gray-400 font-medium">
                                        {isListening ? 'শুনছি...' : 'কথা বলতে ট্যাপ করুন'}
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default VoiceAssistant;
