#!/bin/bash

echo "=========================================="
echo "  TOTAL DIAGNOSTIC SCRIPT"
echo "=========================================="
echo ""

echo "[1/10] CHECKING PROCESSES..."
echo "Node processes:"
ps aux | grep node | grep -v grep
echo ""

echo "[2/10] CHECKING BACKEND LOCAL..."
curl -s http://localhost:3001/api/health
echo " (should show status:ok)"
echo ""

echo "[3/10] CHECKING BACKEND VISITS..."
curl -s http://localhost:3001/api/visits
echo " (should show [] or data)"
echo ""

echo "[4/10] CHECKING API THROUGH DOMAIN..."
echo "Testing: https://japantravelmap.duckdns.org/api/health"
curl -s https://japantravelmap.duckdns.org/api/health
echo ""
echo ""

echo "[5/10] CHECKING NGINX CONFIG..."
echo "Nginx config content:"
cat /etc/nginx/sites-available/japan-travel-map
echo ""
echo "Nginx test:"
nginx -t 2>&1
echo ""

echo "[6/10] CHECKING CORS HEADERS..."
echo "Testing CORS headers:"
curl -I -s https://japantravelmap.duckdns.org/api/visits | grep -i "access-control\|content-type"
echo ""

echo "[7/10] CHECKING BACKEND LOGS..."
echo "Last 20 lines of backend log:"
tail -20 /var/www/japan-travel-map/logs/backend.log 2>/dev/null || echo "No backend log found"
echo ""

echo "[8/10] CHECKING NGINX ERROR LOGS..."
echo "Last 10 lines of nginx error log:"
tail -10 /var/log/nginx/error.log 2>/dev/null | tail -10
echo ""

echo "[9/10] CHECKING PERMISSIONS..."
echo "Backend directory:"
ls -la /var/www/japan-travel-map/backend/
echo ""
echo "Data directory:"
ls -la /var/www/japan-travel-map/backend/data/ 2>/dev/null || echo "Data directory not found"
echo ""
echo "Dist directory:"
ls -la /var/www/japan-travel-map/dist/ | head -5
echo ""

echo "[10/10] TESTING FROM BROWSER PERSPECTIVE..."
echo "Fetching API as browser would:"
curl -s -H "Origin: https://japantravelmap.duckdns.org" https://japantravelmap.duckdns.org/api/visits
echo ""
echo ""

echo "=========================================="
echo "  DIAGNOSTIC COMPLETE"
echo "=========================================="
echo ""
echo "Copy ALL output above and send to AI assistant"
echo ""
