import { Resend } from "resend";

let resendInstance: Resend | null = null;

export function getResend(): Resend {
    if (!resendInstance) {
        const resendKey = process.env.RESEND_API_KEY || "";

        if (!process.env.RESEND_API_KEY) {
            console.warn("⚠️ RESEND_API_KEY is missing. Email features will not work.");
        }

        resendInstance = new Resend(resendKey);
    }

    return resendInstance;
}
