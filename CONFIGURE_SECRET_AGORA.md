# 🔐 Configurar Kiwify Webhook Secret - URGENTE

## ✅ O que fazer AGORA:

### 1. Adicione no `.env.local`:

```bash
KIWIFY_WEBHOOK_SECRET=rroobl2yt0k
```

### 2. Reinicie o servidor:

```bash
# Pare o servidor (Ctrl+C)
npm run dev
```

### 3. Teste novamente

Envie o webhook de teste novamente e você verá:

```
✅ Kiwify webhook signature verified
✅ User NBd6D4R8UJYCcFMtgNpLJNhrqM32 upgraded to premium via Kiwify
📧 Thank you email sent for agregadoshopee@gmail.com
```

## 📊 O que foi corrigido:

### Problema 1: Payload Wrapper

**Antes:** Esperava payload direto

```json
{
  "order_id": "...",
  "order_status": "paid"
}
```

**Depois:** Agora aceita wrapper

```json
{
  "order": {
    "order_id": "...",
    "order_status": "paid"
  }
}
```

### Problema 2: Signature Calculation

**Antes:** Calculava HMAC do body inteiro (com wrapper)
**Depois:** Calcula HMAC apenas do objeto `order`

## 🎯 Payload de Teste Recebido:

```json
{
  "TrackingParameters": {
    "s1": "NBd6D4R8UJYCcFMtgNpLJNhrqM32",  ← userId PRESENTE! ✅
    "s2": "agregadoshopee@gmail.com"
  },
  "Customer": {
    "email": "agregadoshopee@gmail.com",
    "full_name": "CARLOS JOSE MARTINS"
  },
  "Commissions": {
    "charge_amount": 3000  ← R$ 30,00
  }
}
```

## ✅ Tudo está correto!

- ✅ userId está vindo no `s1`
- ✅ Email está correto
- ✅ Valor está correto (R$ 30)
- ✅ Estrutura do payload está correta

**Só falta adicionar o secret no `.env.local` e reiniciar!**

## 🚀 Após configurar:

O webhook vai:

1. ✅ Validar a signature corretamente
2. ✅ Pegar o userId: `NBd6D4R8UJYCcFMtgNpLJNhrqM32`
3. ✅ Ativar premium no Firebase
4. ✅ Enviar email para: `agregadoshopee@gmail.com`

**Está quase lá! Só adicionar o secret! 🎉**
