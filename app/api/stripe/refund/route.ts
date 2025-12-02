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

        // Get the payment intent from user data or search by email
        let paymentIntentId = userData?.paymentIntentId;

        // If paymentIntentId is not stored, try to find it by searching payments
        if (!paymentIntentId) {
            console.log(`Payment intent not found in user data for user ${userId}, searching by email: ${userEmail}`);
            
            try {
                // First, try to find payment intents directly by customer email
                const paymentIntents = await stripe.paymentIntents.list({
                    limit: 100,
                });

                // Find the most recent successful payment intent for this email
                let foundPaymentIntent = null;
                for (const pi of paymentIntents.data) {
                    if (pi.status === 'succeeded') {
                        // Get the charge to check the email
                        if (pi.latest_charge) {
                            const charge = await stripe.charges.retrieve(pi.latest_charge as string);
                            if (charge.billing_details?.email === userEmail) {
                                foundPaymentIntent = pi.id;
                                console.log(`Found payment intent via charges: ${foundPaymentIntent}`);
                                break;
                            }
                        }
                    }
                }

                // If not found, try searching checkout sessions
                if (!foundPaymentIntent) {
                    console.log('Payment intent not found in charges, searching checkout sessions...');
                    const sessions = await stripe.checkout.sessions.list({
                        limit: 100,
                    });

                    const userSession = sessions.data.find(
                        (session) => 
                            session.customer_email === userEmail && 
                            session.payment_status === 'paid' &&
                            session.metadata?.userId === userId
                    );

                    if (userSession && userSession.payment_intent) {
                        foundPaymentIntent = userSession.payment_intent as string;
                        console.log(`Found payment intent via checkout session: ${foundPaymentIntent}`);
                    }
                }

                if (foundPaymentIntent) {
                    paymentIntentId = foundPaymentIntent;
                    
                    // Store it for future use
                    await userRef.update({
                        paymentIntentId: paymentIntentId,
                    });
                    console.log(`Stored payment intent ${paymentIntentId} for user ${userId}`);
                } else {
                    console.error(`No payment found for user ${userId} with email ${userEmail}`);
                    return NextResponse.json(
                        { error: "No payment found for this user. Please contact support." },
                        { status: 404 }
                    );
                }
            } catch (searchError: any) {
                console.error('Error searching for payment:', searchError);
                return NextResponse.json(
                    { error: "Error finding payment information. Please contact support." },
                    { status: 500 }
                );
            }
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

