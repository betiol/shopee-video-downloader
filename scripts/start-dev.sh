#!/bin/bash

echo "🔍 Verificando porta 3000..."

# Verificar se há algo rodando na porta 3000
PORT_IN_USE=$(lsof -ti:3000)

if [ ! -z "$PORT_IN_USE" ]; then
    echo "⚠️  Porta 3000 está em uso pelo processo: $PORT_IN_USE"
    
    # Mostrar detalhes do processo
    echo ""
    echo "📋 Detalhes do processo:"
    ps aux | grep $PORT_IN_USE | grep -v grep | head -1
    echo ""
    
    read -p "Deseja matar este processo? (s/n): " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        echo "🔪 Matando processo $PORT_IN_USE..."
        kill $PORT_IN_USE
        sleep 2
        echo "✅ Processo finalizado!"
    else
        echo "❌ Operação cancelada."
        echo ""
        echo "💡 Você pode usar outra porta:"
        echo "   PORT=3001 npm run dev"
        echo "   ngrok http 3001"
        exit 1
    fi
fi

echo ""
echo "✅ Porta 3000 está livre!"
echo ""
echo "🚀 Iniciando servidor Next.js..."
echo ""

npm run dev
