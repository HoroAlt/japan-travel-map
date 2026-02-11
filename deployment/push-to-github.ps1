# ==========================================
# Japan Travel Map - GitHub Auto-Deploy Script
# ==========================================

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Japan Travel Map - GitHub Uploader" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check Git installation
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Git is not installed. Please install Git first." -ForegroundColor Red
    Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

# Request user data
Write-Host "Enter GitHub credentials:" -ForegroundColor Yellow
Write-Host ""
$GITHUB_USERNAME = Read-Host "Your GitHub username"
$REPO_NAME = Read-Host "Repository name [japan-travel-map]"
if ([string]::IsNullOrWhiteSpace($REPO_NAME)) {
    $REPO_NAME = "japan-travel-map"
}
$IS_PRIVATE = Read-Host "Private repository? (y/n) [n]"
if ([string]::IsNullOrWhiteSpace($IS_PRIVATE)) {
    $IS_PRIVATE = "n"
}

Write-Host ""
Write-Host "[INFO] You need a GitHub Personal Access Token" -ForegroundColor Cyan
Write-Host ""
Write-Host "How to get a token:" -ForegroundColor White
Write-Host "1. Go to https://github.com/settings/tokens" -ForegroundColor White
Write-Host "2. Click 'Generate new token (classic)'" -ForegroundColor White
Write-Host "3. Enter token name (e.g., 'deploy-script')" -ForegroundColor White
Write-Host "4. Select expiration (recommended: 7-30 days)" -ForegroundColor White
Write-Host "5. Check the following:" -ForegroundColor White
Write-Host "   [x] repo (full repository access)" -ForegroundColor White
Write-Host "6. Click 'Generate token' at the bottom" -ForegroundColor White
Write-Host "7. COPY THE TOKEN IMMEDIATELY (shown only once!)" -ForegroundColor White
Write-Host ""
$GITHUB_TOKEN = Read-Host "Paste your GitHub Token" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($GITHUB_TOKEN)
$GITHUB_TOKEN_PLAIN = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
Write-Host ""

# Define project directory
# Script is in deployment/ folder, project is in parent folder
$SCRIPT_DIR = $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($SCRIPT_DIR)) {
    $SCRIPT_DIR = Get-Location
}
$PROJECT_DIR = Split-Path -Parent $SCRIPT_DIR

Write-Host "[INFO] Starting process..." -ForegroundColor Cyan
Write-Host ""

# Step 1: Initialize Git
Write-Host "[INFO] Step 1/6: Initializing Git repository..." -ForegroundColor Cyan

Set-Location $PROJECT_DIR

if (Test-Path ".git") {
    Write-Host "[WARNING] Git repository already exists" -ForegroundColor Yellow
} else {
    git init
    Write-Host "[OK] Git repository initialized" -ForegroundColor Green
}

# Step 2: Configure Git
Write-Host "[INFO] Step 2/6: Configuring Git..." -ForegroundColor Cyan

git config user.name "$GITHUB_USERNAME"
git config user.email "$GITHUB_USERNAME@users.noreply.github.com"

Write-Host "[OK] Git configured" -ForegroundColor Green

# Step 3: Create .gitignore
Write-Host "[INFO] Step 3/6: Checking .gitignore..." -ForegroundColor Cyan

if (!(Test-Path ".gitignore")) {
    @"
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

# Windows
*.exe
*.dll
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
    
    Write-Host "[OK] .gitignore created" -ForegroundColor Green
} else {
    Write-Host "[OK] .gitignore already exists" -ForegroundColor Green
}

# Step 4: Create GitHub repository
Write-Host "[INFO] Step 4/6: Creating GitHub repository..." -ForegroundColor Cyan

$PRIVATE_FLAG = if ($IS_PRIVATE -eq "y" -or $IS_PRIVATE -eq "Y") { "true" } else { "false" }

$headers = @{
    "Authorization" = "token $GITHUB_TOKEN_PLAIN"
    "Accept" = "application/vnd.github.v3+json"
}

$body = @{
    name = $REPO_NAME
    private = [System.Convert]::ToBoolean($PRIVATE_FLAG)
    auto_init = $false
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json"
    Write-Host "[OK] Repository '$REPO_NAME' created on GitHub" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 422) {
        Write-Host "[WARNING] Repository '$REPO_NAME' already exists" -ForegroundColor Yellow
        Write-Host "[INFO] Using existing repository" -ForegroundColor Cyan
    } else {
        Write-Host "[ERROR] Error creating repository: $_" -ForegroundColor Red
        exit 1
    }
}

# Step 5: Add files and commit
Write-Host "[INFO] Step 5/6: Adding files..." -ForegroundColor Cyan

# Check for changes
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "[WARNING] No changes to commit" -ForegroundColor Yellow
} else {
    git add .
    git commit -m "Initial commit: Japan Travel Map project

- Added main application files
- Added deployment scripts
- Added documentation
- Ready for deployment"
    Write-Host "[OK] Files added and committed" -ForegroundColor Green
}

# Step 6: Push to GitHub
Write-Host "[INFO] Step 6/6: Pushing to GitHub..." -ForegroundColor Cyan

# Configure remote
$REMOTE_URL = "https://$GITHUB_TOKEN_PLAIN@github.com/$GITHUB_USERNAME/$REPO_NAME.git"

# Remove old remote if exists
git remote remove origin 2>$null

# Add new remote
git remote add origin $REMOTE_URL

# Rename branch to main
git branch -M main

# Push
try {
    git push -u origin main
    Write-Host "[OK] Code successfully pushed to GitHub!" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Error pushing to GitHub: $_" -ForegroundColor Red
    Write-Host "Possible reasons:" -ForegroundColor Yellow
    Write-Host "  - Wrong token" -ForegroundColor Yellow
    Write-Host "  - No write access to repository" -ForegroundColor Yellow
    Write-Host "  - Network issues" -ForegroundColor Yellow
    exit 1
}

# Finalization
Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  SUCCESS!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "[OK] Project uploaded to GitHub!" -ForegroundColor Green
Write-Host ""
Write-Host "Link to repository:" -ForegroundColor Yellow
Write-Host "   https://github.com/$GITHUB_USERNAME/$REPO_NAME" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next step - deploy to server:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   1. Rent a VPS server" -ForegroundColor White
Write-Host "   2. Connect: ssh root@YOUR_IP" -ForegroundColor White
Write-Host "   3. Run the command:" -ForegroundColor White
Write-Host ""
Write-Host "   curl -fsSL https://raw.githubusercontent.com/$GITHUB_USERNAME/$REPO_NAME/main/deployment/install.sh | sudo bash" -ForegroundColor Green
Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""

# Offer to open in browser
$OPEN_BROWSER = Read-Host "Open repository in browser? (y/n)"
if ($OPEN_BROWSER -eq "y" -or $OPEN_BROWSER -eq "Y") {
    Start-Process "https://github.com/$GITHUB_USERNAME/$REPO_NAME"
}

Write-Host ""
Write-Host "[OK] Done!" -ForegroundColor Green

# Clear token variable
$GITHUB_TOKEN_PLAIN = $null
