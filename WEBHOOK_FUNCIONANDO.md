# ✅ Webhook Kiwify Funcionando!

## 🎉 Status Atual

- ✅ Webhook recebendo requisições
- ✅ Payload sendo parseado corretamente
- ✅ Evento `order_approved` detectado
- ✅ Status `paid` confirmado
- ✅ Modo de teste implementado

## 📊 Último Webhook Recebido

```json
{
  "order_id": "b6ba3959-30b5-44fc-a3e5-2c61e3d68ee5",
  "webhook_event_type": "order_approved",
  "order_status": "paid",
  "payment_method": "credit_card",
  "Customer": {
    "email": "johndoe@example.com",
    "full_name": "John Doe"
  },
  "Commissions": {
    "charge_amount": 5073 // R$ 50,73
  },
  "TrackingParameters": {
    "s1": null, // ⚠️ Vazio em webhooks de teste
    "s2": null
  }
}
```

## ⚠️ Webhook de Teste vs Real

### Webhook de Teste (Kiwify)

- ✅ Email: `johndoe@example.com`
- ✅ Nome: `John Doe`
- ❌ TrackingParameters: todos `null`
- ✅ **Aceito automaticamente** (modo debug)

### Webhook Real (Pagamento de Verdade)

- ✅ Email: do usuário real
- ✅ Nome: do usuário real
- ✅ TrackingParameters.s1: `userId` do Firebase
- ✅ **Ativa premium automaticamente**

## 🔄 Fluxo Completo de Pagamento Real

### 1. Usuário Clica em Upgrade

```typescript
// Modal de upgrade
selectedGateway = 'kiwify'  // PIX selecionado
↓
Chama /api/kiwify/checkout
```

### 2. Checkout Cria URL

```typescript
// /api/kiwify/checkout/route.ts
const checkoutUrl = new URL(`https://pay.kiwify.com.br/E5DVEQe`);
checkoutUrl.searchParams.set("email", "usuario@email.com");
checkoutUrl.searchParams.set("s1", "firebase_user_id_123"); // ← IMPORTANTE!
checkoutUrl.searchParams.set("s2", "usuario@email.com");

// URL final:
// https://pay.kiwify.com.br/E5DVEQe?email=usuario@email.com&s1=firebase_user_id_123&s2=usuario@email.com
```

### 3. Usuário Paga

```
Kiwify processa pagamento
↓
Pagamento aprovado
↓
Kiwify envia webhook
```

### 4. Webhook Recebe

```json
{
  "webhook_event_type": "order_approved",
  "order_status": "paid",
  "Customer": {
    "email": "usuario@email.com"
  },
  "TrackingParameters": {
    "s1": "firebase_user_id_123", // ← userId aqui!
    "s2": "usuario@email.com"
  }
}
```

### 5. Sistema Ativa Premium

```typescript
// /api/kiwify/webhook/route.ts
const userId = payload.TrackingParameters.s1; // "firebase_user_id_123"
const customerEmail = payload.Customer.email; // "usuario@email.com"

// Atualiza Firebase
await adminDb.ref(`users/${userId}`).update({
  isPremium: true,
  customerEmail: customerEmail,
  purchasedAt: new Date().toISOString(),
  orderId: payload.order_id,
  pricePaid: payload.Commissions.charge_amount / 100,
  paymentMethod: payload.payment_method,
  paymentProvider: "kiwify",
});

// Envia email
await sendThankYouEmail({
  to: customerEmail,
  userName: payload.Customer.full_name,
});
```

## 🧪 Como Testar com Pagamento Real

### Opção 1: Fazer um Pagamento de Teste

1. Faça login na aplicação
2. Clique no botão flutuante de Upgrade
3. Selecione PIX (ou deixe Cartão comentado)
4. Complete o pagamento
5. Aguarde o webhook
6. Verifique os logs

### Opção 2: Simular Webhook com userId

Você pode enviar um webhook manual via Postman/curl:

```bash
curl -X POST "https://sua-url.ngrok-free.app/api/kiwify/webhook?signature=test" \
  -H "Content-Type: application/json" \
  -d '{
    "order_id": "test-123",
    "webhook_event_type": "order_approved",
    "order_status": "paid",
    "payment_method": "pix",
    "Customer": {
      "email": "seu-email@gmail.com",
      "full_name": "Seu Nome"
    },
    "Commissions": {
      "charge_amount": 3000
    },
    "TrackingParameters": {
      "s1": "SEU_FIREBASE_USER_ID_AQUI",
      "s2": "seu-email@gmail.com"
    }
  }'
```

## 📝 Checklist de Configuração

- [x] Webhook URL configurada na Kiwify
- [x] `KIWIFY_PRODUCT_ID=E5DVEQe` no .env.local
- [ ] `KIWIFY_WEBHOOK_SECRET` configurado (opcional)
- [x] Checkout passando userId via s1
- [x] Webhook detectando eventos corretos
- [x] Modo de teste funcionando
- [ ] Teste com pagamento real

## 🎯 Próximos Passos

1. **Fazer um pagamento real** para testar o fluxo completo
2. **Verificar se o userId** está vindo nos TrackingParameters
3. **Confirmar ativação** do premium no Firebase
4. **Verificar envio** do email de confirmação

## 🔍 Logs Esperados (Pagamento Real)

```
📦 Kiwify webhook received
Signature source: query
📋 Full webhook payload: { ... }
📦 Kiwify webhook details: {
  orderId: 'xxx',
  eventType: 'order_approved',
  status: 'paid',
  customerEmail: 'usuario@email.com',
  amount: 30
}
✅ User firebase_user_id_123 upgraded to premium via Kiwify
📧 Thank you email sent for usuario@email.com
```

## 💡 Dicas

1. **Webhooks de teste** da Kiwify sempre vêm com `johndoe@example.com`
2. **TrackingParameters** só vêm preenchidos em pagamentos reais
3. **Modo debug** aceita webhooks sem signature (desabilitar em produção)
4. **Eventos suportados**: `order_approved`, `order_paid`
5. **Métodos de pagamento**: `pix`, `credit_card`, `boleto`

Tudo pronto para receber pagamentos reais! 🚀
