# ⚠️ AÇÃO NECESSÁRIA: Configurar Webhook para Boleto

## Problema Resolvido

✅ O código agora suporta pagamentos por boleto corretamente!

## O que foi feito:

1. ✅ Adicionado handler para `checkout.session.async_payment_succeeded`
2. ✅ Adicionado handler para `checkout.session.async_payment_failed`
3. ✅ Refatorado código para evitar duplicação
4. ✅ Melhorado logging para debug

## ⚠️ VOCÊ PRECISA FAZER ISSO NO STRIPE DASHBOARD:

### Passo 1: Acessar Webhooks

1. Vá para: https://dashboard.stripe.com/webhooks
2. Clique no seu webhook existente (ou crie um novo se não tiver)

### Passo 2: Adicionar Novos Eventos

Você DEVE adicionar estes eventos ao webhook:

**Eventos necessários:**

- ✅ `checkout.session.completed` (já deve ter)
- ✅ `checkout.session.async_payment_succeeded` ⬅️ **ADICIONAR ESTE!**
- ✅ `checkout.session.async_payment_failed` ⬅️ **ADICIONAR ESTE!**
- ✅ `charge.refunded` (já deve ter)

### Passo 3: Como Adicionar

1. Clique em "Add events" ou "Edit" no webhook
2. Procure por "checkout.session.async_payment_succeeded"
3. Marque a checkbox
4. Procure por "checkout.session.async_payment_failed"
5. Marque a checkbox
6. Clique em "Save"

---

## Como Funciona Agora:

### Pagamento com Cartão (Imediato):

```
1. Usuário clica em "Upgrade"
2. Paga com cartão
3. Stripe dispara: checkout.session.completed (paymentStatus: "paid")
4. ✅ Usuário vira premium IMEDIATAMENTE
```

### Pagamento com Boleto (Assíncrono):

```
1. Usuário clica em "Upgrade"
2. Escolhe boleto
3. Stripe dispara: checkout.session.completed (paymentStatus: "unpaid")
   ⏳ Sistema aguarda pagamento...
4. Usuário paga o boleto (pode levar dias)
5. Stripe dispara: checkout.session.async_payment_succeeded
6. ✅ Usuário vira premium QUANDO O BOLETO FOR PAGO
```

### Boleto Expirado:

```
1. Usuário gera boleto mas não paga
2. Boleto expira (geralmente 3 dias)
3. Stripe dispara: checkout.session.async_payment_failed
4. ❌ Sistema loga mas não faz nada (usuário não vira premium)
```

---

## Para o Usuário que Pagou e Não Virou Premium:

### Opção 1: Aguardar o Webhook (Recomendado)

Se o boleto foi pago recentemente (últimas horas), o webhook pode estar atrasado.
O Stripe pode levar até 24h para processar boletos.

### Opção 2: Ativar Manualmente

Você pode ativar manualmente no Firebase:

1. Acesse: https://console.firebase.google.com
2. Vá em Realtime Database
3. Encontre o usuário pelo email
4. Adicione/edite:

```json
{
  "isPremium": true,
  "purchasedAt": "2025-12-10T18:30:00.000Z",
  "pricePaid": 30,
  "country": "BR"
}
```

### Opção 3: Verificar no Stripe

1. Vá em: https://dashboard.stripe.com/payments
2. Procure pelo pagamento do usuário
3. Veja se o status é "Succeeded"
4. Se sim, o webhook deveria ter disparado
5. Verifique os logs do webhook em: https://dashboard.stripe.com/webhooks

---

## Logs para Monitorar:

Agora você verá logs assim:

**Boleto gerado:**

```
📦 Checkout session completed
⏳ Payment pending (likely boleto). Waiting for async payment confirmation...
```

**Boleto pago:**

```
💰 Async payment succeeded (boleto paid)
✅ User xxx upgraded to premium
📧 Thank you email queued
```

**Boleto expirado:**

```
❌ Async payment failed (boleto expired/cancelled)
```

---

## Checklist:

- [ ] Adicionei `checkout.session.async_payment_succeeded` no webhook do Stripe
- [ ] Adicionei `checkout.session.async_payment_failed` no webhook do Stripe
- [ ] Fiz deploy do código atualizado
- [ ] Testei com um boleto de teste do Stripe
- [ ] Verifiquei os logs do webhook no Stripe Dashboard

---

## ⚠️ IMPORTANTE:

Sem adicionar esses eventos no Stripe Dashboard, pagamentos por boleto **NUNCA** vão ativar o premium automaticamente!
