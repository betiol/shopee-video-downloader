# Shopee Video Downloader

Um aplicativo Next.js para baixar vídeos da Shopee sem marca d'água de forma rápida e gratuita.

## Características

- Interface limpa e minimalista
- Design responsivo
- SEO otimizado
- Tema purple moderno
- Download de vídeos sem marca d'água
- Preview do vídeo antes do download

## Tecnologias Utilizadas

- Next.js 15
- TypeScript
- Tailwind CSS
- shadcn/ui
- Lucide Icons

## Como Usar

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
```

3. Copie o arquivo `.env.local.example` para `.env.local`:

```bash
cp .env.local.example .env.local
```

4. Execute o servidor de desenvolvimento:

```bash
npm run dev
```

5. Abra [http://localhost:3000](http://localhost:3000) no seu navegador

## Como Funciona

1. O usuário cola a URL do vídeo da Shopee
2. O servidor processa a URL seguindo os redirects
3. Extrai os dados do vídeo da página
4. Remove o padrão de marca d'água da URL do vídeo
5. Retorna o vídeo sem marca d'água para download

## Deploy

### Vercel

A maneira mais fácil de fazer deploy é usando a [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Não se esqueça de adicionar a variável de ambiente `NEXT_PUBLIC_BASE_URL` com a URL do seu domínio.

## Licença

MIT
