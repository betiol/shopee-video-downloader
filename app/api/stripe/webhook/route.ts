import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { adminDb } from "@/lib/firebase-admin";
import { sendThankYouEmail } from "@/lib/send-email";
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
        const paymentIntentId = session.payment_intent;
        const paymentStatus = session.payment_status;

        console.log(`📦 Checkout session completed:`, {
            sessionId: session.id,
            userId,
            paymentIntentId,
            customerEmail: session.customer_email,
            paymentStatus,
            mode: session.mode,
        });

        if (!userId) {
            console.error("❌ No userId in session metadata!");
            return NextResponse.json({ received: true, error: "No userId" });
        }

        // For one-time payments, check if payment was successful
        // Payment can be 'paid', 'unpaid', or 'no_payment_required'
        if (paymentStatus !== "paid") {
            console.warn(`⚠️ Payment not completed yet. Status: ${paymentStatus}`);
            return NextResponse.json({ received: true, warning: "Payment not completed" });
        }

        try {
            // Update user to premium
            const updateData: any = {
                isPremium: true,
                customerEmail: session.customer_email,
                purchasedAt: new Date().toISOString(),
                sessionId: session.id,
            };

            // Add payment intent ID if available
            if (paymentIntentId) {
                updateData.paymentIntentId = paymentIntentId;
            }

            await adminDb.ref(`users/${userId}`).update(updateData);
            
            console.log(`✅ User ${userId} upgraded to premium`, {
                paymentIntentId: paymentIntentId || 'N/A',
                sessionId: session.id,
            });

            // Send thank you email asynchronously (don't wait for it)
            if (session.customer_email) {
                sendThankYouEmail({
                    to: session.customer_email,
                    userName: session.customer_details?.name || undefined,
                }).catch((error) => {
                    console.error("❌ Failed to send thank you email:", error);
                    // Don't throw - we don't want email failures to affect the webhook
                });
                console.log(`📧 Thank you email queued for ${session.customer_email}`);
            }
        } catch (error: any) {
            console.error(`❌ Error updating user ${userId}:`, error.message);
            return NextResponse.json({ received: true, error: error.message });
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
