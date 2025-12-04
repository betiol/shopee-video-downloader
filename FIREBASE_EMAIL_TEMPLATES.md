# 📧 Guia: Personalizar Templates de Email no Firebase

## Acesso Rápido

1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto
3. No menu lateral: **Authentication** (Autenticação)
4. Clique na aba **Templates** (Modelos)

## Templates Disponíveis

### 1. Email Address Verification (Verificação de Email)
**Quando é enviado**: Após signup com email/senha

**Personalização Recomendada**:

```
Nome do Remetente: Shopee Video Downloader
Email do Remetente: noreply@shopeevideodownloader.com (configure no Firebase)
Assunto: Verifique seu email - Shopee Video Downloader

Corpo do Email:
──────────────────────────────────────────────
Olá!

Obrigado por se cadastrar no Shopee Video Downloader!

Por favor, verifique seu endereço de email clicando no link abaixo:

%LINK%

Se você não criou uma conta, pode ignorar este email com segurança.

Atenciosamente,
Equipe Shopee Video Downloader
──────────────────────────────────────────────
```

### 2. Password Reset (Recuperação de Senha)
**Quando é enviado**: Quando usuário clica em "Forgot password?"

**Personalização Recomendada**:

```
Nome do Remetente: Shopee Video Downloader
Email do Remetente: noreply@shopeevideodownloader.com
Assunto: Redefinir sua senha - Shopee Video Downloader

Corpo do Email:
──────────────────────────────────────────────
Olá!

Recebemos uma solicitação para redefinir a senha da sua conta.

Clique no link abaixo para criar uma nova senha:

%LINK%

Este link expira em 1 hora.

Se você não solicitou a redefinição de senha, ignore este email.

Atenciosamente,
Equipe Shopee Video Downloader
──────────────────────────────────────────────
```

### 3. Email Change (Mudança de Email)
**Quando é enviado**: Quando usuário altera o email (se implementado)

**Personalização Recomendada**:

```
Nome do Remetente: Shopee Video Downloader
Email do Remetente: noreply@shopeevideodownloader.com
Assunto: Confirme seu novo email - Shopee Video Downloader

Corpo do Email:
──────────────────────────────────────────────
Olá!

Você solicitou a alteração do email da sua conta.

Por favor, confirme seu novo endereço de email clicando no link abaixo:

%LINK%

Se você não solicitou esta alteração, entre em contato conosco imediatamente.

Atenciosamente,
Equipe Shopee Video Downloader
──────────────────────────────────────────────
```

## Variáveis Disponíveis

Você pode usar estas variáveis nos templates:

- `%LINK%` - Link de ação (verificação, reset, etc)
- `%EMAIL%` - Email do usuário
- `%DISPLAY_NAME%` - Nome do usuário (se disponível)
- `%APP_NAME%` - Nome do app

## Configuração de Email Personalizado

### Passo 1: Verificar Domínio de Email

1. No Firebase Console → **Authentication** → **Settings**
2. Role até **Authorized domains**
3. Adicione seu domínio: `shopeevideodownloader.com`

### Passo 2: Configurar Email Remetente

1. Vá em **Authentication** → **Templates**
2. Em cada template, configure:
   - **From name**: Shopee Video Downloader
   - **Reply-to email**: contato@shopeevideodownloader.com

### Passo 3: Configurar Action URL (Opcional)

Para usar seu próprio domínio nos links:

1. **Authentication** → **Settings**
2. Role até **Action URL**
3. Configure: `https://shopeevideodownloader.com/__/auth/action`

## Design HTML (Avançado)

Se quiser um email mais bonito com HTML:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .header {
      background: linear-gradient(135deg, #9333ea 0%, #a855f7 100%);
      color: white;
      padding: 30px;
      text-align: center;
      border-radius: 8px 8px 0 0;
    }
    .content {
      background: #f9f9f9;
      padding: 30px;
      border-radius: 0 0 8px 8px;
    }
    .button {
      display: inline-block;
      padding: 12px 30px;
      background: #9333ea;
      color: white;
      text-decoration: none;
      border-radius: 6px;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      margin-top: 20px;
      font-size: 12px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Shopee Video Downloader</h1>
  </div>
  <div class="content">
    <h2>Verifique seu email</h2>
    <p>Olá!</p>
    <p>Obrigado por se cadastrar no Shopee Video Downloader!</p>
    <p>Por favor, verifique seu endereço de email clicando no botão abaixo:</p>
    <a href="%LINK%" class="button">Verificar Email</a>
    <p>Ou copie e cole este link no seu navegador:</p>
    <p style="word-break: break-all; color: #666;">%LINK%</p>
    <p>Se você não criou uma conta, pode ignorar este email com segurança.</p>
  </div>
  <div class="footer">
    <p>© 2025 Shopee Video Downloader. Todos os direitos reservados.</p>
  </div>
</body>
</html>
```

## Testes

### Como Testar os Emails

1. **Verificação de Email**:
   - Crie uma nova conta com email/senha
   - Verifique sua caixa de entrada
   - Confira se o template está correto

2. **Reset de Senha**:
   - Faça login e depois logout
   - Clique em "Forgot password?"
   - Digite seu email
   - Verifique a caixa de entrada

3. **Reenvio de Verificação**:
   - Faça login com conta não verificada
   - Clique em "Resend Verification Email"
   - Verifique se recebeu novo email

## Dicas de Boas Práticas

### ✅ Faça
- Use linguagem clara e direta
- Inclua instruções passo a passo
- Adicione informações de contato
- Mantenha design consistente com o app
- Teste em diferentes clientes de email

### ❌ Evite
- Textos muito longos
- Múltiplos links confusos
- Design muito complexo (pode quebrar em alguns emails)
- Linguagem técnica demais
- Esquecer de testar

## Checklist de Configuração

- [ ] Acessar Firebase Console
- [ ] Ir em Authentication → Templates
- [ ] Personalizar "Email address verification"
- [ ] Personalizar "Password reset"
- [ ] Configurar nome do remetente
- [ ] Configurar email de resposta
- [ ] Adicionar domínio autorizado
- [ ] Testar email de verificação
- [ ] Testar email de reset
- [ ] Verificar em diferentes clientes (Gmail, Outlook, etc)

## Problemas Comuns

### Email não chega
- Verifique spam/lixo eletrônico
- Confirme que o domínio está autorizado
- Verifique se o email do remetente está configurado

### Link não funciona
- Verifique se o domínio está em "Authorized domains"
- Confirme a configuração do Action URL
- Teste em modo anônimo do navegador

### Email vai para spam
- Configure SPF, DKIM e DMARC no seu domínio
- Use email remetente verificado
- Evite palavras que acionam filtros de spam

## Recursos Adicionais

- [Firebase Email Templates Docs](https://firebase.google.com/docs/auth/custom-email-handler)
- [Email Design Best Practices](https://www.campaignmonitor.com/best-practices/)
- [HTML Email Templates](https://github.com/leemunroe/responsive-html-email-template)

---

**Pronto!** Seus emails agora terão a identidade visual do seu app! 🎨
