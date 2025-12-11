"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TestPricingPage() {
    const [pricing, setPricing] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const testCountry = async (country?: string) => {
        setLoading(true);
        setError("");
        try {
            const url = country ? `/api/pricing?country=${country}` : '/api/pricing';
            const response = await fetch(url);
            const data = await response.json();
            setPricing(data);
            console.log('Pricing response:', data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        testCountry();
    }, []);

    return (
        <div className="min-h-screen p-8 bg-slate-50">
            <div className="max-w-4xl mx-auto space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>🧪 Teste de Precificação Dinâmica</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex gap-2 flex-wrap">
                            <Button onClick={() => testCountry()}>
                                Auto Detect
                            </Button>
                            <Button onClick={() => testCountry('BR')} variant="outline">
                                🇧🇷 Brasil
                            </Button>
                            <Button onClick={() => testCountry('US')} variant="outline">
                                🇺🇸 USA
                            </Button>
                            <Button onClick={() => testCountry('PT')} variant="outline">
                                🇵🇹 Portugal
                            </Button>
                            <Button onClick={() => testCountry('AR')} variant="outline">
                                🇦🇷 Argentina
                            </Button>
                        </div>

                        {loading && <p className="text-muted-foreground">Carregando...</p>}
                        {error && <p className="text-red-600">Erro: {error}</p>}

                        {pricing && (
                            <div className="space-y-4 mt-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-white rounded-lg border">
                                        <p className="text-sm text-muted-foreground">País Detectado</p>
                                        <p className="text-2xl font-bold">{pricing.country}</p>
                                    </div>
                                    <div className="p-4 bg-white rounded-lg border">
                                        <p className="text-sm text-muted-foreground">Preço</p>
                                        <p className="text-2xl font-bold text-green-600">{pricing.display}</p>
                                    </div>
                                    <div className="p-4 bg-white rounded-lg border">
                                        <p className="text-sm text-muted-foreground">Valor (número)</p>
                                        <p className="text-2xl font-bold">{pricing.amount}</p>
                                    </div>
                                    <div className="p-4 bg-white rounded-lg border">
                                        <p className="text-sm text-muted-foreground">Moeda</p>
                                        <p className="text-2xl font-bold">{pricing.currency}</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-slate-100 rounded-lg">
                                    <p className="text-sm font-medium mb-2">Price ID:</p>
                                    <code className="text-xs bg-white p-2 rounded block break-all">
                                        {pricing.priceId || 'N/A'}
                                    </code>
                                </div>

                                <div className="p-4 bg-slate-100 rounded-lg">
                                    <p className="text-sm font-medium mb-2">JSON Completo:</p>
                                    <pre className="text-xs bg-white p-2 rounded overflow-auto">
                                        {JSON.stringify(pricing, null, 2)}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>📋 Checklist de Debug</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2 text-sm">
                            <li className="flex items-start gap-2">
                                <span className="text-green-600">✓</span>
                                <span>API de pricing está respondendo?</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600">✓</span>
                                <span>País está sendo detectado corretamente?</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-green-600">✓</span>
                                <span>Price ID está correto?</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600">⚠️</span>
                                <span>Verifique os logs do servidor no terminal</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-amber-600">⚠️</span>
                                <span>Teste fazer um checkout completo</span>
                            </li>
                        </ul>
                    </CardContent>
                </Card>

                <Card className="border-amber-200 bg-amber-50">
                    <CardHeader>
                        <CardTitle className="text-amber-900">⚠️ Possíveis Problemas</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm space-y-2 text-amber-900">
                        <p><strong>1. Env vars não configuradas:</strong> STRIPE_PRICE_BR e STRIPE_PRICE_INTL</p>
                        <p><strong>2. Detecção sempre retorna BR:</strong> Localhost sempre cai no fallback</p>
                        <p><strong>3. Modal não carrega preço:</strong> Erro na API de pricing</p>
                        <p><strong>4. Checkout falha:</strong> Price ID inválido no Stripe</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
