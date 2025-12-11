import { NextRequest, NextResponse } from "next/server";
import { mercadopagoPayment } from "@/lib/mercadopago";
import { adminDb } from "@/lib/firebase-admin";
import { sendThankYouEmail } from "@/lib/send-email";

async function handleWebhook(paymentId: string) {
    console.log(`🔍 Fetching payment details for ID: ${paymentId}`);

    // Buscar detalhes do pagamento
    const payment = await mercadopagoPayment.get({ id: paymentId });

    console.log("💳 Payment details:", {
        id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        payment_method_id: payment.payment_method_id,
        transaction_amount: payment.transaction_amount,
        metadata: payment.metadata,
    });

    // Verificar se o pagamento foi aprovado
    if (payment.status === "approved") {
        const userId = payment.metadata?.user_id as string;
        const userEmail = payment.metadata?.user_email as string;

        if (!userId) {
            console.error("❌ No userId in payment metadata!");
            return { success: false, error: "No userId" };
        }

        try {
            // Atualizar usuário para premium
            const updateData = {
                isPremium: true,
                customerEmail: userEmail || payment.payer?.email,
                purchasedAt: new Date().toISOString(),
                paymentId: payment.id?.toString(),
                pricePaid: payment.transaction_amount || 1,
                country: "BR",
                paymentMethod: "mercadopago_pix",
            };

            await adminDb.ref(`users/${userId}`).update(updateData);

            console.log(`✅ User ${userId} upgraded to premium via PIX`, {
                paymentId: payment.id,
                amount: payment.transaction_amount,
            });

            // Enviar email de agradecimento
            if (userEmail || payment.payer?.email) {
                const email = userEmail || payment.payer?.email || "";
                sendThankYouEmail({
                    to: email,
                    userName: payment.payer?.first_name || undefined,
                }).catch((error) => {
                    console.error("❌ Failed to send thank you email:", error);
                });
                console.log(`📧 Thank you email queued for ${email}`);
            }

            return { success: true };
        } catch (error: any) {
            console.error(`❌ Error updating user ${userId}:`, error.message);
            return { success: false, error: error.message };
        }
    } else if (payment.status === "refunded") {
        // Pagamento foi reembolsado - revogar acesso premium
        const userId = payment.metadata?.user_id as string;

        if (!userId) {
            console.error("❌ No userId in payment metadata for refund!");
            return { success: false, error: "No userId" };
        }

        try {
            await adminDb.ref(`users/${userId}`).update({
                isPremium: false,
                refundCompleted: true,
                refundCompletedAt: new Date().toISOString(),
                refundPaymentId: payment.id?.toString(),
            });

            console.log(`🔄 User ${userId} premium access revoked due to refund`, {
                paymentId: payment.id,
                amount: payment.transaction_amount,
            });

            return { success: true };
        } catch (error: any) {
            console.error(`❌ Error revoking premium for user ${userId}:`, error.message);
            return { success: false, error: error.message };
        }
    } else if (payment.status === "cancelled" || payment.status === "rejected") {
        console.log(`⚠️ Payment ${paymentId} was ${payment.status}`);
    } else {
        console.log(`⏳ Payment ${paymentId} is ${payment.status}`);
    }

    return { success: true };
}

export async function POST(request: NextRequest) {
    try {
        // Log headers para debug
        console.log("📦 Mercado Pago Webhook headers:", {
            contentType: request.headers.get("content-type"),
            userAgent: request.headers.get("user-agent"),
        });

        let body;
        const contentType = request.headers.get("content-type") || "";
        
        // Mercado Pago pode enviar como JSON ou form-urlencoded
        if (contentType.includes("application/json")) {
            body = await request.json();
        } else {
            // Se for form-urlencoded ou outro formato
            const text = await request.text();
            console.log("📦 Raw webhook body:", text);
            
            // Tentar parsear como JSON
            try {
                body = JSON.parse(text);
            } catch {
                // Se não for JSON, pode ser query string
                const params = new URLSearchParams(text);
                body = {
                    type: params.get("type"),
                    action: params.get("action"),
                    data: {
                        id: params.get("data.id") || params.get("id"),
                    },
                };
            }
        }
        
        console.log("📦 Mercado Pago Webhook received:", {
            type: body.type,
            action: body.action,
            data: body.data,
            fullBody: JSON.stringify(body),
        });

        // Mercado Pago envia notificações de diferentes tipos
        // Estamos interessados em "payment" notifications
        if (body.type !== "payment") {
            console.log(`⚠️ Ignoring webhook type: ${body.type}`);
            return NextResponse.json({ received: true });
        }

        const paymentId = body.data?.id || body.id;
        if (!paymentId) {
            console.error("❌ No payment ID in webhook data");
            return NextResponse.json({ error: "No payment ID" }, { status: 400 });
        }

        await handleWebhook(paymentId);
        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("❌ Mercado Pago Webhook Error:", {
            message: error.message,
            stack: error.stack,
        });
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const paymentId = searchParams.get("id") || searchParams.get("data.id");
        const type = searchParams.get("type");

        console.log("📦 Mercado Pago Webhook GET received:", {
            type,
            paymentId,
            allParams: Object.fromEntries(searchParams.entries()),
        });

        if (type !== "payment") {
            console.log(`⚠️ Ignoring webhook type: ${type}`);
            return NextResponse.json({ received: true });
        }

        if (!paymentId) {
            console.error("❌ No payment ID in webhook data");
            return NextResponse.json({ error: "No payment ID" }, { status: 400 });
        }

        await handleWebhook(paymentId);
        return NextResponse.json({ received: true });
    } catch (error: any) {
        console.error("❌ Mercado Pago Webhook GET Error:", {
            message: error.message,
            stack: error.stack,
        });
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
