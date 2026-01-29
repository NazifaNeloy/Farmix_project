import { useState, useEffect, useRef } from 'react';
import * as tmImage from '@teachablemachine/image';

export const useImageClassifier = () => {
    const [model, setModel] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadModel = async () => {
            try {
                const modelURL = '/model/model.json';
                const metadataURL = '/model/metadata.json';

                const loadedModel = await tmImage.load(modelURL, metadataURL);
                setModel(loadedModel);
                setLoading(false);
            } catch (err) {
                console.error("Failed to load model:", err);
                setError(err);
                setLoading(false);
            }
        };

        loadModel();
    }, []);

    const predict = async (imageElement) => {
        if (!model || !imageElement) return null;
        return await model.predict(imageElement);
    };

    return { model, predict, error, loading };
};
