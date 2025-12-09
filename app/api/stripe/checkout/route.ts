import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
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

        // Detectar país do usuário
        const country = await detectUserCountry(request);
        const isBrazil = country === 'BR';
        
        // Selecionar price ID baseado no país
        const priceId = isBrazil 
            ? process.env.STRIPE_PRICE_BR 
            : process.env.STRIPE_PRICE_INTL;

        if (!priceId) {
            console.error(`Missing Stripe Price ID for country: ${country}`);
            return NextResponse.json(
                { error: "Server configuration error: Missing Price ID" },
                { status: 500 }
            );
        }

        console.log(`Creating checkout for user ${userEmail} from ${country} with price ${priceId}`);

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card", "boleto"],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${request.nextUrl.origin}/?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${request.nextUrl.origin}/?canceled=true`,
            customer_email: userEmail,
            metadata: {
                userId,
                country,
                priceId,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Checkout Error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

async function detectUserCountry(request: NextRequest): Promise<string> {
    // Método 1: Tentar pegar do header Cloudflare (se estiver usando Cloudflare)
    const cfCountry = request.headers.get('cf-ipcountry');
    if (cfCountry && cfCountry !== 'XX') {
        return cfCountry;
    }

    // Método 2: Tentar pegar do header Vercel (se estiver usando Vercel)
    const vercelCountry = request.headers.get('x-vercel-ip-country');
    if (vercelCountry) {
        return vercelCountry;
    }

    // Método 3: Usar API de geolocalização gratuita
    try {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                   request.headers.get('x-real-ip') ||
                   'unknown';
        
        if (ip !== 'unknown' && ip !== '127.0.0.1' && ip !== '::1') {
            const response = await fetch(`https://ipapi.co/${ip}/country_code/`, {
                headers: {
                    'User-Agent': 'Shopee-Video-Downloader/1.0'
                },
                signal: AbortSignal.timeout(2000), // 2 second timeout
            });
            
            if (response.ok) {
                const country = await response.text();
                if (country && country.length === 2) {
                    return country.trim();
                }
            }
        }
    } catch (error) {
        console.error("Error detecting country from IP:", error);
    }

    // Método 4: Fallback - tentar detectar pelo Accept-Language
    const acceptLanguage = request.headers.get('accept-language');
    if (acceptLanguage?.includes('pt-BR') || acceptLanguage?.includes('pt_BR')) {
        return 'BR';
    }

    // Fallback padrão: Brasil
    return 'BR';
}
