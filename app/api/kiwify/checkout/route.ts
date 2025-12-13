import { NextRequest, NextResponse } from "next/server";
import { adminAuth } from "@/lib/firebase-admin";

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await adminAuth.verifyIdToken(token);
        const userId = decodedToken.uid;
        const userEmail = decodedToken.email;

        if (!process.env.KIWIFY_PRODUCT_ID) {
            console.error("Missing KIWIFY_PRODUCT_ID in environment variables");
            return NextResponse.json(
                { error: "Server configuration error: Missing Kiwify Product ID" },
                { status: 500 }
            );
        }

        // Kiwify checkout URL with user data
        const checkoutUrl = new URL(`https://pay.kiwify.com.br/${process.env.KIWIFY_PRODUCT_ID}`);
        
        // Add user data as query parameters
        // Kiwify não suporta metadata customizado, então usamos tracking parameters
        checkoutUrl.searchParams.set('email', userEmail || '');
        checkoutUrl.searchParams.set('s1', userId); // userId no tracking parameter s1
        checkoutUrl.searchParams.set('s2', userEmail || ''); // email backup no s2
        
        console.log(`Creating Kiwify checkout for user ${userEmail} (${userId})`);
        console.log(`Checkout URL: ${checkoutUrl.toString()}`);

        return NextResponse.json({ 
            url: checkoutUrl.toString(),
            provider: 'kiwify'
        });
    } catch (error) {
        console.error("Kiwify Checkout Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
