"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
    User,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendEmailVerification,
    sendPasswordResetEmail,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { ref, onValue } from "firebase/database";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    usage: number;
    isPremium: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithEmail: (email: string, password: string) => Promise<void>;
    signUpWithEmail: (email: string, password: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    resendVerificationEmail: () => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    usage: 0,
    isPremium: false,
    signInWithGoogle: async () => { },
    signInWithEmail: async () => { },
    signUpWithEmail: async () => { },
    resetPassword: async () => { },
    resendVerificationEmail: async () => { },
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

    const signInWithEmail = async (email: string, password: string) => {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);

        // Check if email is verified
        if (!userCredential.user.emailVerified) {
            // Logout immediately if email not verified
            await signOut(auth);
            throw new Error("EMAIL_NOT_VERIFIED");
        }
    };

    const signUpWithEmail = async (email: string, password: string) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        // Send verification email
        await sendEmailVerification(userCredential.user);
        // Logout immediately - user must verify email before logging in
        await signOut(auth);
    };

    const resetPassword = async (email: string) => {
        await sendPasswordResetEmail(auth, email);
    };

    const resendVerificationEmail = async () => {
        const currentUser = auth.currentUser;
        if (currentUser && !currentUser.emailVerified) {
            await sendEmailVerification(currentUser);
        } else {
            throw new Error("No user logged in or email already verified");
        }
    };

    const logout = async () => {
        await signOut(auth);
    };

    return (
        <AuthContext.Provider
            value={{ user, loading, usage, isPremium, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, resendVerificationEmail, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
}
