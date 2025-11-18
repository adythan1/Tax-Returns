#!/bin/bash

# QuickTaxReturns - SSH/SFTP Deployment Script
# Use this if your hosting supports SSH access

set -e

echo "🚀 Starting QuickTaxReturns Deployment (SSH/SFTP)..."

# Build
echo "📦 Building frontend..."
npm run build

if [ ! -d "dist" ]; then
  echo "❌ Error: dist folder not found."
  exit 1
fi

# Load SSH credentials from .env.deploy
if [ ! -f ".env.deploy" ]; then
  echo "⚠️  Creating .env.deploy template..."
  cat > .env.deploy << 'EOF'
# SSH/SFTP Deployment Configuration
SSH_HOST=yourdomain.com
SSH_USER=your-username
SSH_PORT=22
REMOTE_PATH=/home/username/public_html/accruefy/
# Optional: SSH_KEY=/path/to/private/key
EOF
  echo "❌ Please edit .env.deploy with your SSH credentials"
  exit 1
fi

source .env.deploy

echo "📤 Deploying to $SSH_USER@$SSH_HOST..."

# Using rsync (fast, only uploads changed files)
if [ -n "$SSH_KEY" ]; then
  rsync -avz --delete -e "ssh -p $SSH_PORT -i $SSH_KEY" dist/ $SSH_USER@$SSH_HOST:$REMOTE_PATH
else
  rsync -avz --delete -e "ssh -p $SSH_PORT" dist/ $SSH_USER@$SSH_HOST:$REMOTE_PATH
fi

echo ""
echo "🎉 Deployment successful!"
echo "🌐 Visit your site to see the changes"
echo ""
