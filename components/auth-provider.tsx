"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    usage: number;
    isPremium: boolean;
    signInWithGoogle: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    usage: 0,
    isPremium: false,
    signInWithGoogle: async () => { },
    logout: async () => { },
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [usage, setUsage] = useState(0);
    const [isPremium, setIsPremium] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);

            if (user) {
                // Listen to premium status
                const premiumRef = ref(db, `users/${user.uid}/isPremium`);
                onValue(premiumRef, (snapshot) => {
                    setIsPremium(!!snapshot.val());
                });

                // Listen to daily usage
                const today = new Date().toISOString().split("T")[0];
                const usageRef = ref(db, `users/${user.uid}/usage/${today}`);
                onValue(usageRef, (snapshot) => {
                    setUsage(snapshot.val() || 0);
                });
            } else {
                setUsage(0);
                setIsPremium(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, usage, isPremium, signInWithGoogle, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}
