"use client";

import { useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/login-modal";
import { UpgradeModal } from "@/components/upgrade-modal";
import { Loader2, LogOut, Crown, User as UserIcon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserMenu() {
    const { user, loading, usage, isPremium, logout } = useAuth();
    const [loginOpen, setLoginOpen] = useState(false);
    const [upgradeOpen, setUpgradeOpen] = useState(false);
    const [checkoutLoading, setCheckoutLoading] = useState(false);

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

    if (loading) {
        return <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />;
    }

    if (!user) {
        return (
            <>
                <Button onClick={() => setLoginOpen(true)} variant="outline" size="sm">
                    Login
                </Button>
                <LoginModal open={loginOpen} onOpenChange={setLoginOpen} />
            </>
        );
    }

    return (
        <div className="flex items-center gap-4">
            {!isPremium && (
                <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Daily Usage: {usage}/5</span>
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
        </div>
    );
}
