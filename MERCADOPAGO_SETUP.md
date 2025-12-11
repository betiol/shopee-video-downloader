# Configuração do Mercado Pago para Pagamentos PIX

Este guia explica como configurar o Mercado Pago para aceitar pagamentos via PIX no seu aplicativo.

## Credenciais Fornecidas

Você forneceu as seguintes credenciais do Mercado Pago:

- **Public Key**: `APP_USR-ef4506bb-acc1-44d6-8582-968ec5ee92c1`
- **Access Token**: `APP_USR-7672912659285625-121021-d96d495ccdfac8e125280fa51c56b482-224369150`
- **Client ID**: `7672912659285625`
- **Client Secret**: `ucfr1CKfoiYr9fhD4rEZzDi44YpiGlE8`

## Passo 1: Configurar Variáveis de Ambiente

Adicione as seguintes variáveis ao seu arquivo `.env.local`:

```bash
# Mercado Pago Configuration (for PIX payments)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-7672912659285625-121021-d96d495ccdfac8e125280fa51c56b482-224369150
NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY=APP_USR-ef4506bb-acc1-44d6-8582-968ec5ee92c1
```

## Passo 2: Configurar Webhook do Mercado Pago

1. Acesse o [Painel do Mercado Pago](https://www.mercadopago.com.br/developers/panel)
2. Vá em **Suas integrações** → **Webhooks**
3. Clique em **Configurar notificações**
4. Configure o webhook com a seguinte URL:
   ```
   https://seu-dominio.com/api/mercadopago/webhook
   ```
5. Selecione os eventos que deseja receber:
   - ✅ **Pagamentos** (payments)
   - ✅ **Merchant Orders** (merchant_orders)

## Passo 3: Testar a Integração

### Modo de Teste

Para testar em modo sandbox:

1. Use as credenciais de teste fornecidas pelo Mercado Pago
2. Acesse a aplicação e selecione "PIX" como método de pagamento
3. Um QR Code de teste será gerado
4. Use o app do Mercado Pago em modo sandbox para simular o pagamento

### Modo de Produção

1. Certifique-se de estar usando as credenciais de produção (fornecidas acima)
2. Teste com um pagamento real de baixo valor
3. Verifique se o webhook está recebendo as notificações corretamente
4. Confirme que o usuário é atualizado para premium após o pagamento

## Fluxo de Pagamento PIX

1. **Usuário clica em "Upgrade"** → Seleciona "PIX" como método de pagamento
2. **Sistema cria preferência** → Endpoint `/api/mercadopago/checkout` cria uma preferência de pagamento
3. **QR Code é gerado** → Mercado Pago retorna QR Code e código copia-e-cola
4. **Usuário paga** → Escaneia QR Code ou cola código no app do banco
5. **Webhook notifica** → Mercado Pago envia notificação para `/api/mercadopago/webhook`
6. **Usuário é atualizado** → Sistema atualiza usuário para premium no Firebase
7. **Email é enviado** → Email de confirmação é enviado via Resend

## Estrutura de Arquivos Criados

```
/lib/mercadopago.ts                          # Cliente do Mercado Pago
/app/api/mercadopago/checkout/route.ts       # Criar preferência PIX
/app/api/mercadopago/webhook/route.ts        # Processar notificações
/app/api/mercadopago/payment-status/route.ts # Verificar status do pagamento
/components/pix-payment.tsx                  # Componente de pagamento PIX
/components/upgrade-modal.tsx                # Modal atualizado com seleção de método
```

## Diferenças entre Stripe e Mercado Pago

| Aspecto                 | Stripe                                   | Mercado Pago                    |
| ----------------------- | ---------------------------------------- | ------------------------------- |
| **Método de Pagamento** | Cartão, Boleto                           | PIX                             |
| **Confirmação**         | Imediata (cartão) ou assíncrona (boleto) | Imediata                        |
| **Webhook**             | `/api/stripe/webhook`                    | `/api/mercadopago/webhook`      |
| **Evento Principal**    | `checkout.session.completed`             | `payment` com status `approved` |
| **Identificação**       | `paymentIntentId`                        | `paymentId`                     |

## Troubleshooting

### Webhook não está recebendo notificações

1. Verifique se a URL do webhook está correta
2. Certifique-se de que a URL é HTTPS (não HTTP)
3. Verifique os logs do Mercado Pago no painel
4. Teste manualmente com ferramentas como Postman

### QR Code não está sendo exibido

1. Verifique se o `preferenceId` está sendo retornado corretamente
2. Confirme que o endpoint `/api/mercadopago/payment-status` está funcionando
3. Verifique os logs do console do navegador

### Pagamento não atualiza o usuário

1. Verifique se o webhook está sendo chamado
2. Confirme que o `userId` está nos metadados do pagamento
3. Verifique os logs do servidor para erros no Firebase

## Segurança

- ✅ Access Token é mantido no servidor (variável de ambiente)
- ✅ Webhook valida a origem das notificações
- ✅ Autenticação Firebase é necessária para criar pagamentos
- ✅ Dados sensíveis não são expostos ao cliente

## Próximos Passos

1. ✅ Adicionar variáveis de ambiente
2. ✅ Configurar webhook no painel do Mercado Pago
3. ✅ Testar em modo sandbox
4. ✅ Testar em produção com pagamento real
5. ✅ Monitorar logs e métricas
6. ✅ Configurar alertas para falhas de pagamento

## Suporte

Para dúvidas sobre a integração do Mercado Pago:

- [Documentação Oficial](https://www.mercadopago.com.br/developers/pt/docs)
- [Suporte Mercado Pago](https://www.mercadopago.com.br/developers/pt/support)
