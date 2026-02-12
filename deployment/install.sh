#!/bin/bash

# ==========================================
# Japan Travel Map - Auto Installer for VPS
# ==========================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[OK]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }

if [ "$EUID" -ne 0 ]; then 
    print_error "This script must be run as root"
    print_status "Use: sudo bash install.sh"
    exit 1
fi

echo "=========================================="
echo "  Japan Travel Map - Installer"
echo "=========================================="
echo ""

# Try to read from terminal even when piped
if [ -t 0 ]; then
    echo "Enter installation details:"
    echo ""
    read -p "Your GitHub username: " GITHUB_USER
    read -p "Repository name [japan-travel-map]: " REPO_NAME
    REPO_NAME=${REPO_NAME:-japan-travel-map}
    read -p "Domain (leave empty for IP): " DOMAIN
else
    # If piped, use defaults or read from /dev/tty
    echo "Enter installation details:"
    echo ""
    GITHUB_USER="HoroAlt"
    REPO_NAME="japan-travel-map"
    DOMAIN=""
    echo "Using defaults:"
    echo "  GitHub username: $GITHUB_USER"
    echo "  Repository: $REPO_NAME"
    echo "  Domain: (not set, will use IP)"
fi

echo ""
print_status "Starting installation..."
echo ""

# Step 1: Update system
print_status "Step 1/8: Updating system..."
apt update && apt upgrade -y
print_success "System updated"

# Step 2: Install dependencies
print_status "Step 2/8: Installing required packages..."
apt install -y curl wget git nginx

# Install Node.js 20
if ! command -v node &> /dev/null; then
    print_status "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

# Install PM2
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2..."
    npm install -g pm2
fi

print_success "All packages installed"

# Step 3: Check versions
print_status "Step 3/8: Checking versions..."
echo "  Node.js: $(node --version)"
echo "  npm: $(npm --version)"
echo "  Nginx: $(nginx -v 2>&1 | head -n1 | cut -d'/' -f2)"
print_success "Versions checked"

# Step 4: Clone repository
print_status "Step 4/8: Cloning repository..."

PROJECT_DIR="/var/www/japan-travel-map"
REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"

if [ -d "$PROJECT_DIR" ]; then
    print_warning "Directory exists, removing..."
    rm -rf $PROJECT_DIR
fi

git clone $REPO_URL $PROJECT_DIR

if [ $? -ne 0 ]; then
    print_error "Failed to clone repository"
    print_status "Check:"
    print_status "  - GitHub username: $GITHUB_USER"
    print_status "  - Repository name: $REPO_NAME"
    print_status "  - Repository is public"
    exit 1
fi

print_success "Repository cloned"

# Step 5: Install npm dependencies
print_status "Step 5/8: Installing npm dependencies..."
cd $PROJECT_DIR
npm install
print_success "Dependencies installed"

# Step 6: Build project
print_status "Step 6/8: Building project..."
npm run build
print_success "Project built"

# Step 7: Configure Nginx
print_status "Step 7/8: Configuring Nginx..."

if [ -z "$DOMAIN" ]; then
    SERVER_NAME="_"
else
    SERVER_NAME="$DOMAIN"
fi

cat > /etc/nginx/sites-available/japan-travel-map << EOF
server {
    listen 80;
    server_name $SERVER_NAME;
    
    root $PROJECT_DIR/dist;
    index index.html;
    
    access_log /var/log/nginx/japan-travel-map-access.log;
    error_log /var/log/nginx/japan-travel-map-error.log;
    
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|otf|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    location ~ /\\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/japan-travel-map /etc/nginx/sites-enabled/japan-travel-map

nginx -t
systemctl restart nginx
systemctl enable nginx

print_success "Nginx configured"

# Step 8: Set permissions
print_status "Step 8/8: Setting permissions..."
chown -R www-data:www-data $PROJECT_DIR/dist
chmod -R 755 $PROJECT_DIR/dist
print_success "Permissions set"

# Finalization
echo ""
echo "=========================================="
echo "  SUCCESS!"
echo "=========================================="
echo ""
print_success "Japan Travel Map deployed successfully!"
echo ""

IP_ADDRESS=$(hostname -I | awk '{print $1}')

echo "Access your app:"
if [ -z "$DOMAIN" ]; then
    echo "   http://$IP_ADDRESS"
else
    echo "   http://$DOMAIN"
    echo "   http://$IP_ADDRESS"
fi
echo ""
echo "Project location: $PROJECT_DIR"
echo ""
echo "Useful commands:"
echo "   View Nginx logs: tail -f /var/log/nginx/japan-travel-map-error.log"
echo "   Restart Nginx:   systemctl restart nginx"
echo "   Check status:    systemctl status nginx"
echo ""
echo "=========================================="

# SSL Setup
if [ ! -z "$DOMAIN" ]; then
    echo ""
    read -p "Setup HTTPS (SSL)? (y/n): " SETUP_SSL
    if [ "$SETUP_SSL" = "y" ] || [ "$SETUP_SSL" = "Y" ]; then
        apt install -y certbot python3-certbot-nginx
        certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
        if [ $? -eq 0 ]; then
            print_success "SSL configured!"
            echo "   https://$DOMAIN"
        fi
    fi
fi

echo ""
print_success "Done!"
