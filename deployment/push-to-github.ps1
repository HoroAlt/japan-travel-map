# ==========================================
# Japan Travel Map - GitHub Upload Script (Windows)
# ==========================================

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Japan Travel Map - GitHub Uploader" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check Git
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Git is not installed." -ForegroundColor Red
    exit 1
}

# Request data
Write-Host "Enter GitHub credentials:" -ForegroundColor Yellow
$GITHUB_USERNAME = Read-Host "Your GitHub username"
$REPO_NAME = Read-Host "Repository name [japan-travel-map]"
if ([string]::IsNullOrWhiteSpace($REPO_NAME)) { $REPO_NAME = "japan-travel-map" }
$IS_PRIVATE = Read-Host "Private repository? (y/n) [n]"
if ([string]::IsNullOrWhiteSpace($IS_PRIVATE)) { $IS_PRIVATE = "n" }

Write-Host ""
Write-Host "You need a GitHub Personal Access Token" -ForegroundColor Cyan
Write-Host "Get it at: https://github.com/settings/tokens" -ForegroundColor White
Write-Host "Required scope: [x] repo" -ForegroundColor White
Write-Host ""
$GITHUB_TOKEN = Read-Host "Paste your GitHub Token" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($GITHUB_TOKEN)
$GITHUB_TOKEN_PLAIN = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
Write-Host ""

# Define directories
$SCRIPT_DIR = $PSScriptRoot
if ([string]::IsNullOrWhiteSpace($SCRIPT_DIR)) { $SCRIPT_DIR = Get-Location }
$PROJECT_DIR = Split-Path -Parent $SCRIPT_DIR

Write-Host "[INFO] Starting process..." -ForegroundColor Cyan
Set-Location $PROJECT_DIR

# Step 1: Init Git
Write-Host "[INFO] Step 1/6: Initializing Git..." -ForegroundColor Cyan
if (Test-Path ".git") {
    Write-Host "[WARNING] Git repository already exists" -ForegroundColor Yellow
} else {
    git init
    Write-Host "[OK] Git initialized" -ForegroundColor Green
}

# Step 2: Configure Git
Write-Host "[INFO] Step 2/6: Configuring Git..." -ForegroundColor Cyan
git config user.name "$GITHUB_USERNAME"
git config user.email "$GITHUB_USERNAME@users.noreply.github.com"
Write-Host "[OK] Git configured" -ForegroundColor Green

# Step 3: Create .gitignore
Write-Host "[INFO] Step 3/6: Checking .gitignore..." -ForegroundColor Cyan
if (!(Test-Path ".gitignore")) {
    @"`nnode_modules/`ndist/`n*.log`n.env`n.DS_Store`nThumbs.db`n"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
    Write-Host "[OK] .gitignore created" -ForegroundColor Green
} else {
    Write-Host "[OK] .gitignore exists" -ForegroundColor Green
}

# Step 4: Create GitHub repo
Write-Host "[INFO] Step 4/6: Creating GitHub repository..." -ForegroundColor Cyan
$PRIVATE_FLAG = if ($IS_PRIVATE -eq "y" -or $IS_PRIVATE -eq "Y") { "true" } else { "false" }
$headers = @{ "Authorization" = "token $GITHUB_TOKEN_PLAIN"; "Accept" = "application/vnd.github.v3+json" }
$body = @{ name = $REPO_NAME; private = [System.Convert]::ToBoolean($PRIVATE_FLAG); auto_init = $false } | ConvertTo-Json

try {
    Invoke-RestMethod -Uri "https://api.github.com/user/repos" -Method Post -Headers $headers -Body $body -ContentType "application/json" | Out-Null
    Write-Host "[OK] Repository created" -ForegroundColor Green
} catch {
    if ($_.Exception.Response.StatusCode -eq 422) {
        Write-Host "[WARNING] Repository already exists, using existing" -ForegroundColor Yellow
    } else {
        Write-Host "[ERROR] Failed to create repository" -ForegroundColor Red
        exit 1
    }
}

# Step 5: Add and commit
Write-Host "[INFO] Step 5/6: Adding files..." -ForegroundColor Cyan
$status = git status --porcelain
if ([string]::IsNullOrWhiteSpace($status)) {
    Write-Host "[WARNING] No changes to commit" -ForegroundColor Yellow
} else {
    git add .
    git commit -m "Initial commit: Japan Travel Map" | Out-Null
    Write-Host "[OK] Files committed" -ForegroundColor Green
}

# Step 6: Push
Write-Host "[INFO] Step 6/6: Pushing to GitHub..." -ForegroundColor Cyan
$REMOTE_URL = "https://$GITHUB_TOKEN_PLAIN@github.com/$GITHUB_USERNAME/$REPO_NAME.git"
git remote remove origin 2>$null
git remote add origin $REMOTE_URL
git branch -M main

try {
    git push -u origin main
    Write-Host "[OK] Pushed to GitHub!" -ForegroundColor Green
} catch {
    Write-Host "[ERROR] Push failed" -ForegroundColor Red
    exit 1
}

# Final
Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  SUCCESS!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Repository: https://github.com/$GITHUB_USERNAME/$REPO_NAME" -ForegroundColor Cyan
Write-Host ""
Write-Host "To deploy on server, run:" -ForegroundColor Yellow
Write-Host "curl -fsSL https://raw.githubusercontent.com/$GITHUB_USERNAME/$REPO_NAME/main/deployment/install.sh | sudo bash" -ForegroundColor Green
Write-Host ""

$OPEN_BROWSER = Read-Host "Open in browser? (y/n)"
if ($OPEN_BROWSER -eq "y" -or $OPEN_BROWSER -eq "Y") {
    Start-Process "https://github.com/$GITHUB_USERNAME/$REPO_NAME"
}

Write-Host "[OK] Done!" -ForegroundColor Green
$GITHUB_TOKEN_PLAIN = $null
