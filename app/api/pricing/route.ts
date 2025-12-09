import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        // TEST MODE: Allow manual country override via query param
        const { searchParams } = new URL(request.url);
        const testCountry = searchParams.get('country');
        
        // Detectar país do usuário
        const country = testCountry || await detectUserCountry(request);
        
        // Definir preço baseado no país
        const isBrazil = country === 'BR';
        
        const pricing = {
            amount: isBrazil ? 30 : 100,
            currency: 'BRL',
            display: isBrazil ? 'R$ 30' : 'R$ 100',
            country: country,
            priceId: isBrazil 
                ? process.env.STRIPE_PRICE_BR 
                : process.env.STRIPE_PRICE_INTL,
        };
        
        console.log(`[Pricing] Country: ${country}, Price: ${pricing.display}${testCountry ? ' (TEST MODE)' : ''}`);
        
        return NextResponse.json(pricing);
    } catch (error) {
        console.error("Error fetching pricing:", error);
        // Fallback para preço brasileiro em caso de erro
        return NextResponse.json({
            amount: 30,
            currency: 'BRL',
            display: 'R$ 30',
            country: 'BR',
            priceId: process.env.STRIPE_PRICE_BR,
        });
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
                }
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
