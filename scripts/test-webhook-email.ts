/**
 * Script para testar o envio de email localmente
 * 
 * Como usar:
 * 1. Certifique-se que o servidor está rodando (npm run dev)
 * 2. Execute: npx tsx scripts/test-webhook-email.ts
 */

async function testWebhookEmail() {
    console.log('🧪 Iniciando teste de webhook e email...\n');

    // Mock de um evento checkout.session.completed (cartão)
    const mockCardPaymentEvent = {
        type: 'checkout.session.completed',
        data: {
            object: {
                id: 'cs_test_mock_2444',
                object: 'checkout.session',
                amount_total: 3000, // R$ 30 em centavos
                customer_email: 'nikollasbetiol@gmail.com', // ⬅️ MUDE PARA SEU EMAIL!
                customer_details: {
                    name: 'Usuário Teste'
                },
                metadata: {
                    userId: 'test_user_123',
                    country: 'BR',
                    priceId: 'price_1SaqDiPWDOTHz0MXO0HtgTOH'
                },
                payment_intent: 'pi_test_mock_1241244',
                payment_status: 'paid',
                mode: 'payment'
            }
        }
    };

    // Mock de um evento async_payment_succeeded (boleto)
    const mockBoletoPaymentEvent = {
        type: 'checkout.session.async_payment_succeeded',
        data: {
            object: {
                id: 'cs_test_boleto_4423141',
                object: 'checkout.session',
                amount_total: 10000, // R$ 100 em centavos
                customer_email: 'nikollasbetiol@gmail.com', // ⬅️ MUDE PARA SEU EMAIL!
                customer_details: {
                    name: 'Usuário Teste Boleto'
                },
                metadata: {
                    userId: `test_user_${Date.now()}`, // ⬅️ Novo usuário a cada teste
                    country: 'BR',
                    priceId: 'price_1SaqDiPWDOTHz0MXO0HtgTOH'
                },
                payment_intent: 'pi_test_boleto_4124434',
                mode: 'payment'
            }
        }
    };

    console.log('📋 Escolha qual evento testar:');
    console.log('1. Pagamento com Cartão (checkout.session.completed)');
    console.log('2. Pagamento com Boleto (checkout.session.async_payment_succeeded)\n');

    // Para este teste, vamos usar o evento de boleto
    const eventToTest = mockBoletoPaymentEvent;
    console.log(`🎯 Testando: ${eventToTest.type}\n`);

    try {
        console.log('📤 Enviando requisição para webhook local...\n');

        const response = await fetch('http://localhost:3000/api/stripe/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Stripe signature - em produção isso é validado, mas para teste local vamos pular
                'stripe-signature': 'test_signature'
            },
            body: JSON.stringify(eventToTest)
        });

        const result = await response.json();

        console.log('📥 Resposta do webhook:');
        console.log('Status:', response.status);
        console.log('Body:', JSON.stringify(result, null, 2));

        if (response.ok) {
            console.log('\n✅ Webhook processado com sucesso!');
            console.log('\n📧 Verifique:');
            console.log('1. Os logs do servidor (terminal onde está rodando npm run dev)');
            console.log('2. Seu email (nikollasbetiol@gmail.com)');
            console.log('3. Dashboard do Resend: https://resend.com/emails');
        } else {
            console.log('\n❌ Erro ao processar webhook');
        }

    } catch (error: any) {
        console.error('\n❌ Erro ao testar webhook:', error.message);
        console.log('\n💡 Certifique-se que:');
        console.log('1. O servidor está rodando (npm run dev)');
        console.log('2. O servidor está em http://localhost:3000');
    }
}

// Executar teste
testWebhookEmail();
