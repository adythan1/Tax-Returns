#!/bin/bash

# QuickTaxReturns Deployment Script
# This script builds and deploys your frontend to cPanel via FTP

set -e  # Exit on error

echo "🚀 Starting QuickTaxReturns Deployment..."

# Step 1: Build frontend
echo "📦 Building frontend..."
npm run build

if [ ! -d "dist" ]; then
  echo "❌ Error: dist folder not found. Build failed."
  exit 1
fi

echo "✅ Build complete!"

# Step 2: FTP Upload Configuration
# Create .env.deploy file with these variables:
# FTP_HOST=ftp.yourdomain.com
# FTP_USER=your-ftp-username
# FTP_PASS=your-ftp-password
# FTP_PATH=/public_html/accruefy/

if [ ! -f ".env.deploy" ]; then
  echo "⚠️  Creating .env.deploy template..."
  cat > .env.deploy << 'EOF'
# FTP Deployment Configuration
FTP_HOST=ftp.yourdomain.com
FTP_USER=your-ftp-username
FTP_PASS=your-ftp-password
FTP_PATH=/public_html/accruefy/
EOF
  echo "❌ Please edit .env.deploy with your FTP credentials"
  exit 1
fi

# Load FTP credentials
source .env.deploy

echo "📤 Uploading to $FTP_HOST..."

# Option 1: Using lftp (recommended - install with: brew install lftp)
if command -v lftp &> /dev/null; then
  lftp -e "
    set ftp:ssl-allow no;
    open -u $FTP_USER,$FTP_PASS $FTP_HOST;
    mirror --reverse --delete --verbose dist/ $FTP_PATH;
    bye
  "
  echo "✅ Deployment complete using lftp!"
  
# Option 2: Using ncftp (install with: brew install ncftp)
elif command -v ncftpput &> /dev/null; then
  ncftpput -R -u $FTP_USER -p $FTP_PASS $FTP_HOST $FTP_PATH dist/*
  echo "✅ Deployment complete using ncftp!"
  
else
  echo "❌ Error: No FTP client found."
  echo "Please install one:"
  echo "  brew install lftp"
  echo "  OR"
  echo "  brew install ncftp"
  exit 1
fi

echo ""
echo "🎉 Deployment successful!"
echo "🌐 Your site should be updated at your domain"
echo ""
