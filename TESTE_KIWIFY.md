# 🧪 Teste Rápido - Kiwify Webhook

## ✅ Status Atual

- ✅ Servidor Next.js rodando
- ✅ ngrok expondo: `https://dan-sleeplike-pacificistically.ngrok-free.dev`
- ✅ Webhook recebendo requisições
- ⚠️ Falta configurar `KIWIFY_WEBHOOK_SECRET`

## 🔧 Próximos Passos

### 1. Configurar Webhook Secret

A Kiwify está enviando a signature como query parameter: `?signature=e5be8beea26620b8567153f19a2dad99def49d7d`

**Opção A: Usar o secret da Kiwify (Recomendado)**

1. Acesse: https://dashboard.kiwify.com.br
2. Vá em Webhooks
3. Copie o secret configurado
4. Adicione no `.env.local`:
   ```bash
   KIWIFY_WEBHOOK_SECRET=seu_secret_aqui
   ```
5. Reinicie o servidor: `npm run dev`

**Opção B: Desabilitar validação (Apenas para teste)**

Se você só quer testar rapidamente sem configurar o secret:

- O webhook já vai funcionar sem validação
- Você verá o aviso: `⚠️ Kiwify webhook signature not verified`
- **NÃO USE EM PRODUÇÃO!**

### 2. Configurar URL do Webhook na Kiwify

Na Kiwify, configure:

- **URL**: `https://dan-sleeplike-pacificistically.ngrok-free.dev/api/kiwify/webhook`
- **Eventos**:
  - ✅ `order.paid`
  - ✅ `order.refunded`
  - ✅ `order.chargeback`

### 3. Testar Webhook

A Kiwify tem uma opção de **"Testar Webhook"** no painel. Use ela para enviar um payload de teste.

Ou faça um pagamento de teste:

1. Acesse: https://pay.kiwify.com.br/E5DVEQe
2. Preencha os dados
3. Escolha PIX ou Cartão
4. Complete o pagamento

### 4. Verificar Logs

No terminal onde está rodando `npm run dev`, você verá:

```
📦 Kiwify webhook received
Signature source: query
📋 Full webhook payload: {
  "order_id": "...",
  "customer": {
    "email": "...",
    "name": "..."
  },
  ...
}
📦 Kiwify webhook details: { ... }
```

## 🔍 Monitorar

### ngrok Dashboard

Acesse: http://127.0.0.1:4040

Você verá:

- Todas as requisições
- Payload completo
- Headers
- Response

### Logs do Terminal

Acompanhe em tempo real os logs do webhook

## ⚠️ Problemas Conhecidos

### Erro: "Cannot read properties of undefined (reading 'email')"

**Causa**: A Kiwify pode enviar webhooks de teste sem dados completos

**Solução**: ✅ Já corrigido! O webhook agora usa `payload.customer?.email` (optional chaining)

### Signature não verificada

**Causa**: Falta configurar `KIWIFY_WEBHOOK_SECRET`

**Solução**: Adicione o secret no `.env.local` e reinicie o servidor

## 📝 Checklist

- [ ] Servidor Next.js rodando
- [ ] ngrok expondo porta 3000
- [ ] URL do webhook configurada na Kiwify
- [ ] `KIWIFY_PRODUCT_ID=E5DVEQe` no `.env.local`
- [ ] `KIWIFY_WEBHOOK_SECRET` configurado (opcional para teste)
- [ ] Servidor reiniciado após adicionar variáveis
- [ ] Webhook testado via painel da Kiwify
- [ ] Logs aparecendo no terminal

## 🎯 Próximo Teste

Agora que o webhook está recebendo requisições, você pode:

1. **Ver o payload completo** nos logs
2. **Configurar o secret** se quiser validação
3. **Fazer um pagamento de teste** para ver o fluxo completo
4. **Verificar se o premium é ativado** no Firebase

Boa sorte! 🚀
