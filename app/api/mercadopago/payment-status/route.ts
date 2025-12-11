import { NextRequest, NextResponse } from "next/server";
import { mercadopagoPayment } from "@/lib/mercadopago";
import { adminAuth } from "@/lib/firebase-admin";

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get("Authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = authHeader.split("Bearer ")[1];
        await adminAuth.verifyIdToken(token);

        const { searchParams } = new URL(request.url);
        const paymentId = searchParams.get("paymentId");

        if (!paymentId) {
            return NextResponse.json(
                { error: "Payment ID is required" },
                { status: 400 }
            );
        }

        // Buscar status do pagamento
        const payment = await mercadopagoPayment.get({ id: paymentId });

        return NextResponse.json({
            status: payment.status,
            statusDetail: payment.status_detail,
            paymentMethodId: payment.payment_method_id,
            transactionAmount: payment.transaction_amount,
            qrCode: payment.point_of_interaction?.transaction_data?.qr_code,
            qrCodeBase64: payment.point_of_interaction?.transaction_data?.qr_code_base64,
            ticketUrl: payment.point_of_interaction?.transaction_data?.ticket_url,
        });
    } catch (error: any) {
        console.error("Error fetching payment status:", error);
        return NextResponse.json(
            { error: "Internal Server Error", details: error.message },
            { status: 500 }
        );
    }
}
