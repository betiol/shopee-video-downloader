import { getResend } from "./resend";
import { render } from "@react-email/render";
import ThankYouEmail from "@/emails/thank-you-email";

interface SendThankYouEmailParams {
    to: string;
    userName?: string;
}

export async function sendThankYouEmail({ to, userName }: SendThankYouEmailParams) {
    try {
        const resend = getResend();
        const emailHtml = await render(ThankYouEmail({ userEmail: to, userName }));

        const { data, error } = await resend.emails.send({
            from: process.env.RESEND_FROM_EMAIL || "Shopee Video Downloader <onboarding@resend.dev>",
            to: [to],
            subject: "🎉 Bem-vindo ao Premium - Shopee Video Downloader",
            html: emailHtml,
        });

        if (error) {
            console.error("❌ Error sending thank you email:", error);
            throw error;
        }

        console.log("✅ Thank you email sent successfully:", data);
        return data;
    } catch (error) {
        console.error("❌ Failed to send thank you email:", error);
        throw error;
    }
}
