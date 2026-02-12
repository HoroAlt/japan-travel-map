# 📋 Full Deployment Guide

## Server Requirements

- Ubuntu 22.04 LTS
- 1 CPU core
- 1-2 GB RAM
- 10 GB SSD

## Step-by-Step Deployment

### 1. Upload to GitHub

Run the appropriate script for your OS.

### 2. Buy VPS

Recommended providers:
- Timeweb Cloud (~400₽/month)
- Hetzner (~€5/month)

### 3. Connect to Server

```bash
ssh root@YOUR_SERVER_IP
```

### 4. Run Installer

```bash
curl -fsSL https://raw.githubusercontent.com/HoroAlt/japan-travel-map/main/deployment/install.sh | sudo bash
```

Enter your GitHub username when prompted.

### 5. Access Your Site

Your site will be available at:
- `http://YOUR_SERVER_IP`
- Or `http://your-domain.com` if you configured a domain

## Updating the Project

```bash
cd /var/www/japan-travel-map
git pull origin main
npm install
npm run build
systemctl restart nginx
```
