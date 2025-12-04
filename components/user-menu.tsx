"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/auth-modal";
import { UpgradeModal } from "@/components/upgrade-modal";
import { Loader2, LogOut, Crown, User as UserIcon, RefreshCcw } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

export function UserMenu() {
    const { user, loading, usage, isPremium, logout } = useAuth();
    const [loginOpen, setLoginOpen] = useState(false);
    const [upgradeOpen, setUpgradeOpen] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [refundDialogOpen, setRefundDialogOpen] = useState(false);
    const [refundLoading, setRefundLoading] = useState(false);
    const [refundMessage, setRefundMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
    const t = useTranslations("userMenu");
    const tRefund = useTranslations("refund");

    const handleUpgrade = async () => {
        setCheckoutLoading(true);
        try {
            const token = await user?.getIdToken();
            const response = await fetch("/api/stripe/checkout", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error("No checkout URL returned");
            }
        } catch (error) {
            console.error("Upgrade failed:", error);
        } finally {
            setCheckoutLoading(false);
        }
    };

    const handleRefundRequest = async () => {
        setRefundLoading(true);
        setRefundMessage(null);
        try {
            const token = await user?.getIdToken();
            const response = await fetch("/api/stripe/refund", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (response.ok) {
                setRefundMessage({ type: "success", text: tRefund("success") });
                // Refresh the page after 3 seconds to update user status
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } else {
                if (data.error === "Refund already requested") {
                    setRefundMessage({ type: "error", text: tRefund("alreadyRequested") });
                } else {
                    setRefundMessage({ type: "error", text: tRefund("error") });
                }
            }
        } catch (error) {
            console.error("Refund failed:", error);
            setRefundMessage({ type: "error", text: tRefund("error") });
        } finally {
            setRefundLoading(false);
        }
    };

    if (loading) {
        return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
    }

    if (!user) {
        return (
            <>
                <Button onClick={() => setLoginOpen(true)} variant="outline" size="sm">
                    Login
                </Button>
                <AuthModal open={loginOpen} onOpenChange={setLoginOpen} />
            </>
        );
    }

    return (
        <div className="flex items-center gap-4">
            {!isPremium && (
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                    <span>{t("dailyUsage", { usage })}</span>
                    <Button
                        onClick={() => setUpgradeOpen(true)}
                        size="sm"
                        className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white border-0"
                    >
                        <Crown className="mr-1 h-3 w-3" />
                        Upgrade
                    </Button>
                </div>
            )}

            {isPremium && (
                <div className="hidden md:flex items-center gap-1 text-amber-500 font-medium text-sm">
                    <Crown className="h-4 w-4" />
                    <span>Premium</span>
                </div>
            )}

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                        {user.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt={user.displayName || "User"}
                                className="h-8 w-8 rounded-full"
                            />
                        ) : (
                            <UserIcon className="h-5 w-5" />
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>
                        <div className="flex flex-col">
                            <span>{user.displayName}</span>
                            <span className="text-xs text-muted-foreground">{user.email}</span>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {!isPremium && (
                        <DropdownMenuItem onClick={() => setUpgradeOpen(true)} className="md:hidden">
                            <Crown className="mr-2 h-4 w-4 text-amber-500" />
                            Upgrade
                        </DropdownMenuItem>
                    )}
                    {isPremium && (
                        <DropdownMenuItem onClick={() => setRefundDialogOpen(true)}>
                            <RefreshCcw className="mr-2 h-4 w-4 text-red-500" />
                            {t("refund.button")}
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={() => logout()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <UpgradeModal
                open={upgradeOpen}
                onOpenChange={setUpgradeOpen}
                onUpgrade={handleUpgrade}
            />

            <Dialog open={refundDialogOpen} onOpenChange={setRefundDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{t("refund.confirmTitle")}</DialogTitle>
                        <DialogDescription>
                            {t("refund.confirmMessage")}
                        </DialogDescription>
                    </DialogHeader>
                    {refundMessage && (
                        <div
                            className={`p-3 rounded-md text-sm ${refundMessage.type === "success"
                                ? "bg-green-50 text-green-800 border border-green-200"
                                : "bg-red-50 text-red-800 border border-red-200"
                                }`}
                        >
                            {refundMessage.text}
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setRefundDialogOpen(false)}
                            disabled={refundLoading}
                        >
                            {t("refund.cancel")}
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleRefundRequest}
                            disabled={refundLoading}
                        >
                            {refundLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    {t("refund.processing")}
                                </>
                            ) : (
                                t("refund.confirm")
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
