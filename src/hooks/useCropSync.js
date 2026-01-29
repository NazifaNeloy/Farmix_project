import { useState, useEffect } from 'react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';

export const useCropSync = () => {
    const { user } = useAuth();
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [isSyncing, setIsSyncing] = useState(false);
    const [unsyncedCount, setUnsyncedCount] = useState(0);

    // Update online status
    useEffect(() => {
        const handleStatusChange = () => {
            setIsOnline(navigator.onLine);
        };

        window.addEventListener('online', handleStatusChange);
        window.addEventListener('offline', handleStatusChange);

        // Initial check for unsynced items
        updateUnsyncedCount();

        return () => {
            window.removeEventListener('online', handleStatusChange);
            window.removeEventListener('offline', handleStatusChange);
        };
    }, []);

    // Auto-sync when coming online
    useEffect(() => {
        if (isOnline && unsyncedCount > 0) {
            syncOfflineBatches();
        }
    }, [isOnline, unsyncedCount]);

    const updateUnsyncedCount = () => {
        const stored = localStorage.getItem('unsynced_batches');
        if (stored) {
            const batches = JSON.parse(stored);
            setUnsyncedCount(batches.length);
        } else {
            setUnsyncedCount(0);
        }
    };

    const saveBatch = async (batchData) => {
        const dataToSave = {
            ...batchData,
            userId: user?.uid,
            createdAt: new Date().toISOString(),
            synced: isOnline
        };

        if (isOnline) {
            try {
                // Online: Save directly to Firestore
                await addDoc(collection(db, 'batches'), dataToSave);
                return { success: true, mode: 'online' };
            } catch (error) {
                console.error("Online save failed, falling back to offline:", error);
                // Fallback to offline if Firestore fails
                return saveToLocalStorage(dataToSave);
            }
        } else {
            // Offline: Save to LocalStorage
            return saveToLocalStorage(dataToSave);
        }
    };

    const saveToLocalStorage = (data) => {
        try {
            const stored = localStorage.getItem('unsynced_batches');
            const batches = stored ? JSON.parse(stored) : [];
            batches.push(data);
            localStorage.setItem('unsynced_batches', JSON.stringify(batches));
            updateUnsyncedCount();
            return { success: true, mode: 'offline' };
        } catch (error) {
            console.error("LocalStorage save failed:", error);
            return { success: false, error };
        }
    };

    const syncOfflineBatches = async () => {
        if (!user) return;

        setIsSyncing(true);
        try {
            const stored = localStorage.getItem('unsynced_batches');
            if (!stored) {
                setIsSyncing(false);
                return;
            }

            const batches = JSON.parse(stored);
            console.log(`Syncing ${batches.length} batches...`);

            // Upload each batch
            const uploadPromises = batches.map(async (batch) => {
                const { synced, ...cleanBatch } = batch; // Remove 'synced' flag
                return addDoc(collection(db, 'batches'), {
                    ...cleanBatch,
                    userId: user.uid, // Ensure userId is current
                    synced: true
                });
            });

            await Promise.all(uploadPromises);

            // Clear LocalStorage after successful sync
            localStorage.removeItem('unsynced_batches');
            updateUnsyncedCount();
            console.log("Sync complete!");
        } catch (error) {
            console.error("Sync failed:", error);
        } finally {
            setIsSyncing(false);
        }
    };

    return {
        saveBatch,
        isOnline,
        isSyncing,
        unsyncedCount,
        syncOfflineBatches // Expose for manual trigger if needed
    };
};
