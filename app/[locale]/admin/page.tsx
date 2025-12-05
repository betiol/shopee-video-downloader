"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, Crown, DollarSign, Download, TrendingUp, AlertCircle } from "lucide-react";

const ADMIN_EMAIL = "nikollasdev@gmail.com";

interface Stats {
    overview: {
        totalUsers: number;
        premiumUsers: number;
        freeUsers: number;
        conversionRate: string;
        totalRevenue: number;
        totalPremiumDownloads: number;
        totalFreeDownloads: number;
        avgDownloadsPerPremium: string;
    };
    topUsers: Array<{
        userId: string;
        email: string;
        downloads: number;
        purchasedAt: string;
    }>;
    recentPurchases: Array<{
        userId: string;
        email: string;
        purchasedAt: string;
        refundRequested: boolean;
    }>;
    downloadsByDate: Array<{
        date: string;
        count: number;
    }>;
}

export default function AdminDashboard() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!authLoading) {
            if (!user) {
                router.push("/");
                return;
            }

            if (user.email !== ADMIN_EMAIL) {
                router.push("/");
                return;
            }

            fetchStats();
        }
    }, [user, authLoading, router]);

    const fetchStats = async () => {
        try {
            const token = await user?.getIdToken();
            const response = await fetch("/api/admin/stats", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Failed to fetch stats");
            }

            const data = await response.json();
            setStats(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-md">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="h-5 w-5" />
                            Error
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>
                        <p className="text-slate-600 mt-1">Shopee Video Downloader Analytics</p>
                    </div>
                    <button
                        onClick={() => router.push("/")}
                        className="px-4 py-2 text-sm bg-white border border-slate-200 rounded-lg hover:bg-slate-50"
                    >
                        Voltar ao Site
                    </button>
                </div>

                {/* Overview Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.overview.totalUsers}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.overview.premiumUsers} premium · {stats.overview.freeUsers} free
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Premium Users</CardTitle>
                            <Crown className="h-4 w-4 text-amber-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.overview.premiumUsers}</div>
                            <p className="text-xs text-muted-foreground">
                                {stats.overview.conversionRate}% conversion rate
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                            <DollarSign className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">R$ {stats.overview.totalRevenue}</div>
                            <p className="text-xs text-muted-foreground">
                                R$ 50 per premium user
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Premium Downloads</CardTitle>
                            <Download className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stats.overview.totalPremiumDownloads}</div>
                            <p className="text-xs text-muted-foreground">
                                Avg: {stats.overview.avgDownloadsPerPremium} per user
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Top Users */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Top 10 Premium Users
                        </CardTitle>
                        <CardDescription>Users with most downloads</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.topUsers.map((user, index) => (
                                <div key={user.userId} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-700 font-bold text-sm">
                                            #{index + 1}
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{user.email}</p>
                                            <p className="text-xs text-muted-foreground">
                                                Joined: {new Date(user.purchasedAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-lg">{user.downloads}</p>
                                        <p className="text-xs text-muted-foreground">downloads</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Purchases */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Crown className="h-5 w-5 text-amber-500" />
                            Recent Purchases
                        </CardTitle>
                        <CardDescription>Last 10 premium upgrades</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {stats.recentPurchases.map((purchase) => (
                                <div key={purchase.userId} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                                    <div>
                                        <p className="font-medium text-sm">{purchase.email}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(purchase.purchasedAt).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {purchase.refundRequested && (
                                            <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                                                Refund Requested
                                            </span>
                                        )}
                                        <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded font-medium">
                                            R$ 50
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Downloads by Date */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="h-5 w-5 text-blue-600" />
                            Downloads by Date
                        </CardTitle>
                        <CardDescription>Premium user downloads over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {stats.downloadsByDate.slice(-14).map((item) => (
                                <div key={item.date} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded">
                                    <span className="text-sm font-medium">{new Date(item.date).toLocaleDateString()}</span>
                                    <div className="flex items-center gap-3">
                                        <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500"
                                                style={{
                                                    width: `${Math.min((item.count / Math.max(...stats.downloadsByDate.map(d => d.count))) * 100, 100)}%`
                                                }}
                                            />
                                        </div>
                                        <span className="text-sm font-bold w-12 text-right">{item.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

