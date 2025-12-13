# 📋 Plano de Atualização de Textos - Segurança Legal

## 🎯 Objetivo

Remover menções diretas a "remoção de watermark" e adicionar disclaimers legais para evitar problemas.

## 🔄 Substituições Propostas

### 1. "Sem Watermark" / "No Watermark"

**Antes:**

- "Sem watermark"
- "No watermark"
- "Remove watermark"

**Depois:**

- "Vídeos em alta qualidade"
- "High-quality videos"
- "Vídeos originais"
- "Original quality videos"

### 2. Descrições de Features

**Antes:**

- "Vídeos limpos, sem watermark da Shopee"
- "Clean videos, without Shopee watermark"

**Depois:**

- "Vídeos em qualidade original"
- "Videos in original quality"

### 3. Títulos e Headings

**Antes:**

- "Download Shopee videos without watermark"

**Depois:**

- "Download Shopee videos in original quality"

## ⚖️ Disclaimers a Adicionar

### 1. Footer (Já existe parcialmente)

```
"This site is not affiliated with, endorsed by, or connected to Shopee.
All trademarks and copyrights belong to their respective owners.
Videos are downloaded in their original format as publicly available."
```

### 2. About Page

```
"Important Notice:
- This tool is an independent service not affiliated with Shopee
- We do not modify video content
- Videos are accessed in their publicly available format
- Users are responsible for respecting copyright and terms of service
- This tool is for personal, educational, and research purposes only"
```

### 3. Terms of Service

```
"By using this service, you agree to:
- Use downloaded content only for personal, educational, or research purposes
- Respect all applicable copyright laws and Shopee's terms of service
- Not use this service for commercial purposes without proper authorization
- Understand that this is an independent tool not endorsed by Shopee"
```

## 📝 Arquivos a Atualizar

### Prioridade Alta (Textos Visíveis)

1. `/messages/pt.json` - Traduções PT
2. `/messages/en.json` - Traduções EN
3. `/app/[locale]/layout.tsx` - Meta tags e SEO
4. `/app/[locale]/page.tsx` - Página principal
5. `/components/upgrade-modal.tsx` - Modal de upgrade

### Prioridade Média (Páginas Secundárias)

6. `/app/[locale]/guide/page.tsx` - Página de guia
7. `/app/[locale]/about/page.tsx` - Sobre
8. `/app/[locale]/privacy/page.tsx` - Privacidade
9. `/app/[locale]/terms/page.tsx` - Termos

### Prioridade Baixa (Código/Comentários)

10. `/app/api/download/route.ts` - Comentários no código
11. Arquivos `.md` de documentação

## 🎨 Nova Linguagem Sugerida

### Features do Premium

**Antes:**

```json
{
  "noWatermark": {
    "title": "Sem Marca d'água",
    "description": "Vídeos limpos, sem watermark da Shopee"
  }
}
```

**Depois:**

```json
{
  "highQuality": {
    "title": "Qualidade Original",
    "description": "Vídeos preservados em sua qualidade original"
  }
}
```

### Descrições Gerais

**Antes:**

- "Remove watermark"
- "Download without watermark"

**Depois:**

- "Download in original format"
- "Save videos as published"
- "Original quality preservation"

## ✅ Checklist de Implementação

- [ ] Atualizar `/messages/pt.json`
- [ ] Atualizar `/messages/en.json`
- [ ] Atualizar meta tags em `layout.tsx`
- [ ] Adicionar disclaimer no footer
- [ ] Adicionar disclaimer na página About
- [ ] Atualizar Terms of Service
- [ ] Atualizar Privacy Policy
- [ ] Revisar textos da página principal
- [ ] Revisar modal de upgrade
- [ ] Atualizar comentários no código
- [ ] Testar todas as páginas
- [ ] Verificar SEO impact

## 🔍 Palavras-Chave SEO Alternativas

**Evitar:**

- "remove watermark"
- "without watermark"
- "no watermark"

**Usar:**

- "original quality"
- "high quality download"
- "video downloader"
- "save videos"
- "download tool"

## 📊 Impacto Esperado

### Positivo ✅

- Menor risco legal
- Mais profissional
- Foco em qualidade, não em remoção
- Disclaimer claro de não-afiliação

### Negativo ⚠️

- Possível impacto em SEO (mitigado com novas keywords)
- Menos "apelativo" para alguns usuários
- Precisa re-educar usuários existentes

## 🎯 Mensagem Principal Nova

**"Download Shopee videos in their original quality for personal use, research, and education. Independent tool not affiliated with Shopee."**

Deseja que eu prossiga com as atualizações?
