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
import { Crown, Check, Loader2, Zap } from "lucide-react";

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
            await onUpgrade();
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
                        {!loadingPrice && pricing.country !== 'BR' && (
                            <p className="text-xs text-amber-600 mt-1 font-medium">
                                🌍 International pricing
                            </p>
                        )}
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
