import React, { createContext, useContext, useEffect, useState } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth, db, storage } from '../lib/firebase';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const isSigningUp = React.useRef(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            // If we are in the middle of signing up, let the signup function handle userData
            // This prevents the race condition where this listener fetches a not-yet-created doc
            if (isSigningUp.current && currentUser) {
                console.log("Skipping onAuthStateChanged profile fetch (Signup in progress)");
                // We don't set loading to false here, we let signup handle it? 
                // Actually, we should probably let loading finish so the UI doesn't hang, 
                // but userData will be null until signup finishes.
                setLoading(false);
                return;
            }

            if (currentUser) {
                const fetchProfile = async (retryCount = 0) => {
                    try {
                        // Create a timeout promise (10s)
                        const timeoutPromise = new Promise((_, reject) =>
                            setTimeout(() => reject(new Error("Firestore timeout")), 10000)
                        );

                        // Race getDoc against timeout
                        const userDoc = await Promise.race([
                            getDoc(doc(db, "users", currentUser.uid)),
                            timeoutPromise
                        ]);

                        if (userDoc.exists()) {
                            const data = userDoc.data();
                            // Only update if data is valid (has name/location)
                            if (data.name || data.location) {
                                setUserData(data);
                                // Backup to localStorage
                                localStorage.setItem('farmix_user_data', JSON.stringify(data));
                            } else {
                                console.warn("Fetched profile is empty/incomplete, ignoring");
                            }
                        } else {
                            // If doc doesn't exist, check if user is new (created < 30s ago)
                            const creationTime = new Date(currentUser.metadata.creationTime).getTime();
                            const now = new Date().getTime();
                            const isNewUser = (now - creationTime) < 30000;

                            if (isNewUser && retryCount < 3) {
                                console.log(`Profile not found for new user, retrying... (${retryCount + 1}/3)`);
                                await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s
                                return fetchProfile(retryCount + 1);
                            }

                            throw new Error("Doc does not exist");
                        }
                    } catch (err) {
                        console.warn("Profile fetch failed or timed out:", err);

                        // Fallback on error/timeout
                        // CRITICAL FIX: Do not overwrite existing valid userData with empty fallback
                        // if we already have data for this user (e.g. from signup)
                        setUserData(prev => {
                            if (prev && prev.uid === currentUser.uid && (prev.location || prev.phone)) {
                                console.log("Retaining existing valid user data despite fetch failure");
                                return prev;
                            }

                            // Try loading from localStorage backup
                            const cached = localStorage.getItem('farmix_user_data');
                            if (cached) {
                                try {
                                    const parsed = JSON.parse(cached);
                                    if (parsed.uid === currentUser.uid) {
                                        console.log("Restored user data from localStorage backup");
                                        return parsed;
                                    }
                                } catch (e) {
                                    console.error("Error parsing cached user data", e);
                                }
                            }

                            // Only fallback if we have absolutely nothing
                            return {
                                uid: currentUser.uid,
                                email: currentUser.email,
                                name: currentUser.displayName || "User",
                                phone: currentUser.phoneNumber || null,
                                location: null, // Explicitly null so we know it's missing
                                createdAt: currentUser.metadata.creationTime,
                                badges: []
                            };
                        });
                    }
                };

                fetchProfile();
            } else {
                setUserData(null);
                localStorage.removeItem('farmix_user_data');
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const signup = async (email, password, name, phone, language, location, imageFile) => {
        console.log("Starting signup process...");
        isSigningUp.current = true; // Set flag to block onAuthStateChanged fetch

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            console.log("User created in Auth:", user.uid);

            // 1. Update Auth Profile with Name immediately (Blocking)
            await updateProfile(user, {
                displayName: name
            });

            // 2. Create initial profile object (without photoURL initially)
            const initialProfile = {
                uid: user.uid,
                name,
                phone,
                language,
                email,
                location: location || null,
                photoURL: null,
                badges: [],
                createdAt: new Date().toISOString()
            };

            // 3. Save to Firestore immediately (Blocking with timeout)
            // This ensures data exists if page is reloaded
            try {
                const saveProfilePromise = setDoc(doc(db, "users", user.uid), initialProfile);
                await Promise.race([
                    saveProfilePromise,
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Firestore timeout")), 5000))
                ]);
                console.log("Basic profile saved to Firestore");
            } catch (err) {
                console.warn("Firestore save timed out, proceeding optimistically:", err);
            }

            // 4. Optimistically set user data
            // This is the CRITICAL step that ensures the UI shows the correct data immediately
            setUserData(initialProfile);
            localStorage.setItem('farmix_user_data', JSON.stringify(initialProfile));

            // 5. Background Task: Image Upload & PhotoURL Update
            if (imageFile) {
                const completeImageUpload = async () => {
                    try {
                        console.log("Starting background image upload...");
                        const storageRef = ref(storage, `profile_pictures/${user.uid}`);
                        await uploadBytes(storageRef, imageFile);
                        const photoURL = await getDownloadURL(storageRef);

                        console.log("Image uploaded, updating profile...");

                        // Update Auth Profile with Photo
                        await updateProfile(user, { photoURL });

                        // Update Firestore with Photo
                        const finalProfile = { ...initialProfile, photoURL };
                        await setDoc(doc(db, "users", user.uid), finalProfile); // Overwrite with new data

                        // Update local state
                        setUserData(finalProfile);
                        localStorage.setItem('farmix_user_data', JSON.stringify(finalProfile));
                        console.log("Background image upload complete");
                    } catch (err) {
                        console.error("Background image upload failed:", err);
                    }
                };
                // Start background task without awaiting
                completeImageUpload();
            }

            return user;
        } finally {
            // Reset flag after a short delay to allow onAuthStateChanged to settle if it fired
            setTimeout(() => {
                isSigningUp.current = false;
            }, 2000);
        }
    };

    const login = (email, password) => {
        return signInWithEmailAndPassword(auth, email, password);
    };

    const logout = () => {
        return signOut(auth);
    };

    const value = {
        user,
        userData,
        signup,
        login,
        logout,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="min-h-screen flex items-center justify-center bg-farm-green-50">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-farm-green-600"></div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
