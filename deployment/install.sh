#!/bin/bash

# ==========================================
# Japan Travel Map - Автоматический установщик
# ==========================================

set -e  # Остановка при любой ошибке

# Цвета для вывода
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Функции вывода
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[OK]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Проверка прав root
if [ "$EUID" -ne 0 ]; then 
    print_error "Этот скрипт должен запускаться от имени root"
    print_status "Используйте: sudo bash install.sh"
    exit 1
fi

# Приветствие
echo "=========================================="
echo "  Japan Travel Map - Установщик"
echo "=========================================="
echo ""

# Запрос данных у пользователя
echo "Введите данные для установки:"
echo ""

read -p "Ваш GitHub username: " GITHUB_USER
read -p "Название репозитория [japan-travel-map]: " REPO_NAME
REPO_NAME=${REPO_NAME:-japan-travel-map}

read -p "Ваш домен (оставьте пустым для IP): " DOMAIN
read -p "Порт для приложения [3000]: " APP_PORT
APP_PORT=${APP_PORT:-3000}

echo ""
print_status "Начинаю установку..."
echo ""

# ==========================================
# Этап 1: Обновление системы
# ==========================================
print_status "1/8 Обновление системы..."
apt update && apt upgrade -y
print_success "Система обновлена"

# ==========================================
# Этап 2: Установка зависимостей
# ==========================================
print_status "2/8 Установка необходимых пакетов..."

# Установка базовых утилит
apt install -y curl wget git software-properties-common apt-transport-https ca-certificates gnupg2

# Установка Node.js 20 LTS
if ! command -v node &> /dev/null; then
    print_status "Установка Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi

# Установка Nginx
if ! command -v nginx &> /dev/null; then
    print_status "Установка Nginx..."
    apt install -y nginx
fi

# Установка PM2
if ! command -v pm2 &> /dev/null; then
    print_status "Установка PM2..."
    npm install -g pm2
fi

print_success "Все пакеты установлены"

# ==========================================
# Этап 3: Проверка версий
# ==========================================
print_status "3/8 Проверка установленных версий..."

NODE_VERSION=$(node --version)
NPM_VERSION=$(npm --version)
NGINX_VERSION=$(nginx -v 2>&1 | head -n1 | cut -d'/' -f2)

echo "  Node.js: $NODE_VERSION"
echo "  npm: $NPM_VERSION"
echo "  Nginx: $NGINX_VERSION"

print_success "Версии проверены"

# ==========================================
# Этап 4: Клонирование репозитория
# ==========================================
print_status "4/8 Клонирование репозитория..."

PROJECT_DIR="/var/www/japan-travel-map"
REPO_URL="https://github.com/$GITHUB_USER/$REPO_NAME.git"

# Удаляем старую папку если есть
if [ -d "$PROJECT_DIR" ]; then
    print_warning "Папка $PROJECT_DIR уже существует, удаляю..."
    rm -rf $PROJECT_DIR
fi

# Клонируем репозиторий
git clone $REPO_URL $PROJECT_DIR

if [ $? -ne 0 ]; then
    print_error "Не удалось клонировать репозиторий"
    print_status "Проверьте:"
    print_status "  - Правильность GitHub username: $GITHUB_USER"
    print_status "  - Правильность названия репозитория: $REPO_NAME"
    print_status "  - Что репозиторий публичный"
    exit 1
fi

print_success "Репозиторий клонирован"

# ==========================================
# Этап 5: Установка npm зависимостей
# ==========================================
print_status "5/8 Установка npm зависимостей..."

cd $PROJECT_DIR
npm install

if [ $? -ne 0 ]; then
    print_error "Ошибка при установке npm зависимостей"
    exit 1
fi

print_success "Зависимости установлены"

# ==========================================
# Этап 6: Сборка проекта
# ==========================================
print_status "6/8 Сборка проекта..."

npm run build

if [ $? -ne 0 ]; then
    print_error "Ошибка при сборке проекта"
    exit 1
fi

print_success "Проект собран"

# ==========================================
# Этап 7: Настройка Nginx
# ==========================================
print_status "7/8 Настройка Nginx..."

# Определяем server_name
if [ -z "$DOMAIN" ]; then
    SERVER_NAME="_"
else
    SERVER_NAME="$DOMAIN"
fi

# Создаём конфигурацию Nginx
cat > /etc/nginx/sites-available/japan-travel-map << EOF
server {
    listen 80;
    server_name $SERVER_NAME;
    
    root $PROJECT_DIR/dist;
    index index.html;
    
    # Логи
    access_log /var/log/nginx/japan-travel-map-access.log;
    error_log /var/log/nginx/japan-travel-map-error.log;
    
    # Обработка запросов
    location / {
        try_files \$uri \$uri/ /index.html;
    }
    
    # Кэширование статических файлов
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot|otf|webp)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        access_log off;
    }
    
    # Отключение доступа к скрытым файлам
    location ~ /\\. {
        deny all;
        access_log off;
        log_not_found off;
    }
    
    # Сжатие
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
}
EOF

# Удаляем стандартный конфиг если есть
rm -f /etc/nginx/sites-enabled/default

# Создаём символическую ссылку
ln -sf /etc/nginx/sites-available/japan-travel-map /etc/nginx/sites-enabled/japan-travel-map

# Проверка конфигурации
nginx -t

if [ $? -ne 0 ]; then
    print_error "Ошибка в конфигурации Nginx"
    exit 1
fi

# Перезапуск Nginx
systemctl restart nginx
systemctl enable nginx

print_success "Nginx настроен"

# ==========================================
# Этап 8: Настройка прав доступа
# ==========================================
print_status "8/8 Настройка прав доступа..."

# Создаём пользователя для веб-сервера если нужно
if ! id -u www-data &>/dev/null; then
    useradd -r -s /bin/false www-data
fi

# Устанавливаем права
chown -R www-data:www-data $PROJECT_DIR/dist
chmod -R 755 $PROJECT_DIR/dist

print_success "Права доступа настроены"

# ==========================================
# Финализация
# ==========================================
echo ""
echo "=========================================="
echo "  Установка завершена!"
echo "=========================================="
echo ""

IP_ADDRESS=$(hostname -I | awk '{print $1}')

print_success "Japan Travel Map успешно развёрнут!"
echo ""
echo "📱 Доступ к приложению:"
if [ -z "$DOMAIN" ]; then
    echo "   http://$IP_ADDRESS"
else
    echo "   http://$DOMAIN"
    echo "   http://$IP_ADDRESS"
fi
echo ""
echo "📁 Расположение проекта: $PROJECT_DIR"
echo ""
echo "📝 Полезные команды:"
echo "   Просмотр логов Nginx:  tail -f /var/log/nginx/japan-travel-map-error.log"
echo "   Перезапуск Nginx:      systemctl restart nginx"
echo "   Проверка статуса:      systemctl status nginx"
echo ""
echo "🔄 Для обновления проекта:"
echo "   cd $PROJECT_DIR && git pull && npm install && npm run build && systemctl restart nginx"
echo ""
echo "=========================================="

# Предложение настроить SSL
if [ ! -z "$DOMAIN" ]; then
    echo ""
    read -p "Хотите настроить HTTPS (SSL)? (y/n): " SETUP_SSL
    if [ "$SETUP_SSL" = "y" ] || [ "$SETUP_SSL" = "Y" ]; then
        echo ""
        print_status "Установка Certbot..."
        apt install -y certbot python3-certbot-nginx
        
        print_status "Получение SSL сертификата..."
        certbot --nginx -d $DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN
        
        if [ $? -eq 0 ]; then
            print_success "SSL настроен!"
            echo ""
            echo "🔒 Теперь сайт доступен по HTTPS:"
            echo "   https://$DOMAIN"
        else
            print_error "Не удалось настроить SSL автоматически"
            echo "Попробуйте вручную: certbot --nginx -d $DOMAIN"
        fi
    fi
fi

echo ""
print_success "Готово! 🎉"
