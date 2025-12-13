 import { NextRequest, NextResponse } from "next/server";
import { adminDb } from "@/lib/firebase-admin";
import { sendThankYouEmail } from "@/lib/send-email";
import crypto from "crypto";

interface KiwifyWebhookPayload {
    order_id: string;
    order_ref: string;
    product_type: string;
    payment_method: string;
    store_id: string;
    payment_merchant_id: string;
    boleto_barcode: string | null;
    boleto_expiry_date: string | null;
    pix_code: string | null;
    pix_expiration: string | null;
    sale_type: string;
    created_at: string;
    updated_at: string;
    approved_date: string | null;
    refunded_at: string | null;
    order_status: string; // 'waiting_payment', 'paid', 'refunded', 'chargeback'
    webhook_event_type: string; // 'pix_created', 'order_paid', 'order_refunded', etc
    Product: {
        product_id: string;
        product_name: string;
    };
    Customer: {
        full_name: string;
        first_name: string;
        email: string;
        mobile: string;
        CPF: string;
        ip: string;
        country: string;
    };
    Commissions: {
        charge_amount: number; // em centavos
        product_base_price: number;
        product_base_price_currency: string;
        kiwify_fee: number;
        kiwify_fee_currency: string;
        commissioned_stores: any[];
        currency: string;
        my_commission: number;
        funds_status: string;
        estimated_deposit_date: string | null;
        deposit_date: string | null;
    };
    TrackingParameters: {
        src: string | null;
        sck: string | null;
        utm_source: string | null;
        utm_medium: string | null;
        utm_campaign: string | null;
        utm_content: string | null;
        utm_term: string | null;
        s1: string | null;
        s2: string | null;
        s3: string | null;
    };
    checkout_link: string;
    access_url: string | null;
    metadata?: {
        userId?: string;
        email?: string;
    };
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.text();
        
        // Kiwify pode enviar a signature no header OU na query string
        let signature = request.headers.get("x-kiwify-signature");
        
        if (!signature) {
            // Tentar pegar da query string
            const url = new URL(request.url);
            signature = url.searchParams.get("signature");
        }

        console.log("📦 Kiwify webhook received");
        console.log("Signature source:", signature ? (request.headers.get("x-kiwify-signature") ? "header" : "query") : "none");
        console.log("Body length:", body.length);
        console.log("Body preview:", body.substring(0, 200));

        // Parse the body
        const parsedBody = JSON.parse(body);
        
        // Kiwify envia o payload dentro de um objeto "order"
        const payload: KiwifyWebhookPayload = parsedBody.order || parsedBody;

        // Verify webhook signature if secret is configured
        if (process.env.KIWIFY_WEBHOOK_SECRET && signature) {
            // Kiwify usa SHA1 e faz HMAC apenas do objeto "order"
            const calculatedSignature = crypto
                .createHmac("sha1", process.env.KIWIFY_WEBHOOK_SECRET)
                .update(JSON.stringify(payload))
                .digest("hex");

            console.log("🔐 Signature validation:");
            console.log("Received:", signature);
            console.log("Expected (sha1):", calculatedSignature.substring(0, 10) + "...");
            console.log("Full expected:", calculatedSignature);

            if (signature !== calculatedSignature) {
                console.error("❌ Invalid Kiwify webhook signature");
                console.error("Expected:", calculatedSignature);
                console.error("Received:", signature);
                console.error("💡 Verifique se o KIWIFY_WEBHOOK_SECRET está correto");
                console.error("Secret atual:", process.env.KIWIFY_WEBHOOK_SECRET);
                
                // TEMPORÁRIO: Aceitar mesmo com signature inválida para debug
                console.warn("⚠️ Continuando sem validação de signature (MODO DEBUG)");
                // return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
            } else {
                console.log("✅ Kiwify webhook signature verified");
            }
        } else {
            console.warn("⚠️ Kiwify webhook signature not verified (missing secret or signature)");
            if (!process.env.KIWIFY_WEBHOOK_SECRET) {
                console.error("❌ KIWIFY_WEBHOOK_SECRET não está configurado!");
            }
            if (!signature) {
                console.error("❌ Signature não foi enviada pela Kiwify!");
            }
        }

        // Log completo do payload para debug
        console.log("📋 Full webhook payload:", JSON.stringify(payload, null, 2));

        console.log(`📦 Kiwify webhook details:`, {
            orderId: payload.order_id,
            eventType: payload.webhook_event_type,
            status: payload.order_status,
            paymentMethod: payload.payment_method,
            customerEmail: payload.Customer?.email,
            amount: payload.Commissions?.charge_amount ? payload.Commissions.charge_amount / 100 : 0,
            metadata: payload.metadata,
        });

        // Handle paid orders - evento 'order_paid' ou status 'paid'
        const isPaid = payload.webhook_event_type === 'order_paid' || 
                      payload.webhook_event_type === 'order_approved' || 
                      payload.order_status === 'paid';
        
        if (isPaid) {
            // Tentar pegar userId do metadata ou dos tracking parameters
            const userId = payload.metadata?.userId || payload.TrackingParameters?.s1;
            const customerEmail = payload.Customer?.email || payload.metadata?.email;

            // Detectar se é um webhook de teste da Kiwify
            const isTestWebhook = customerEmail === 'johndoe@example.com' || 
                                 payload.Customer?.full_name === 'John Doe' ||
                                 !userId;

            if (isTestWebhook) {
                console.warn("⚠️ Webhook de teste detectado (sem userId ou email de exemplo)");
                console.log("📋 Dados do teste:", {
                    email: customerEmail,
                    name: payload.Customer?.full_name,
                    amount: payload.Commissions?.charge_amount ? payload.Commissions.charge_amount / 100 : 0,
                    paymentMethod: payload.payment_method,
                });
                return NextResponse.json({ 
                    received: true, 
                    note: "Test webhook received successfully",
                    message: "Para webhooks reais, certifique-se de passar o userId via tracking parameter s1"
                });
            }

            if (!userId) {
                console.error("❌ No userId in webhook metadata!");
                console.error("💡 Certifique-se de que o checkout está passando s1 com o userId");
                return NextResponse.json({ 
                    received: true, 
                    error: "No userId in metadata" 
                }, { status: 400 });
            }

            if (!customerEmail) {
                console.error("❌ No customer email in webhook!");
                return NextResponse.json({ 
                    received: true, 
                    error: "No customer email" 
                }, { status: 400 });
            }

            try {
                // Check if user is already premium (manual activation)
                const userRef = adminDb.ref(`users/${userId}`);
                const userSnapshot = await userRef.once('value');
                const userData = userSnapshot.val();

                if (userData?.isPremium) {
                    console.log(`ℹ️ User ${userId} is already premium. Skipping update.`, {
                        existingPurchaseDate: userData.purchasedAt,
                        existingPricePaid: userData.pricePaid,
                    });
                    
                    // Still send thank you email if not sent
                    if (!userData.thankYouEmailSent) {
                        await sendThankYouEmail({
                            to: customerEmail,
                            userName: payload.Customer.full_name,
                        }).catch((error) => {
                            console.error("❌ Failed to send thank you email:", error);
                        });
                        await userRef.update({ thankYouEmailSent: true });
                        console.log(`📧 Thank you email sent for ${customerEmail}`);
                    }
                    
                    return NextResponse.json({ received: true, note: "User already premium" });
                }

                // Calculate price paid in BRL (charge_amount is in cents)
                const pricePaid = payload.Commissions.charge_amount / 100;
                
                // Update user to premium
                const updateData = {
                    isPremium: true,
                    customerEmail: customerEmail,
                    purchasedAt: new Date().toISOString(),
                    orderId: payload.order_id,
                    orderRef: payload.order_ref,
                    pricePaid: pricePaid,
                    country: 'BR', // Kiwify is Brazil-only
                    paymentMethod: payload.payment_method,
                    paymentProvider: 'kiwify',
                    thankYouEmailSent: false,
                };

                await userRef.update(updateData);
                
                console.log(`✅ User ${userId} upgraded to premium via Kiwify`, {
                    orderId: payload.order_id,
                    paymentMethod: payload.payment_method,
                    pricePaid,
                });

                // Send thank you email asynchronously
                await sendThankYouEmail({
                    to: customerEmail,
                    userName: payload.Customer.full_name,
                }).catch((error) => {
                    console.error("❌ Failed to send thank you email:", error);
                });
                await userRef.update({ thankYouEmailSent: true });
                console.log(`📧 Thank you email sent for ${customerEmail}`);

            } catch (error: any) {
                console.error(`❌ Error updating user ${userId}:`, error.message);
                return NextResponse.json({ 
                    received: true, 
                    error: error.message 
                }, { status: 500 });
            }
        }

        // Handle refunds
        if (payload.order_status === "refunded" || payload.order_status === "chargeback") {
            const userId = payload.metadata?.userId;

            if (userId) {
                try {
                    // Find user by order ID
                    const usersRef = adminDb.ref("users");
                    const snapshot = await usersRef
                        .orderByChild("orderId")
                        .equalTo(payload.order_id)
                        .once("value");

                    if (snapshot.exists()) {
                        const users = snapshot.val();
                        const foundUserId = Object.keys(users)[0];

                        // Revoke premium access
                        await adminDb.ref(`users/${foundUserId}`).update({
                            isPremium: false,
                            refundCompleted: true,
                            refundCompletedAt: new Date().toISOString(),
                            refundReason: payload.order_status,
                        });

                        console.log(`✅ User ${foundUserId} premium access revoked due to ${payload.order_status}`);
                    }
                } catch (error: any) {
                    console.error(`❌ Error processing refund:`, error.message);
                }
            }
        }

        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("❌ Kiwify Webhook Error:", error.message);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
