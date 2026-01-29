import { useState, useEffect, useCallback } from 'react';
import * as tmImage from '@teachablemachine/image';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export const useTeachableMachine = () => {
    const [model, setModel] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { currentUser } = useAuth();

    // Load model on mount
    useEffect(() => {
        const loadModel = async () => {
            try {
                const modelURL = '/model/model.json';
                const metadataURL = '/model/metadata.json';

                const loadedModel = await tmImage.load(modelURL, metadataURL);
                setModel(loadedModel);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load AI model:", err);
                setError("Failed to load AI brain. Please check your connection.");
                setLoading(false);
            }
        };

        loadModel();
    }, []);

    const predict = useCallback(async (imageElement) => {
        if (!model) return null;

        try {
            const predictions = await model.predict(imageElement);

            // Find highest probability
            const bestPrediction = predictions.reduce((prev, current) =>
                (prev.probability > current.probability) ? prev : current
            );

            // Determine status based on threshold
            let status = 'UNCERTAIN';
            let message = '❓ Uncertain. Please take a clearer photo.';
            let color = 'gray';

            const className = bestPrediction.className.toLowerCase();
            const probability = bestPrediction.probability;

            // Log for debugging
            console.log("Prediction:", className, probability);

            if (probability > 0.5) {
                // Logic swapped as per user report (Model seems to have inverted labels)
                if (className.includes('rotten') || className.includes('disease') || className.includes('bad')) {
                    status = 'SAFE';
                    message = '✅ Crop appears healthy.';
                    color = 'green';
                } else if (className.includes('fresh') || className.includes('healthy') || className.includes('good')) {
                    status = 'CRITICAL';
                    message = '⚠️ High Moisture/Mold Detected. Aerate immediately.';
                    color = 'red';
                }
            }

            const result = {
                className: bestPrediction.className,
                probability: bestPrediction.probability,
                status,
                message,
                color,
                allPredictions: predictions
            };

            // Log to Firestore (fire & forget)
            logResult(result);

            return result;
        } catch (err) {
            console.error("Prediction failed:", err);
            throw err;
        }
    }, [model]);

    const logResult = async (result) => {
        if (!currentUser) return;

        try {
            await addDoc(collection(db, 'scan_history'), {
                userId: currentUser.uid,
                timestamp: serverTimestamp(),
                result: result.status === 'SAFE' ? 'Fresh' : result.status === 'CRITICAL' ? 'Rotten' : 'Uncertain',
                confidence: `${(result.probability * 100).toFixed(1)}%`,
                rawClass: result.className
            });
        } catch (err) {
            console.error("Failed to log scan:", err);
            // Don't block UI for logging error
        }
    };

    return { model, loading, error, predict };
};
