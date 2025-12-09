import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

const ADMIN_EMAIL = "nikollasdev@gmail.com";

export async function GET(request: NextRequest) {
    try {
        // Verify authentication
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await adminAuth.verifyIdToken(token);
        
        // Check if user is admin
        if (decodedToken.email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
        }

        // Fetch all users
        const usersSnapshot = await adminDb.ref("users").once("value");
        const users = usersSnapshot.val() || {};

        // Calculate statistics
        let totalUsers = 0;
        let premiumUsers = 0;
        let freeUsers = 0;
        let totalPremiumDownloads = 0;
        let totalFreeDownloads = 0;
        let totalRevenue = 0;
        const topPremiumUsers: any[] = [];
        const recentPurchases: any[] = [];
        const downloadsByDate: { [key: string]: number } = {};

        Object.entries(users).forEach(([userId, userData]: [string, any]) => {
            totalUsers++;

            if (userData.isPremium) {
                premiumUsers++;
                const downloads = userData.premiumDownloads || 0;
                totalPremiumDownloads += downloads;

                // Track top users
                topPremiumUsers.push({
                    userId,
                    email: userData.customerEmail || "N/A",
                    downloads,
                    purchasedAt: userData.purchasedAt,
                });

                // Track recent purchases
                if (userData.purchasedAt) {
                    recentPurchases.push({
                        userId,
                        email: userData.customerEmail || "N/A",
                        purchasedAt: userData.purchasedAt,
                        refundRequested: userData.refundRequested || false,
                        pricePaid: userData.pricePaid || 30,
                        country: userData.country || 'BR',
                    });
                }

                // Calculate revenue (actual price paid, defaults to R$30 for old purchases)
                if (!userData.refundCompleted) {
                    // Try to get actual price from purchase metadata, fallback to R$30
                    const pricePaid = userData.pricePaid || 30;
                    totalRevenue += pricePaid;
                }

                // Aggregate downloads by date
                if (userData.premiumDownloadsByDate) {
                    Object.entries(userData.premiumDownloadsByDate).forEach(([date, count]: [string, any]) => {
                        downloadsByDate[date] = (downloadsByDate[date] || 0) + count;
                    });
                }
            } else {
                freeUsers++;
                // Count free user downloads
                if (userData.usage) {
                    Object.values(userData.usage).forEach((count: any) => {
                        totalFreeDownloads += count || 0;
                    });
                }
            }
        });

        // Sort top users by downloads
        topPremiumUsers.sort((a, b) => b.downloads - a.downloads);
        const top10Users = topPremiumUsers.slice(0, 10);

        // Sort recent purchases
        recentPurchases.sort((a, b) => 
            new Date(b.purchasedAt).getTime() - new Date(a.purchasedAt).getTime()
        );
        const recent10Purchases = recentPurchases.slice(0, 10);

        // Convert downloads by date to array and sort
        const downloadsByDateArray = Object.entries(downloadsByDate)
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));

        // Calculate conversion rate
        const conversionRate = totalUsers > 0 ? (premiumUsers / totalUsers) * 100 : 0;

        // Calculate average downloads per premium user
        const avgDownloadsPerPremium = premiumUsers > 0 ? totalPremiumDownloads / premiumUsers : 0;

        return NextResponse.json({
            overview: {
                totalUsers,
                premiumUsers,
                freeUsers,
                conversionRate: conversionRate.toFixed(2),
                totalRevenue,
                totalPremiumDownloads,
                totalFreeDownloads,
                avgDownloadsPerPremium: avgDownloadsPerPremium.toFixed(2),
            },
            topUsers: top10Users,
            recentPurchases: recent10Purchases,
            downloadsByDate: downloadsByDateArray,
        });
    } catch (error: any) {
        console.error("Admin stats error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

