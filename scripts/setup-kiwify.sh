#!/bin/bash

# Script para configurar variáveis de ambiente da Kiwify

echo "🔧 Configurando Kiwify..."
echo ""

# Product ID já conhecido
PRODUCT_ID="E5DVEQe"

# Verificar se .env.local existe
if [ ! -f .env.local ]; then
    echo "❌ Arquivo .env.local não encontrado!"
    echo "Por favor, crie o arquivo .env.local primeiro."
    exit 1
fi

# Verificar se já existe configuração Kiwify
if grep -q "KIWIFY_PRODUCT_ID" .env.local; then
    echo "⚠️  Configuração Kiwify já existe no .env.local"
    echo ""
    read -p "Deseja sobrescrever? (s/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Ss]$ ]]; then
        echo "❌ Operação cancelada."
        exit 1
    fi
    # Remover linhas antigas
    sed -i.bak '/KIWIFY_PRODUCT_ID/d' .env.local
    sed -i.bak '/KIWIFY_WEBHOOK_SECRET/d' .env.local
fi

# Solicitar Webhook Secret
echo ""
echo "📝 Para obter o Webhook Secret:"
echo "1. Acesse: https://dashboard.kiwify.com.br"
echo "2. Vá em Configurações > Webhooks"
echo "3. Crie um novo webhook (você vai precisar da URL do ngrok)"
echo "4. Copie o Secret gerado"
echo ""
read -p "Cole o Webhook Secret aqui: " WEBHOOK_SECRET

if [ -z "$WEBHOOK_SECRET" ]; then
    echo "❌ Webhook Secret não pode estar vazio!"
    exit 1
fi

# Adicionar ao .env.local
echo "" >> .env.local
echo "# Kiwify Configuration (PIX + Card payments for Brazil)" >> .env.local
echo "KIWIFY_PRODUCT_ID=$PRODUCT_ID" >> .env.local
echo "KIWIFY_WEBHOOK_SECRET=$WEBHOOK_SECRET" >> .env.local

echo ""
echo "✅ Configuração Kiwify adicionada ao .env.local!"
echo ""
echo "📋 Configurações:"
echo "   Product ID: $PRODUCT_ID"
echo "   Webhook Secret: ${WEBHOOK_SECRET:0:10}..."
echo ""
echo "🚀 Próximos passos:"
echo "1. Inicie o servidor: npm run dev"
echo "2. Inicie o ngrok: ngrok http 3000"
echo "3. Configure o webhook na Kiwify com a URL do ngrok"
echo "4. Teste o checkout!"
echo ""
