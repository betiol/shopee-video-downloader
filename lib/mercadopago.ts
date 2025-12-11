import { MercadoPagoConfig, Payment, Preference } from 'mercadopago';

if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
    throw new Error('MERCADOPAGO_ACCESS_TOKEN is not defined');
}

// Inicializar o cliente do Mercado Pago
export const mercadopagoClient = new MercadoPagoConfig({
    accessToken: process.env.MERCADOPAGO_ACCESS_TOKEN,
});

export const mercadopagoPayment = new Payment(mercadopagoClient);
export const mercadopagoPreference = new Preference(mercadopagoClient);
