import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { adminAuth, adminDb } from "@/lib/firebase-admin";

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

        // Check if user is premium
        const userRef = adminDb.ref(`users/${userId}`);
        const userSnapshot = await userRef.once("value");
        const userData = userSnapshot.val();

        if (!userData?.isPremium) {
            return NextResponse.json(
                { error: "User is not premium" },
                { status: 400 }
            );
        }

        // Check if user already requested a refund
        if (userData?.refundRequested) {
            return NextResponse.json(
                { error: "Refund already requested" },
                { status: 400 }
            );
        }

        // Get the payment intent from user data
        const paymentIntentId = userData?.paymentIntentId;

        if (!paymentIntentId) {
            return NextResponse.json(
                { error: "No payment found for this user" },
                { status: 404 }
            );
        }

        // Create refund
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            reason: "requested_by_customer",
        });

        // Update user status
        await userRef.update({
            refundRequested: true,
            refundId: refund.id,
            refundStatus: refund.status,
            refundRequestedAt: new Date().toISOString(),
        });

        console.log(`Refund created for user ${userId}: ${refund.id}`);

        return NextResponse.json({
            success: true,
            refundId: refund.id,
            status: refund.status,
        });
    } catch (error: any) {
        console.error("Stripe Refund Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

