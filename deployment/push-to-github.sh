#!/bin/bash

# ==========================================
# Japan Travel Map - Полная автоматизация
# Создание репозитория и загрузка на GitHub
# ==========================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

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

echo "=========================================="
echo "  Japan Travel Map - GitHub Автозаливка"
echo "=========================================="
echo ""

# Проверка наличия Git
if ! command -v git &> /dev/null; then
    print_error "Git не установлен. Установите Git сначала."
    exit 1
fi

# Запрос данных
echo "Введите данные GitHub:"
echo ""
read -p "Ваш GitHub username: " GITHUB_USERNAME
read -p "Название репозитория [japan-travel-map]: " REPO_NAME
REPO_NAME=${REPO_NAME:-japan-travel-map}
read -p "Приватный репозиторий? (y/n) [n]: " IS_PRIVATE
IS_PRIVATE=${IS_PRIVATE:-n}

echo ""
print_status "Вам нужен GitHub Personal Access Token"
echo ""
echo "Как получить токен:"
echo "1. Перейдите на https://github.com/settings/tokens"
echo "2. Нажмите 'Generate new token (classic)'"
echo "3. Введите название токена (например: 'deploy-script')"
echo "4. Выберите срок действия (рекомендуется: 7-30 дней)"
echo "5. Поставьте галочки:"
echo "   ☑ repo (полный доступ к репозиториям)"
echo "6. Нажмите 'Generate token' внизу"
echo "7. СКОПИРУЙТЕ ТОКЕН СРАЗУ (он покажется только один раз!)"
echo ""
read -s -p "Вставьте ваш GitHub Token: " GITHUB_TOKEN
echo ""
echo ""

# Определение папки проекта
# Скрипт находится в папке deployment/, проект — в родительской папке
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

print_status "Начинаю процесс..."
echo ""

# ==========================================
# Шаг 1: Инициализация Git
# ==========================================
print_status "1/6 Инициализация Git репозитория..."

cd "$PROJECT_DIR"

if [ -d ".git" ]; then
    print_warning "Git репозиторий уже существует"
else
    git init
    print_success "Git репозиторий инициализирован"
fi

# ==========================================
# Шаг 2: Настройка Git
# ==========================================
print_status "2/6 Настройка Git конфигурации..."

git config user.name "$GITHUB_USERNAME"
git config user.email "$GITHUB_USERNAME@users.noreply.github.com"

print_success "Git настроен"

# ==========================================
# Шаг 3: Создание .gitignore
# ==========================================
print_status "3/6 Проверка .gitignore..."

if [ ! -f ".gitignore" ]; then
    cat > .gitignore << 'EOF'
# Dependencies
node_modules/
.pnp
.pnp.js

# Build
dist/
dist-ssr/
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Misc
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# OS
Thumbs.db
EOF
    print_success ".gitignore создан"
else
    print_success ".gitignore уже существует"
fi

# ==========================================
# Шаг 4: Создание репозитория на GitHub
# ==========================================
print_status "4/6 Создание репозитория на GitHub..."

if [ "$IS_PRIVATE" = "y" ] || [ "$IS_PRIVATE" = "Y" ]; then
    PRIVATE_FLAG="true"
else
    PRIVATE_FLAG="false"
fi

# Создание репозитория через API
RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"private\":$PRIVATE_FLAG,\"auto_init\":false}" 2>&1)

# Проверка ответа
if echo "$RESPONSE" | grep -q "\"message\": \"Repository creation failed.\""; then
    if echo "$RESPONSE" | grep -q "name already exists"; then
        print_warning "Репозиторий '$REPO_NAME' уже существует"
        print_status "Буду использовать существующий репозиторий"
    else
        print_error "Ошибка создания репозитория"
        echo "$RESPONSE" | grep '"message"' | head -1
        exit 1
    fi
else
    print_success "Репозиторий '$REPO_NAME' создан на GitHub"
fi

# ==========================================
# Шаг 5: Добавление файлов и коммит
# ==========================================
print_status "5/6 Добавление файлов..."

# Проверяем есть ли что коммитить
if git diff --cached --quiet && git diff --quiet; then
    print_warning "Нет изменений для коммита"
else
    git add .
    git commit -m "Initial commit: Japan Travel Map project

- Added main application files
- Added deployment scripts
- Added documentation
- Ready for deployment"
    print_success "Файлы добавлены и закоммичены"
fi

# ==========================================
# Шаг 6: Пуш на GitHub
# ==========================================
print_status "6/6 Загрузка на GitHub..."

# Настройка remote
REMOTE_URL="https://$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Удаляем старый remote если есть
git remote remove origin 2>/dev/null || true

# Добавляем новый remote
git remote add origin "$REMOTE_URL"

# Пушим
git branch -M main

if git push -u origin main; then
    print_success "Код успешно загружен на GitHub!"
else
    print_error "Ошибка при загрузке на GitHub"
    print_status "Возможные причины:"
    print_status "  - Неправильный токен"
    print_status "  - Нет прав на запись в репозиторий"
    print_status "  - Проблемы с сетью"
    exit 1
fi

# ==========================================
# Финализация
# ==========================================
echo ""
echo "=========================================="
echo "  ✅ УСПЕХ!"
echo "=========================================="
echo ""
print_success "Проект загружен на GitHub!"
echo ""
echo "🔗 Ссылка на репозиторий:"
echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "🚀 Следующий шаг - развёртывание на сервере:"
echo ""
echo "   1. Арендуйте VPS сервер"
echo "   2. Подключитесь: ssh root@ВАШ_IP"
echo "   3. Выполните команду:"
echo ""
echo -e "   ${GREEN}curl -fsSL https://raw.githubusercontent.com/$GITHUB_USERNAME/$REPO_NAME/main/deployment/install.sh | sudo bash${NC}"
echo ""
echo "=========================================="
echo ""

# Предложение открыть в браузере
read -p "Открыть репозиторий в браузере? (y/n): " OPEN_BROWSER
if [ "$OPEN_BROWSER" = "y" ] || [ "$OPEN_BROWSER" = "Y" ]; then
    if command -v start &> /dev/null; then
        start "https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    elif command -v open &> /dev/null; then
        open "https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    else
        print_warning "Не удалось автоматически открыть браузер"
    fi
fi

echo ""
print_success "Готово! 🎉"
