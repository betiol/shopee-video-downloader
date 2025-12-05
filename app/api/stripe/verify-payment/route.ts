import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { sendThankYouEmail } from "@/lib/send-email";

export async function POST(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];
        const decodedToken = await adminAuth.verifyIdToken(token);
        const userId = decodedToken.uid;

        const { sessionId } = await request.json();

        if (!sessionId) {
            return NextResponse.json({ error: "Missing sessionId" }, { status: 400 });
        }

        console.log(`🔍 Verifying payment for user ${userId}, session ${sessionId}`);

        // Retrieve the checkout session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        console.log(`📊 Session status:`, {
            sessionId: session.id,
            paymentStatus: session.payment_status,
            status: session.status,
        });

        // Check if payment was successful
        if (session.payment_status === "paid" && session.metadata?.userId === userId) {
            // Update user to premium
            const updateData: any = {
                isPremium: true,
                customerEmail: session.customer_email,
                purchasedAt: new Date().toISOString(),
                sessionId: session.id,
            };

            if (session.payment_intent) {
                updateData.paymentIntentId = session.payment_intent;
            }

            await adminDb.ref(`users/${userId}`).update(updateData);

            console.log(`✅ User ${userId} upgraded to premium via verify endpoint`);

            // Send thank you email asynchronously
            if (session.customer_email) {
                sendThankYouEmail({
                    to: session.customer_email,
                    userName: session.customer_details?.name || undefined,
                }).catch((error) => {
                    console.error("❌ Failed to send thank you email:", error);
                });
                console.log(`📧 Thank you email queued for ${session.customer_email}`);
            }

            return NextResponse.json({ 
                success: true, 
                isPremium: true,
                message: "Payment verified and user upgraded to premium"
            });
        } else if (session.payment_status === "paid" && session.metadata?.userId !== userId) {
            console.error(`❌ Session userId mismatch: ${session.metadata?.userId} !== ${userId}`);
            return NextResponse.json({ 
                error: "Session does not belong to this user" 
            }, { status: 403 });
        } else {
            return NextResponse.json({ 
                success: false, 
                isPremium: false,
                paymentStatus: session.payment_status,
                message: "Payment not completed"
            });
        }
    } catch (error: any) {
        console.error("Verify Payment Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}
