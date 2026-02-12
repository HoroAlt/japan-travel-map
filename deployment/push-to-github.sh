#!/bin/bash

# ==========================================
# Japan Travel Map - GitHub Upload Script (Linux/Mac)
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

echo "=========================================="
echo "  Japan Travel Map - GitHub Uploader"
echo "=========================================="
echo ""

if ! command -v git &> /dev/null; then
    print_error "Git is not installed"
    exit 1
fi

echo "Enter GitHub credentials:"
read -p "Your GitHub username: " GITHUB_USERNAME
read -p "Repository name [japan-travel-map]: " REPO_NAME
REPO_NAME=${REPO_NAME:-japan-travel-map}
read -p "Private repository? (y/n) [n]: " IS_PRIVATE
IS_PRIVATE=${IS_PRIVATE:-n}

echo ""
print_status "You need a GitHub Personal Access Token"
echo "Get it at: https://github.com/settings/tokens"
echo "Required scope: [x] repo"
echo ""
read -s -p "Paste your GitHub Token: " GITHUB_TOKEN
echo ""
echo ""

# Define directories
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( cd "$SCRIPT_DIR/.." && pwd )"

cd "$PROJECT_DIR"

print_status "Starting process..."

# Step 1: Init Git
print_status "Step 1/6: Initializing Git..."
if [ -d ".git" ]; then
    print_warning "Git repository already exists"
else
    git init
    print_success "Git initialized"
fi

# Step 2: Configure Git
print_status "Step 2/6: Configuring Git..."
git config user.name "$GITHUB_USERNAME"
git config user.email "$GITHUB_USERNAME@users.noreply.github.com"
print_success "Git configured"

# Step 3: Create .gitignore
print_status "Step 3/6: Checking .gitignore..."
if [ ! -f ".gitignore" ]; then
    echo -e "node_modules/\ndist/\n*.log\n.env\n.DS_Store\nThumbs.db" > .gitignore
    print_success ".gitignore created"
else
    print_success ".gitignore exists"
fi

# Step 4: Create GitHub repo
print_status "Step 4/6: Creating GitHub repository..."
PRIVATE_FLAG="false"
if [ "$IS_PRIVATE" = "y" ] || [ "$IS_PRIVATE" = "Y" ]; then
    PRIVATE_FLAG="true"
fi

RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/user/repos \
  -d "{\"name\":\"$REPO_NAME\",\"private\":$PRIVATE_FLAG}" 2>&1)

if echo "$RESPONSE" | grep -q "name already exists"; then
    print_warning "Repository already exists, using existing"
elif echo "$RESPONSE" | grep -q "\"message\""; then
    print_error "Failed to create repository"
    echo "$RESPONSE"
    exit 1
else
    print_success "Repository created"
fi

# Step 5: Add and commit
print_status "Step 5/6: Adding files..."
if git diff --cached --quiet && git diff --quiet; then
    print_warning "No changes to commit"
else
    git add .
    git commit -m "Initial commit: Japan Travel Map"
    print_success "Files committed"
fi

# Step 6: Push
print_status "Step 6/6: Pushing to GitHub..."
REMOTE_URL="https://$GITHUB_TOKEN@github.com/$GITHUB_USERNAME/$REPO_NAME.git"
git remote remove origin 2>/dev/null || true
git remote add origin "$REMOTE_URL"
git branch -M main

if git push -u origin main; then
    print_success "Pushed to GitHub!"
else
    print_error "Push failed"
    exit 1
fi

# Final
echo ""
echo "=========================================="
echo "  SUCCESS!"
echo "=========================================="
echo ""
echo "Repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME"
echo ""
echo "To deploy on server, run:"
echo -e "${GREEN}curl -fsSL https://raw.githubusercontent.com/$GITHUB_USERNAME/$REPO_NAME/main/deployment/install.sh | sudo bash${NC}"
echo ""

read -p "Open in browser? (y/n): " OPEN_BROWSER
if [ "$OPEN_BROWSER" = "y" ] || [ "$OPEN_BROWSER" = "Y" ]; then
    if command -v xdg-open &> /dev/null; then
        xdg-open "https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    elif command -v open &> /dev/null; then
        open "https://github.com/$GITHUB_USERNAME/$REPO_NAME"
    fi
fi

echo ""
print_success "Done!"
