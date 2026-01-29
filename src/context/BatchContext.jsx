import React, { createContext, useContext, useState, useEffect } from 'react';
import { collection, addDoc, query, where, onSnapshot, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from './AuthContext';

const BatchContext = createContext();

export const useBatch = () => useContext(BatchContext);

export const BatchProvider = ({ children }) => {
    const { user } = useAuth();
    const [batches, setBatches] = useState([]);
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let unsubscribeBatches;
        let unsubscribeScans;

        if (user) {
            setLoading(true);

            // Batches Query
            const qBatches = query(
                collection(db, 'batches'),
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
            );

            unsubscribeBatches = onSnapshot(qBatches, (snapshot) => {
                const fetchedBatches = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setBatches(fetchedBatches);
            });

            // Scans Query
            const qScans = query(
                collection(db, 'scans'),
                where('userId', '==', user.uid),
                orderBy('createdAt', 'desc')
            );

            unsubscribeScans = onSnapshot(qScans, (snapshot) => {
                const fetchedScans = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setScans(fetchedScans);
                setLoading(false);
            }, (error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });

        } else {
            setBatches([]);
            setScans([]);
            setLoading(false);
        }

        return () => {
            if (unsubscribeBatches) unsubscribeBatches();
            if (unsubscribeScans) unsubscribeScans();
        };
    }, [user]);

    const addBatch = async (batchData) => {
        if (!user) return;

        try {
            // Simulate backend risk analysis
            const risks = ['low', 'medium', 'high'];
            const randomRisk = risks[Math.floor(Math.random() * risks.length)];

            await addDoc(collection(db, 'batches'), {
                ...batchData,
                userId: user.uid,
                createdAt: new Date().toISOString(),
                status: 'Active', // Default status
                risk: randomRisk // Auto-assigned risk
            });
        } catch (error) {
            console.error("Error adding batch:", error);
            throw error;
        }
    };

    const addScan = async (scanData) => {
        if (!user) return;
        try {
            await addDoc(collection(db, 'scans'), {
                ...scanData,
                userId: user.uid,
                createdAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error adding scan:", error);
            throw error;
        }
    };

    const completeBatch = async (batchId) => {
        if (!user) return;
        try {
            const batchRef = doc(db, 'batches', batchId);
            await updateDoc(batchRef, {
                status: 'Completed',
                completedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error("Error completing batch:", error);
            throw error;
        }
    };

    const value = {
        batches,
        scans,
        addBatch,
        addScan,
        completeBatch,
        loading
    };

    return (
        <BatchContext.Provider value={value}>
            {children}
        </BatchContext.Provider>
    );
};
