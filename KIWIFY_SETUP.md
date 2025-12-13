# Configuração de Pagamento Kiwify (PIX + Cartão)

Este guia explica como configurar a integração com a Kiwify para aceitar pagamentos via PIX e Cartão de Crédito.

## Por que Kiwify?

A Kiwify é uma plataforma de pagamentos brasileira que oferece:

- **PIX**: Pagamento instantâneo muito popular no Brasil
- **Cartão de Crédito**: Processamento local com taxas competitivas
- **Interface em Português**: Melhor experiência para usuários brasileiros
- **Suporte Local**: Atendimento em português

## Pré-requisitos

1. Conta na Kiwify (https://kiwify.com.br)
2. Produto criado na plataforma Kiwify
3. Webhook configurado na Kiwify

## Passo 1: Criar Produto na Kiwify

1. Acesse o painel da Kiwify
2. Vá em **Produtos** > **Novo Produto**
3. Configure seu produto:
   - **Nome**: Shopee Video Downloader Premium
   - **Preço**: R$ 30,00 (ou o valor desejado)
   - **Tipo**: Pagamento único
   - **Métodos de Pagamento**: Habilite PIX e Cartão de Crédito

4. Após criar o produto, copie o **Product ID** (estará na URL do produto)

## Passo 2: Configurar Variáveis de Ambiente

Adicione as seguintes variáveis no seu arquivo `.env.local`:

```bash
# Kiwify Configuration
KIWIFY_PRODUCT_ID=seu_product_id_aqui
KIWIFY_WEBHOOK_SECRET=seu_webhook_secret_aqui
```

### Como obter o Product ID:

- Acesse seu produto na Kiwify
- O ID estará na URL: `https://dashboard.kiwify.com.br/products/[PRODUCT_ID]`

### Como obter o Webhook Secret:

- Vá em **Configurações** > **Webhooks** > **Criar Webhook Secret**
- Copie o secret gerado

## Passo 3: Configurar Webhook na Kiwify

1. No painel da Kiwify, vá em **Configurações** > **Webhooks**
2. Clique em **Novo Webhook**
3. Configure:
   - **URL**: `https://seu-dominio.com/api/kiwify/webhook`
   - **Eventos**: Selecione:
     - `order.paid` (Pedido pago)
     - `order.refunded` (Pedido reembolsado)
     - `order.chargeback` (Chargeback)
   - **Secret**: Use o mesmo secret configurado no `.env.local`

4. Salve o webhook

## Passo 4: Testar a Integração

### Teste Local (Desenvolvimento)

Para testar localmente, você precisará expor seu servidor local usando ngrok ou similar:

```bash
# Instalar ngrok
npm install -g ngrok

# Expor porta 3000
ngrok http 3000
```

Use a URL gerada pelo ngrok para configurar o webhook na Kiwify durante os testes.

### Teste em Produção

1. Deploy sua aplicação
2. Configure o webhook com a URL de produção
3. Faça um teste de compra usando o modo de teste da Kiwify

## Estrutura dos Dados

### Webhook Payload

A Kiwify enviará um payload JSON como este quando um pagamento for concluído:

```json
{
  "order_id": "abc123",
  "order_ref": "REF-12345",
  "product_id": "seu_product_id",
  "product_name": "Shopee Video Downloader Premium",
  "customer": {
    "email": "cliente@email.com",
    "name": "Nome do Cliente",
    "phone": "+5511999999999"
  },
  "order_status": "paid",
  "payment_method": "pix",
  "amount": 3000,
  "metadata": {
    "userId": "firebase_user_id",
    "email": "cliente@email.com"
  },
  "created_at": "2025-12-12T21:00:00Z",
  "updated_at": "2025-12-12T21:05:00Z"
}
```

### Status de Pedido

- `paid`: Pagamento confirmado (ativa premium)
- `waiting_payment`: Aguardando pagamento (PIX pendente)
- `refunded`: Reembolsado (revoga premium)
- `chargeback`: Chargeback (revoga premium)

### Métodos de Pagamento

- `pix`: Pagamento via PIX
- `credit_card`: Cartão de crédito
- `boleto`: Boleto bancário (se habilitado)

## Fluxo de Pagamento

### PIX

1. Usuário clica em "Fazer Upgrade"
2. Seleciona "PIX + Cartão" (Kiwify)
3. É redirecionado para checkout da Kiwify
4. Escolhe PIX como método de pagamento
5. Escaneia QR Code ou copia código PIX
6. Realiza pagamento no app do banco
7. Kiwify confirma pagamento instantaneamente
8. Webhook ativa premium no Firebase
9. Email de confirmação é enviado

### Cartão de Crédito

1. Usuário clica em "Fazer Upgrade"
2. Seleciona "PIX + Cartão" (Kiwify)
3. É redirecionado para checkout da Kiwify
4. Escolhe Cartão como método de pagamento
5. Preenche dados do cartão
6. Kiwify processa pagamento
7. Webhook ativa premium no Firebase
8. Email de confirmação é enviado

## Monitoramento

### Logs do Webhook

Os logs do webhook incluem:

- ✅ Webhook verificado com sucesso
- 📦 Detalhes do pedido recebido
- 💰 Status do pagamento
- 👤 Informações do usuário
- 📧 Confirmação de envio de email

### Verificar Logs

```bash
# Em desenvolvimento
npm run dev

# Em produção (Vercel)
vercel logs
```

## Troubleshooting

### Webhook não está sendo chamado

1. Verifique se a URL do webhook está correta
2. Confirme que o webhook está ativo na Kiwify
3. Verifique os logs da Kiwify para ver tentativas de envio
4. Certifique-se de que sua aplicação está acessível publicamente

### Signature inválida

1. Verifique se o `KIWIFY_WEBHOOK_SECRET` está correto
2. Confirme que o secret no `.env.local` é o mesmo da Kiwify
3. Verifique se não há espaços extras no secret

### Premium não está sendo ativado

1. Verifique os logs do webhook
2. Confirme que o `userId` está sendo enviado corretamente
3. Verifique se o Firebase está acessível
4. Confirme que o status do pedido é `paid`

### Email não está sendo enviado

1. Verifique se o `RESEND_API_KEY` está configurado
2. Confirme que o email do cliente é válido
3. Verifique os logs do Resend
4. Certifique-se de que o domínio está verificado no Resend

## Segurança

### Validação de Signature

O webhook valida a assinatura HMAC-SHA256 para garantir que a requisição vem da Kiwify:

```typescript
const expectedSignature = crypto
  .createHmac("sha256", KIWIFY_WEBHOOK_SECRET)
  .update(body)
  .digest("hex");

if (signature !== expectedSignature) {
  return error("Invalid signature");
}
```

### Proteção contra Replay Attacks

- Cada webhook tem um timestamp
- Pedidos duplicados são ignorados (verificação de `isPremium`)
- Logs completos para auditoria

## Comparação: Kiwify vs Stripe

| Recurso      | Kiwify          | Stripe                  |
| ------------ | --------------- | ----------------------- |
| PIX          | ✅ Sim          | ❌ Não                  |
| Cartão BR    | ✅ Taxas locais | ⚠️ Taxas internacionais |
| Boleto       | ✅ Sim          | ✅ Sim                  |
| Interface    | 🇧🇷 Português    | 🇺🇸 Inglês               |
| Suporte      | 🇧🇷 Local        | 🌍 Global               |
| Taxas PIX    | ~2%             | N/A                     |
| Taxas Cartão | ~4-5%           | ~5-7%                   |

## Recomendação

Para usuários brasileiros, **recomendamos a Kiwify** como gateway padrão devido a:

- Suporte a PIX (método mais popular no Brasil)
- Taxas mais competitivas para cartões brasileiros
- Interface e suporte em português
- Melhor experiência para o usuário final

O Stripe continua disponível como opção alternativa para:

- Usuários internacionais
- Quem prefere pagar com cartão internacional
- Backup caso a Kiwify esteja indisponível

## Suporte

Para problemas com a integração Kiwify:

- Documentação: https://docs.kiwify.com.br
- Suporte Kiwify: suporte@kiwify.com.br
- Suporte do App: Verifique os logs e entre em contato
