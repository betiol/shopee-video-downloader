# Sistema de Reembolso (Refund) - Configuração

Este documento explica como o sistema de reembolso funciona e como configurá-lo corretamente.

## Como Funciona

O sistema de reembolso permite que clientes premium solicitem o reembolso do pagamento. Quando um reembolso é solicitado:

1. O cliente clica em "Solicitar Reembolso" no menu do usuário
2. Uma confirmação é exibida
3. O sistema cria um refund no Stripe
4. O status do refund é armazenado no Firebase
5. Quando o Stripe processa o refund, um webhook é enviado
6. O acesso premium do usuário é revogado automaticamente

## Arquivos Criados/Modificados

### 1. Nova Rota API - `/app/api/stripe/refund/route.ts`
- Processa solicitações de reembolso
- Verifica se o usuário é premium
- Verifica se já não foi solicitado um reembolso
- Cria o refund no Stripe
- Atualiza o status no Firebase

### 2. Componente Atualizado - `/components/user-menu.tsx`
- Adiciona botão "Solicitar Reembolso" para usuários premium
- Modal de confirmação antes de processar o refund
- Feedback visual de sucesso/erro
- Recarrega a página após sucesso

### 3. Webhook Atualizado - `/app/api/stripe/webhook/route.ts`
- Escuta evento `charge.refunded` do Stripe
- Revoga acesso premium quando refund é completado
- Atualiza status no Firebase

### 4. Traduções Adicionadas
- `/messages/en.json` - Textos em inglês
- `/messages/pt.json` - Textos em português

## Configuração do Stripe

### 1. Configurar Webhook para Refunds

No [Dashboard do Stripe](https://dashboard.stripe.com/webhooks), adicione o evento:
- `charge.refunded` - Disparado quando um reembolso é completado

### 2. Estrutura de Dados no Firebase

O sistema adiciona os seguintes campos ao usuário no Firebase:

```json
{
  "users": {
    "userId": {
      "isPremium": true,
      "paymentIntentId": "pi_xxxxx",
      "purchasedAt": "2025-12-02T10:00:00.000Z",
      "refundRequested": true,
      "refundId": "re_xxxxx",
      "refundStatus": "pending",
      "refundRequestedAt": "2025-12-02T11:00:00.000Z",
      "refundCompleted": true,
      "refundCompletedAt": "2025-12-02T11:05:00.000Z"
    }
  }
}
```

### 3. Fluxo de Dados

```
Cliente Solicita Refund
    ↓
POST /api/stripe/refund
    ↓
Stripe.refunds.create()
    ↓
Firebase: refundRequested = true
    ↓
Stripe processa refund
    ↓
Webhook: charge.refunded
    ↓
Firebase: isPremium = false
    ↓
Cliente perde acesso premium
```

## Testando o Sistema

### Modo de Teste do Stripe

1. Use um cartão de teste para fazer um pagamento
2. No Dashboard do Stripe, vá para Payments
3. Encontre o pagamento e clique em "Refund"
4. Ou use a interface do app para solicitar o refund

### Verificar Webhook

1. Use o [Stripe CLI](https://stripe.com/docs/stripe-cli) para testar localmente:
```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

2. Simule um evento de refund:
```bash
stripe trigger charge.refunded
```

## Segurança

- ✅ Autenticação via Firebase Token
- ✅ Verifica se usuário é premium antes de processar
- ✅ Previne múltiplos refunds para o mesmo pagamento
- ✅ Webhook assinado pelo Stripe (verificação de assinatura)
- ✅ Revoga acesso automaticamente após refund

## Mensagens para o Usuário

### Português (pt.json)
- **Botão**: "Solicitar Reembolso"
- **Sucesso**: "Reembolso solicitado com sucesso! Você receberá seu dinheiro de volta em 5-10 dias úteis."
- **Erro**: "Erro ao processar reembolso. Entre em contato com o suporte."
- **Já Solicitado**: "Reembolso já solicitado para esta conta."

### Inglês (en.json)
- **Button**: "Request Refund"
- **Success**: "Refund requested successfully! You will receive your money back in 5-10 business days."
- **Error**: "Error processing refund. Please contact support."
- **Already Requested**: "Refund already requested for this account."

## Considerações Importantes

1. **Prazo de Refund**: O Stripe processa refunds em 5-10 dias úteis
2. **Taxas**: Taxas do Stripe não são reembolsadas
3. **Limite de Tempo**: Refunds podem ser feitos até 180 dias após o pagamento
4. **Acesso Premium**: É revogado automaticamente após o refund ser completado

## Suporte

Se houver problemas com o sistema de refund:
1. Verifique os logs do servidor
2. Verifique o Dashboard do Stripe
3. Verifique os dados no Firebase
4. Teste o webhook manualmente com Stripe CLI



