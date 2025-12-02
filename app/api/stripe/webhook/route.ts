import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { adminDb } from "@/lib/firebase-admin";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
        if (!process.env.STRIPE_WEBHOOK_SECRET) {
            console.error("❌ STRIPE_WEBHOOK_SECRET is missing in environment variables");
            throw new Error("Server configuration error: Missing Webhook Secret");
        }

        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
        console.log("✅ Webhook verified successfully:", event.type);
    } catch (err: any) {
        console.error(`❌ Webhook Error: ${err.message}`);
        console.error(`Signature: ${signature?.substring(0, 10)}...`);
        console.error(`Secret exists: ${!!process.env.STRIPE_WEBHOOK_SECRET}`);
        return NextResponse.json({ error: err.message }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;

        if (userId) {
            // Update user to premium and store payment intent ID
            await adminDb.ref(`users/${userId}`).update({
                isPremium: true,
                paymentIntentId: session.payment_intent,
                purchasedAt: new Date().toISOString(),
            });
            console.log(`User ${userId} upgraded to premium`);
        }
    }

    if (event.type === "charge.refunded") {
        const charge = event.data.object as Stripe.Charge;
        const paymentIntentId = charge.payment_intent as string;

        // Find user by payment intent ID
        const usersRef = adminDb.ref("users");
        const snapshot = await usersRef
            .orderByChild("paymentIntentId")
            .equalTo(paymentIntentId)
            .once("value");

        if (snapshot.exists()) {
            const users = snapshot.val();
            const userId = Object.keys(users)[0];

            // Revoke premium access
            await adminDb.ref(`users/${userId}`).update({
                isPremium: false,
                refundCompleted: true,
                refundCompletedAt: new Date().toISOString(),
            });

            console.log(`User ${userId} premium access revoked due to refund`);
        }
    }

    return NextResponse.json({ received: true });
}
