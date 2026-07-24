#!/bin/bash
# Superencasa VPS Deployment Script for Debian/Ubuntu
# Run this script as root or with sudo on your VPS

set -e

echo "=== Iniciando despliegue de Superencasa ==="

# 1. Actualizar paquetes del sistema
echo "Actualizando paquetes del sistema..."
apt update && apt upgrade -y

# 2. Instalar dependencias básicas
echo "Instalando dependencias básicas..."
apt install -y curl git build-essential nginx

# 3. Instalar Node.js LTS (v20)
if ! command -v node &> /dev/null; then
  echo "Instalando Node.js v20..."
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt install -y nodejs
else
  echo "Node.js ya está instalado: $(node -v)"
fi

# 4. Instalar PM2 globalmente
if ! command -v pm2 &> /dev/null; then
  echo "Instalando PM2..."
  npm install -g pm2
else
  echo "PM2 ya está instalado"
fi

# 5. Configurar base de datos y construir el proyecto
echo "Instalando dependencias del proyecto..."
npm install

# Generar variables de entorno si no existen
if [ ! -f .env ]; then
  echo "Creando archivo .env de producción..."
  JWT_SECRET=$(openssl rand -hex 32)
  cat <<EOT > .env
DATABASE_URL="file:./dev.db"
JWT_SECRET="$JWT_SECRET"
PORT=3000
NODE_ENV=production
EOT
fi

echo "Generando cliente de Prisma..."
npx prisma generate

echo "Ejecutando migraciones de base de datos..."
npx prisma migrate deploy

echo "Sembrando datos iniciales en la base de datos..."
npx prisma db seed || echo "La base de datos ya contiene datos o el comando seed falló."

echo "Construyendo la aplicación Next.js..."
npm run build

# 6. Configurar e Iniciar PM2
echo "Iniciando aplicación con PM2..."
pm2 delete superencasa 2>/dev/null || true
pm2 start "npm run start -- -p 3000" --name "superencasa"
pm2 save

# 7. Configurar Nginx como Proxy Reverso
echo "Configurando Nginx..."
cat <<EOT > /etc/nginx/sites-available/superencasa
server {
    listen 80;
    server_name 186.64.123.152; # Cambiar por tu dominio si tienes uno

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        
        # Soporte para uploads grandes
        client_max_body_size 10M;
    }
}
EOT

# Activar sitio y reiniciar Nginx
ln -sf /etc/nginx/sites-available/superencasa /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default || true
nginx -t
systemctl restart nginx

echo "=== ¡Despliegue finalizado con éxito! ==="
echo "La tienda ya está disponible en: http://186.64.123.152"
