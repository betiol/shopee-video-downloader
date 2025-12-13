# 🔐 Configuração do Webhook Secret da Kiwify

## ✅ Método Correto de Validação

A Kiwify usa **HMAC-SHA1** (não SHA256!) para validar webhooks.

### Código Correto:

```typescript
// 1. Parse o payload
const payload = JSON.parse(body);

// 2. Calcule a signature usando SHA1
const calculatedSignature = crypto
  .createHmac("sha1", KIWIFY_WEBHOOK_SECRET)
  .update(JSON.stringify(payload))
  .digest("hex");

// 3. Compare com a signature recebida
if (signature === calculatedSignature) {
  // ✅ Webhook válido!
}
```

## 📋 Como Obter o Webhook Secret

### Opção 1: Criar na Kiwify (Recomendado)

1. Acesse: https://dashboard.kiwify.com.br
2. Vá em **Configurações** → **Webhooks**
3. Clique em **Novo Webhook**
4. Configure:
   - **URL**: `https://sua-url.ngrok-free.app/api/kiwify/webhook`
   - **Eventos**:
     - ✅ `order.paid`
     - ✅ `order.approved`
     - ✅ `order.refunded`
     - ✅ `order.chargeback`
5. A Kiwify vai **gerar um secret automaticamente**
6. **Copie o secret** e adicione no `.env.local`

### Opção 2: Gerar Manualmente

Se você quiser gerar seu próprio secret:

```bash
# Gerar um secret aleatório
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Depois configure esse mesmo secret na Kiwify.

## 🔧 Configurar no Projeto

Adicione no `.env.local`:

```bash
KIWIFY_PRODUCT_ID=E5DVEQe
KIWIFY_WEBHOOK_SECRET=seu_secret_aqui_da_kiwify
```

## 🧪 Testar a Validação

### Teste 1: Webhook de Teste da Kiwify

Quando você clicar em "Testar Webhook" na Kiwify, verá:

```
🔐 Signature validation:
Received: a705cc1f112ccd306a706e8ab5b9f77c3b68f2fa
Expected (sha1): a705cc1f11...
✅ Kiwify webhook signature verified
```

### Teste 2: Webhook Real

Quando receber um pagamento real:

```
🔐 Signature validation:
Received: abc123...
Expected (sha1): abc123...
✅ Kiwify webhook signature verified
✅ User xyz upgraded to premium via Kiwify
```

## ⚠️ Modo Debug (Atual)

Atualmente o webhook está em **modo debug** e aceita requisições mesmo com signature inválida:

```typescript
if (signature !== calculatedSignature) {
  console.error("❌ Invalid Kiwify webhook signature");
  // TEMPORÁRIO: Aceitar mesmo com signature inválida
  console.warn("⚠️ Continuando sem validação de signature (MODO DEBUG)");
  // return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
}
```

### Para Ativar Validação em Produção:

Descomente a linha de return:

```typescript
if (signature !== calculatedSignature) {
  console.error("❌ Invalid Kiwify webhook signature");
  return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
}
```

## 🔍 Troubleshooting

### Signature sempre inválida?

1. **Verifique o secret**: Certifique-se de que o secret no `.env.local` é exatamente o mesmo da Kiwify
2. **Sem espaços**: O secret não pode ter espaços no início ou fim
3. **Reinicie o servidor**: Após alterar `.env.local`, reinicie com `npm run dev`
4. **Verifique os logs**: Compare a signature recebida com a calculada

### Como verificar se o secret está correto?

```bash
# No terminal do servidor, você verá:
🔐 Signature validation:
Received: a705cc1f112ccd306a706e8ab5b9f77c3b68f2fa
Expected (sha1): a705cc1f11...

# Se os primeiros 10 caracteres forem iguais, o secret está correto!
```

## 📝 Exemplo Completo

```typescript
import crypto from "crypto";

// Receber webhook
const body = await request.text();
const signature = request.url.searchParams.get("signature");

// Parse payload
const payload = JSON.parse(body);

// Calcular signature
const calculatedSignature = crypto
  .createHmac("sha1", process.env.KIWIFY_WEBHOOK_SECRET!)
  .update(JSON.stringify(payload))
  .digest("hex");

// Validar
if (signature === calculatedSignature) {
  console.log("✅ Webhook válido!");
  // Processar pagamento...
} else {
  console.error("❌ Signature inválida!");
  return Response.json({ error: "Invalid signature" }, { status: 401 });
}
```

## 🎯 Próximos Passos

1. Configure o webhook na Kiwify
2. Copie o secret gerado
3. Adicione no `.env.local`
4. Reinicie o servidor
5. Teste com webhook de teste da Kiwify
6. Verifique se a signature é validada ✅
7. Faça um pagamento real para testar

Pronto! Agora a validação de signature está correta! 🔐✨
