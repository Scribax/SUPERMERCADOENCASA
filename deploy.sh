#!/bin/bash
set -e

echo "╔══════════════════════════════════════╗"
echo "║   🛒 Superencasa - Deploy Script    ║"
echo "╚══════════════════════════════════════╝"
echo ""

cd /var/www/supermercadoencasa

# 1. Actualizar código
echo "📥 [1/7] Actualizando código desde GitHub..."
git pull origin master
echo ""

# 2. Dependencias
echo "📦 [2/7] Instalando dependencias..."
npm install
echo ""

# 3. Limpiar build anterior
echo "🧹 [3/7] Limpiando build anterior..."
rm -rf .next
echo ""

# 4. Base de datos
echo "🗄️  [4/6] Aplicando migraciones de base de datos..."
npx prisma generate
npx prisma migrate deploy || npx prisma db push
echo ""

# 5. Build
echo "🔨 [5/6] Compilando aplicación..."
npm run build
echo ""

# 6. Reiniciar PM2
echo "🚀 [6/6] Reiniciando servidor..."
pm2 restart superencasa
sleep 3
echo ""

# Verificación
echo "═══════════════════════════════════════"
echo "📊 Estado del servidor:"
pm2 status superencasa
echo ""
echo "🌐 Probando conexión..."
curl -s -o /dev/null -w "HTTP %{http_code}" http://localhost:3000
echo ""
echo ""
echo "✅ ¡Deploy completado!"
echo "═══════════════════════════════════════"
