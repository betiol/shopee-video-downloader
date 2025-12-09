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

        // Get query parameters
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const limit = parseInt(searchParams.get("limit") || "100");

        if (userId) {
            // Get URLs for specific user
            const urlsSnapshot = await adminDb
                .ref(`users/${userId}/downloadedUrls`)
                .orderByChild("timestamp")
                .limitToLast(limit)
                .once("value");
            
            const urls = urlsSnapshot.val() || {};
            const urlsArray = Object.entries(urls).map(([id, data]: [string, any]) => ({
                id,
                ...data,
            })).reverse(); // Most recent first

            // Get user info
            const userSnapshot = await adminDb.ref(`users/${userId}`).once("value");
            const userData = userSnapshot.val() || {};

            return NextResponse.json({
                userId,
                userEmail: userData.customerEmail || "N/A",
                isPremium: userData.isPremium || false,
                totalDownloads: userData.premiumDownloads || 0,
                urls: urlsArray,
            });
        } else {
            // Get all premium users with their download URLs
            const usersSnapshot = await adminDb.ref("users").once("value");
            const users = usersSnapshot.val() || {};

            const premiumUsersWithUrls: any[] = [];

            for (const [uid, userData] of Object.entries(users) as [string, any][]) {
                if (userData.isPremium && userData.downloadedUrls) {
                    const urlsArray = Object.entries(userData.downloadedUrls).map(([id, data]: [string, any]) => ({
                        id,
                        ...data,
                    }));

                    premiumUsersWithUrls.push({
                        userId: uid,
                        email: userData.customerEmail || "N/A",
                        totalDownloads: userData.premiumDownloads || 0,
                        urlCount: urlsArray.length,
                        recentUrls: urlsArray
                            .sort((a: any, b: any) => b.timestamp.localeCompare(a.timestamp))
                            .slice(0, 5), // Last 5 URLs
                    });
                }
            }

            // Sort by total downloads
            premiumUsersWithUrls.sort((a, b) => b.totalDownloads - a.totalDownloads);

            return NextResponse.json({
                totalPremiumUsers: premiumUsersWithUrls.length,
                users: premiumUsersWithUrls,
            });
        }
    } catch (error: any) {
        console.error("Admin premium URLs error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
