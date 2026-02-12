# 🔑 GitHub Token Guide

## How to Get a Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token (classic)"
3. Enter name: `deploy-script`
4. Select expiration: 30 days
5. Check: ☑ **repo** (full repository access)
6. Click "Generate token"
7. **COPY THE TOKEN IMMEDIATELY**

## Security

- Keep your token secret
- Don't commit it to repositories
- Use environment variables if storing long-term

## If You Lose the Token

1. Go to https://github.com/settings/tokens
2. Find and delete the old token
3. Generate a new one
