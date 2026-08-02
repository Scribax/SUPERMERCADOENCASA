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
echo "🗄️  [4/7] Preparando base de datos..."
npx prisma generate
npx prisma migrate deploy
echo ""

# 5. Seeds
echo "🌱 [5/7] Ejecutando seeds..."
npx tsx prisma/seed.ts
npx tsx prisma/seed-extra.ts
npx tsx prisma/seed-configs.ts
echo ""

# 6. Build
echo "🔨 [6/7] Compilando aplicación..."
npm run build
echo ""

# 7. Reiniciar PM2
echo "🚀 [7/7] Reiniciando servidor..."
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
