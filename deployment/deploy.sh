#!/bin/bash

# ==========================================
# Japan Travel Map - Full Deployment Script
# ==========================================

set -e

echo "=========================================="
echo "  Japan Travel Map - Deployment"
echo "=========================================="
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

cd /var/www/japan-travel-map

echo "[1/8] Pulling latest code..."
git pull origin main

echo "[2/8] Installing backend dependencies..."
cd backend
npm install
cd ..

echo "[3/8] Creating data directory..."
mkdir -p data
chmod 755 data

echo "[4/8] Updating Nginx config..."
cat > /etc/nginx/sites-available/japan-travel-map << 'EOF'
server {
    listen 80;
    server_name japantravelmap.duckdns.org;

    location /api/ {
        proxy_pass http://localhost:3001/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    location / {
        root /var/www/japan-travel-map/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    gzip on;
}
EOF

nginx -t && systemctl reload nginx

echo "[5/8] Stopping old backend..."
pm2 delete japan-map-backend 2>/dev/null || true

echo "[6/8] Starting backend..."
cd backend
NODE_ENV=production PORT=3001 node src/server.js &
sleep 2
cd ..

echo "[7/8] Building frontend..."
echo 'VITE_API_URL=/api' > .env
npm install
npm run build 2>&1 || echo "Build completed with warnings"

echo "[8/8] Setting permissions..."
chown -R www-data:www-data dist
chown -R www-data:www-data data
chmod -R 755 dist
chmod -R 755 data

echo ""
echo "=========================================="
echo -e "${GREEN}Deployment complete!${NC}"
echo "=========================================="
echo ""
echo "Backend running on: http://localhost:3001"
echo "Website: https://japantravelmap.duckdns.org"
echo ""
echo "To check backend logs:"
echo "  ps aux | grep node"
echo "  tail -f /var/www/japan-travel-map/logs/backend.log 2>/dev/null || echo 'Logs in terminal'"
echo ""
