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
import { Crown, Check, Loader2, Zap, CreditCard } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

interface UpgradeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpgrade?: () => Promise<void>;
}

interface PricingData {
    amount: number;
    currency: string;
    display: string;
    country: string;
}

type PaymentGateway = 'stripe' | 'kiwify';

export function UpgradeModal({ open, onOpenChange, onUpgrade }: UpgradeModalProps) {
    const t = useTranslations("upgradeModal");
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [pricing, setPricing] = useState<PricingData>({
        amount: 30,
        currency: 'BRL',
        display: 'R$ 30',
        country: 'BR'
    });
    const [loadingPrice, setLoadingPrice] = useState(true);
    const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>('kiwify');

    useEffect(() => {
        if (open) {
            fetchPricing();
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
            if (onUpgrade) {
                await onUpgrade();
                return;
            }

            // Get Firebase auth token
            const token = await user?.getIdToken();
            if (!token) {
                throw new Error("Not authenticated");
            }

            // Call appropriate checkout endpoint
            const endpoint = selectedGateway === 'kiwify' 
                ? '/api/kiwify/checkout' 
                : '/api/stripe/checkout';

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to create checkout session");
            }

            const { url } = await response.json();
            
            // Redirect to checkout
            window.location.href = url;
        } catch (error) {
            console.error("Upgrade error:", error);
            alert(t("error") || "Failed to start checkout. Please try again.");
        } finally {
            setLoading(false);
        }
    };

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

                    {/* Payment Method Selection */}
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-center">{t("selectPaymentMethod")}</p>
                        <div className="grid grid-cols-1 gap-3">
                            {/* PIX Button */}
                            {/* <Button
                                type="button"
                                onClick={() => setSelectedGateway('kiwify')}
                                variant="outline"
                                className={`h-auto py-4 px-4 flex flex-col items-center gap-2 transition-all ${
                                    selectedGateway === 'kiwify'
                                        ? 'border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/20'
                                        : 'border-2 hover:border-amber-300'
                                }`}
                            >
                                <svg 
                                    className={`h-8 w-8 ${selectedGateway === 'kiwify' ? 'text-amber-600' : 'text-gray-600'}`}
                                    viewBox="0 0 24 24" 
                                    fill="currentColor"
                                >
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                                </svg>
                                <span className={`font-semibold text-base ${selectedGateway === 'kiwify' ? 'text-amber-600' : ''}`}>
                                    PIX
                                </span>
                            </Button> */}

                            {/* Card Button */}
                            <Button
                                type="button"
                                onClick={() => setSelectedGateway('stripe')}
                                variant="outline"
                                className={`h-auto py-4 px-4 flex flex-col items-center gap-2 transition-all ${
                                    selectedGateway === 'stripe'
                                        ? 'border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/20'
                                        : 'border-2 hover:border-amber-300'
                                }`}
                            >
                                <CreditCard className={`h-8 w-8 ${selectedGateway === 'stripe' ? 'text-amber-600' : 'text-gray-600'}`} />
                                <span className={`font-semibold text-base ${selectedGateway === 'stripe' ? 'text-amber-600' : ''}`}>
                                    {t("cardButton")}
                                </span>
                            </Button>
                        </div>
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
