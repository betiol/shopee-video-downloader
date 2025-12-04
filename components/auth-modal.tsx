"use client";

import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth-provider";
import { Loader2, Mail, Lock, AlertCircle, CheckCircle, Info, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";

interface AuthModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    defaultTab?: "login" | "signup";
}

type AuthView = "login" | "signup" | "reset" | "verification";

export function AuthModal({ open, onOpenChange, defaultTab = "login" }: AuthModalProps) {
    const t = useTranslations("auth");
    const { user, signInWithGoogle, signInWithEmail, signUpWithEmail, resetPassword, resendVerificationEmail } = useAuth();
    const [activeView, setActiveView] = useState<AuthView>(defaultTab);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    // Reset state when modal opens/closes
    useEffect(() => {
        if (open) {
            setError("");
            if (defaultTab) setActiveView(defaultTab);
        }
    }, [open, defaultTab]);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError("");
        try {
            await signInWithGoogle();
            onOpenChange(false);
            toast.success(t("success.loggedIn"));
        } catch (error: any) {
            setError(error.message || t("errors.generic"));
            toast.error(t("errors.generic"));
        } finally {
            setLoading(false);
        }
    };

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await signInWithEmail(email, password);
            onOpenChange(false);
            toast.success(t("success.loggedIn"));
        } catch (error: any) {
            if (error.message === "EMAIL_NOT_VERIFIED") {
                setActiveView("verification");
                toast.warning(t("verification.warning"));
            } else if (error.code === "auth/invalid-credential") {
                setError(t("errors.invalidCredential"));
            } else if (error.code === "auth/user-not-found") {
                setError(t("errors.userNotFound"));
            } else if (error.code === "auth/wrong-password") {
                setError(t("errors.wrongPassword"));
            } else {
                setError(error.message || t("errors.generic"));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        if (password !== confirmPassword) {
            setError(t("errors.passwordMismatch"));
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError(t("errors.passwordTooShort"));
            setLoading(false);
            return;
        }

        try {
            await signUpWithEmail(email, password);
            setActiveView("verification");
            toast.success(t("success.accountCreated"));
        } catch (error: any) {
            if (error.code === "auth/email-already-in-use") {
                setError(t("errors.emailInUse"));
            } else if (error.code === "auth/invalid-email") {
                setError(t("errors.invalidEmail"));
            } else if (error.code === "auth/weak-password") {
                setError(t("errors.weakPassword"));
            } else {
                setError(error.message || t("errors.generic"));
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordReset = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await resetPassword(email);
            toast.success(t("success.passwordResetSent"));
            setTimeout(() => {
                setActiveView("login");
            }, 2000);
        } catch (error: any) {
            if (error.code === "auth/user-not-found") {
                setError(t("errors.userNotFound"));
            } else if (error.code === "auth/invalid-email") {
                setError(t("errors.invalidEmail"));
            } else {
                setError(error.message || t("errors.generic"));
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResendVerification = async () => {
        setLoading(true);
        setError("");

        try {
            await resendVerificationEmail();
            toast.success(t("success.verificationSent"));
        } catch (error: any) {
            setError(error.message || t("errors.generic"));
            toast.error(t("errors.generic"));
        } finally {
            setLoading(false);
        }
    };

    const switchView = (view: AuthView) => {
        setActiveView(view);
        setError("");
        // Don't clear email if switching between login/signup/reset/verification
        // as user might want to reuse the email they just typed
        setPassword("");
        setConfirmPassword("");
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {activeView === "login" && t("login.title")}
                        {activeView === "signup" && t("signup.title")}
                        {activeView === "reset" && t("reset.title")}
                        {activeView === "verification" && t("verification.warning")}
                    </DialogTitle>
                    <DialogDescription>
                        {activeView === "login" && t("login.description")}
                        {activeView === "signup" && t("signup.description")}
                        {activeView === "reset" && t("reset.description")}
                        {activeView === "verification" && `${t("verification.checkInbox")} (${email})`}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 py-4">
                    {/* Tab Buttons - Only show for login/signup */}
                    {(activeView === "login" || activeView === "signup") && (
                        <div className="flex gap-2 p-1 bg-muted rounded-lg">
                            <button
                                onClick={() => switchView("login")}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeView === "login"
                                    ? "bg-background shadow-sm"
                                    : "hover:bg-background/50"
                                    }`}
                            >
                                {t("tabs.login")}
                            </button>
                            <button
                                onClick={() => switchView("signup")}
                                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${activeView === "signup"
                                    ? "bg-background shadow-sm"
                                    : "hover:bg-background/50"
                                    }`}
                            >
                                {t("tabs.signup")}
                            </button>
                        </div>
                    )}

                    {/* Error Messages */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md text-sm">
                            <AlertCircle className="h-4 w-4 flex-shrink-0" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Login Form */}
                    {activeView === "login" && (
                        <form onSubmit={handleEmailLogin} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="login-email">{t("login.email")}</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder={t("login.emailPlaceholder")}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="login-password">{t("login.password")}</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="login-password"
                                        type="password"
                                        placeholder={t("login.passwordPlaceholder")}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    onClick={() => switchView("reset")}
                                    className="text-xs text-primary hover:underline"
                                    disabled={loading}
                                >
                                    {t("reset.forgotPassword")}
                                </button>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t("login.signingIn")}
                                    </>
                                ) : (
                                    t("login.button")
                                )}
                            </Button>
                        </form>
                    )}

                    {/* Signup Form */}
                    {activeView === "signup" && (
                        <form onSubmit={handleEmailSignup} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="signup-email">{t("signup.email")}</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder={t("signup.emailPlaceholder")}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="signup-password">{t("signup.password")}</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        placeholder={t("signup.passwordPlaceholder")}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="pl-10"
                                        required
                                        disabled={loading}
                                        minLength={6}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {t("signup.passwordHint")}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="signup-confirm-password">{t("signup.confirmPassword")}</Label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="signup-confirm-password"
                                        type="password"
                                        placeholder={t("signup.passwordPlaceholder")}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="pl-10"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t("signup.creatingAccount")}
                                    </>
                                ) : (
                                    t("signup.button")
                                )}
                            </Button>
                        </form>
                    )}

                    {/* Password Reset Form */}
                    {activeView === "reset" && (
                        <form onSubmit={handlePasswordReset} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="reset-email">{t("reset.email")}</Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="reset-email"
                                        type="email"
                                        placeholder={t("reset.emailPlaceholder")}
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10"
                                        required
                                        disabled={loading}
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    {t("reset.hint")}
                                </p>
                            </div>

                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        {t("reset.sending")}
                                    </>
                                ) : (
                                    t("reset.button")
                                )}
                            </Button>

                            <div className="text-center">
                                <button
                                    type="button"
                                    onClick={() => switchView("login")}
                                    className="text-sm text-primary hover:underline flex items-center justify-center gap-1"
                                    disabled={loading}
                                >
                                    <ArrowLeft className="h-3 w-3" />
                                    {t("reset.backToLogin")}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Verification View */}
                    {activeView === "verification" && (
                        <div className="space-y-4">
                            <div className="flex justify-center py-4">
                                <div className="p-4 bg-primary/10 rounded-full">
                                    <Mail className="h-12 w-12 text-primary" />
                                </div>
                            </div>

                            <div className="bg-muted p-4 rounded-lg space-y-2 text-center">
                                <p className="text-sm text-muted-foreground">
                                    {t("verification.checkInbox")}
                                </p>
                                <p className="text-xs text-muted-foreground font-medium">
                                    {t("verification.spamHint")}
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Button
                                    variant="outline"
                                    onClick={handleResendVerification}
                                    disabled={loading}
                                    className="w-full"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            {t("verification.sending")}
                                        </>
                                    ) : (
                                        t("verification.resendButton")
                                    )}
                                </Button>

                                <Button
                                    onClick={() => switchView("login")}
                                    className="w-full"
                                >
                                    {t("reset.backToLogin")}
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Social Login Divider - Only for login/signup */}
                    {(activeView === "login" || activeView === "signup") && (
                        <>
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        {t("login.orContinueWith")}
                                    </span>
                                </div>
                            </div>

                            <Button
                                variant="outline"
                                onClick={handleGoogleLogin}
                                disabled={loading}
                                className="w-full"
                            >
                                {loading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <svg
                                        className="mr-2 h-4 w-4"
                                        aria-hidden="true"
                                        focusable="false"
                                        data-prefix="fab"
                                        data-icon="google"
                                        role="img"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 488 512"
                                    >
                                        <path
                                            fill="currentColor"
                                            d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                                        ></path>
                                    </svg>
                                )}
                                {t("login.googleButton")}
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
