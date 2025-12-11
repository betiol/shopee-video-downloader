"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Crown, Check, Loader2, Zap, CreditCard, QrCode } from "lucide-react";
import { PixPayment } from "@/components/pix-payment";
import { getAuth } from "firebase/auth";

interface UpgradeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpgrade: () => Promise<void>;
}

interface PricingData {
    amount: number;
    currency: string;
    display: string;
    country: string;
}

type PaymentMethod = "card" | "pix";

export function UpgradeModal({ open, onOpenChange, onUpgrade }: UpgradeModalProps) {
    const t = useTranslations("upgradeModal");
    const [loading, setLoading] = useState(false);
    const [pricing, setPricing] = useState<PricingData>({
        amount: 30,
        currency: 'BRL',
        display: 'R$ 30',
        country: 'BR'
    });
    const [loadingPrice, setLoadingPrice] = useState(true);
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
    const [pixPreferenceId, setPixPreferenceId] = useState<string | null>(null);
    const [pixInitPoint, setPixInitPoint] = useState<string | null>(null);
    const [showPixPayment, setShowPixPayment] = useState(false);

    useEffect(() => {
        if (open) {
            fetchPricing();
            setShowPixPayment(false);
            setPixPreferenceId(null);
            setPixInitPoint(null);
        }
    }, [open]);

    const fetchPricing = async () => {
        try {
            setLoadingPrice(true);
            const response = await fetch('/api/pricing');
            if (response.ok) {
                const data = await response.json();
                setPricing(data);
            }
        } catch (error) {
            console.error('Error fetching pricing:', error);
            // Keep default pricing on error
        } finally {
            setLoadingPrice(false);
        }
    };

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            if (paymentMethod === "card") {
                // Use Stripe (existing flow)
                await onUpgrade();
            } else {
                // Use Mercado Pago PIX
                await handlePixPayment();
            }
        } finally {
            setLoading(false);
        }
    };

    const handlePixPayment = async () => {
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                throw new Error("User not authenticated");
            }

            const token = await user.getIdToken();
            const response = await fetch("/api/mercadopago/checkout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to create PIX payment");
            }

            const data = await response.json();
            setPixPreferenceId(data.preferenceId);
            setPixInitPoint(data.initPoint);
            setShowPixPayment(true);
        } catch (error) {
            console.error("Error creating PIX payment:", error);
        }
    };

    const handlePixSuccess = () => {
        setShowPixPayment(false);
        onOpenChange(false);
        window.location.reload(); // Reload to update premium status
    };

    const handlePixCancel = () => {
        setShowPixPayment(false);
        setPixPreferenceId(null);
        setPixInitPoint(null);
    };

    if (showPixPayment && pixPreferenceId && pixInitPoint) {
        return (
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="text-center text-2xl font-bold">
                            Pagamento PIX
                        </DialogTitle>
                    </DialogHeader>
                    <PixPayment
                        preferenceId={pixPreferenceId}
                        initPoint={pixInitPoint}
                        onSuccess={handlePixSuccess}
                        onCancel={handlePixCancel}
                    />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <div className="flex items-center justify-center mb-4">
                        <div className="p-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full">
                            <Crown className="h-8 w-8 text-white" />
                        </div>
                    </div>
                    <DialogTitle className="text-center text-2xl font-bold">
                        {t("title")}
                    </DialogTitle>
                    <DialogDescription className="text-center text-base">
                        {t("description")}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                    {/* Price */}
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-2">
                            {loadingPrice ? (
                                <Loader2 className="h-8 w-8 animate-spin text-amber-600" />
                            ) : (
                                <span className="text-5xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                                    {pricing.display}
                                </span>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                            {t("oneTime")}
                        </p>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 py-4">
                        <div className="flex items-start gap-3">
                            <div className="p-1 bg-green-100 rounded-full mt-0.5">
                                <Check className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                                <p className="font-semibold">{t("features.unlimited.title")}</p>
                                <p className="text-sm text-muted-foreground">
                                    {t("features.unlimited.description")}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-1 bg-green-100 rounded-full mt-0.5">
                                <Check className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                                <p className="font-semibold">{t("features.noWatermark.title")}</p>
                                <p className="text-sm text-muted-foreground">
                                    {t("features.noWatermark.description")}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="p-1 bg-green-100 rounded-full mt-0.5">
                                <Check className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                                <p className="font-semibold">{t("features.lifetime.title")}</p>
                                <p className="text-sm text-muted-foreground">
                                    {t("features.lifetime.description")}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">{t("paymentMethod")}</label>
                        <div className="grid grid-cols-2 gap-3">
                            <Button
                                variant={paymentMethod === "card" ? "default" : "outline"}
                                className={paymentMethod === "card" ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0" : ""}
                                onClick={() => setPaymentMethod("card")}
                            >
                                <CreditCard className="mr-2 h-4 w-4" />
                                {t("card")}
                            </Button>
                            <Button
                                variant={paymentMethod === "pix" ? "default" : "outline"}
                                className={paymentMethod === "pix" ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0" : ""}
                                onClick={() => setPaymentMethod("pix")}
                            >
                                <QrCode className="mr-2 h-4 w-4" />
                                {t("pix")}
                            </Button>
                        </div>
                    </div>

                    {/* CTA Button */}
                    <Button
                        onClick={handleUpgrade}
                        disabled={loading}
                        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
                        size="lg"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                {t("processing")}
                            </>
                        ) : (
                            <>
                                <Zap className="mr-2 h-5 w-5" />
                                {t("button")}
                            </>
                        )}
                    </Button>

                    <p className="text-xs text-center text-muted-foreground">
                        {t("securePayment")}
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    );
}
