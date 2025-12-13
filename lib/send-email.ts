import { getResend } from "./resend";
import { render } from "@react-email/render";
import ThankYouEmail from "@/emails/thank-you-email";
import * as React from "react";

interface SendThankYouEmailParams {
    to: string;
    userName?: string;
}

export async function sendThankYouEmail({ to, userName }: SendThankYouEmailParams) {
    try {
        console.log(`📧 [Email] Starting to send thank you email to: ${to}`);
        
        // Validate env vars
        if (!process.env.RESEND_API_KEY) {
            console.error("❌ [Email] RESEND_API_KEY is not configured!");
            throw new Error("RESEND_API_KEY is missing");
        }

        const fromEmail = process.env.RESEND_FROM_EMAIL || "Shopee Video Downloader <no-reply@shopeevideodownloader.com>";
        console.log(`📧 [Email] From: ${fromEmail}`);

        const resend = getResend();
        
        console.log(`📧 [Email] Rendering email template...`);
        const emailHtml = await render(
            React.createElement(ThankYouEmail, { userEmail: to, userName })
        );
        console.log(`📧 [Email] Template rendered successfully`);

        console.log(`📧 [Email] Sending email via Resend...`);
        const { data, error } = await resend.emails.send({
            from: fromEmail,
            to: [to],
            replyTo: 'contato@shopeevideodownloader.com',
            subject: "🎉 Bem-vindo ao Premium - Shopee Video Downloader",
            html: emailHtml,
            headers: {
                'X-Entity-Ref-ID': `premium-${Date.now()}`,
            },
        });

        if (error) {
            console.error("❌ [Email] Resend API error:", JSON.stringify(error, null, 2));
            throw error;
        }

        console.log("✅ [Email] Thank you email sent successfully!", {
            id: data?.id,
            to: to,
        });
        return data;
    } catch (error: any) {
        console.error("❌ [Email] Failed to send thank you email:", {
            error: error.message,
            stack: error.stack,
            to: to,
        });
        throw error;
    }
}
