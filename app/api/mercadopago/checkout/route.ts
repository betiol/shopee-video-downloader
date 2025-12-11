import { NextRequest, NextResponse } from "next/server";
import { mercadopagoPreference } from "@/lib/mercadopago";
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

        console.log(`Creating Mercado Pago checkout for user ${userEmail}`);

        // Criar preferência de pagamento PIX
        const session = await mercadopagoPreference.create({
            body: {
                items: [
                    {
                        id: "premium-lifetime",
                        title: "Shopee Video Downloader - Premium Vitalício",
                        description: "Acesso premium vitalício com downloads ilimitados",
                        quantity: 1,
                        unit_price: 1, // R$ 30
                        currency_id: "BRL",
                    },
                ],
                payment_methods: {
                    excluded_payment_types: [
                        { id: "credit_card" },
                        { id: "debit_card" },
                        { id: "ticket" }, // boleto
                    ],
                    installments: 1,
                },
                back_urls: {
                    success: `${request.nextUrl.origin}/?success=true`,
                    failure: `${request.nextUrl.origin}/?canceled=true`,
                    pending: `${request.nextUrl.origin}/?pending=true`,
                },
                notification_url: `${request.nextUrl.origin}/api/mercadopago/webhook`,
                statement_descriptor: "Shopee Downloader", // Nome que aparece no extrato/PIX (máx 22 caracteres)
                metadata: {
                    user_id: userId,
                    user_email: userEmail || "",
                },
                payer: {
                    email: userEmail || "",
                },
            },
        });

        console.log(`✅ Mercado Pago preference created: ${session.id}`);

        return NextResponse.json({
            preferenceId: session.id,
            initPoint: session.init_point,
            sandboxInitPoint: session.sandbox_init_point,
        });
    } catch (error: any) {
        console.error("Mercado Pago Checkout Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
