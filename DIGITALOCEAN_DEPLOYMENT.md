# DigitalOcean Apache Deployment Guide

## Prerequisites

Before starting, ensure you have:
- A DigitalOcean account
- A domain name (e.g., myquicktaxreturns.com)
- SSH access to your droplet
- Basic command line knowledge

## Step 1: Create and Configure Droplet

### 1.1 Create Droplet
1. Log into DigitalOcean
2. Click "Create" → "Droplets"
3. Choose configuration:
   - **Image**: Ubuntu 22.04 LTS
   - **Plan**: Basic ($6/month minimum - 1GB RAM, 1 vCPU)
   - **Datacenter**: Choose closest to your users
   - **Authentication**: SSH keys (recommended) or password
   - **Hostname**: accruefy-production

### 1.2 Point Domain to Droplet
1. Copy your droplet's IP address
2. Go to your domain registrar (Namecheap, etc.)
3. Add DNS A records:
   ```
   A Record: @ → YOUR_DROPLET_IP
   A Record: www → YOUR_DROPLET_IP
   A Record: api → YOUR_DROPLET_IP
   ```
4. Wait 5-30 minutes for DNS propagation

## Step 2: Initial Server Setup

### 2.1 Connect to Droplet
```bash
ssh root@YOUR_DROPLET_IP
```

### 2.2 Update System
```bash
apt update && apt upgrade -y
```

### 2.3 Install Required Software
```bash
# Install Apache
apt install apache2 -y

# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install nodejs -y

# Verify installations
apache2 -v
node -v
npm -v

# Install PM2 (Process Manager for Node.js)
npm install -g pm2

# Install Certbot for SSL
apt install certbot python3-certbot-apache -y
```

## Step 3: Configure Apache

### 3.1 Enable Required Apache Modules
```bash
a2enmod proxy
a2enmod proxy_http
a2enmod rewrite
a2enmod ssl
systemctl restart apache2
```

### 3.2 Create Virtual Host for Frontend
```bash
nano /etc/apache2/sites-available/accruefy-frontend.conf
```

Add this configuration:
```apache
<VirtualHost *:80>
    ServerName myquicktaxreturns.com
    ServerAlias www.myquicktaxreturns.com
    
    DocumentRoot /var/www/accruefy/frontend
    
    <Directory /var/www/accruefy/frontend>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # React Router support
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    ErrorLog ${APACHE_LOG_DIR}/accruefy-frontend-error.log
    CustomLog ${APACHE_LOG_DIR}/accruefy-frontend-access.log combined
</VirtualHost>
```

### 3.3 Create Virtual Host for Backend API
```bash
nano /etc/apache2/sites-available/accruefy-backend.conf
```

Add this configuration:
```apache
<VirtualHost *:80>
    ServerName api.myquicktaxreturns.com
    
    # Proxy to Node.js backend
    ProxyPreserveHost On
    ProxyPass / http://127.0.0.1:3001/
    ProxyPassReverse / http://127.0.0.1:3001/
    
    # Enable CORS if needed
    Header always set Access-Control-Allow-Origin "*"
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
    
    ErrorLog ${APACHE_LOG_DIR}/accruefy-backend-error.log
    CustomLog ${APACHE_LOG_DIR}/accruefy-backend-access.log combined
</VirtualHost>
```

### 3.4 Enable Sites
```bash
# Disable default site
a2dissite 000-default.conf

# Enable your sites
a2ensite accruefy-frontend.conf
a2ensite accruefy-backend.conf

# Test configuration
apache2ctl configtest

# Reload Apache
systemctl reload apache2
```

## Step 4: Deploy Application Code

### 4.1 Create Application Directories
```bash
mkdir -p /var/www/accruefy/frontend
mkdir -p /var/www/accruefy/backend
```

### 4.2 Upload Backend Code

**Option A: Using Git (Recommended)**
```bash
cd /var/www/accruefy/backend
git clone https://bitbucket.org/laconrado/accruefy.git temp
mv temp/server/* .
rm -rf temp
```

**Option B: Using SCP from Local Machine**
```bash
# Run this on your LOCAL machine
cd /Users/user/Documents/Copilot/accruefy
scp -r server/* root@YOUR_DROPLET_IP:/var/www/accruefy/backend/
```

### 4.3 Install Backend Dependencies
```bash
cd /var/www/accruefy/backend
npm install --production
```

### 4.4 Create Backend .env File
```bash
nano /var/www/accruefy/backend/.env
```

Add your configuration:
```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=myquicktaxreturns@gmail.com
EMAIL_PASSWORD=your_app_password_here
ADMIN_EMAIL=info@kyzersolutions.com

# Server Configuration
PORT=3001
NODE_ENV=production

# API URL (optional)
API_URL=https://api.myquicktaxreturns.com
```

### 4.5 Create Uploads Directory
```bash
mkdir -p /var/www/accruefy/backend/uploads
chmod 755 /var/www/accruefy/backend/uploads
```

## Step 5: Build and Deploy Frontend

### 5.1 Build Frontend Locally
```bash
# Run on your LOCAL machine
cd /Users/user/Documents/Copilot/accruefy

# Update API URL in your code if needed
# Create production .env file
echo "VITE_API_URL=https://api.myquicktaxreturns.com" > .env.production

# Build
npm run build
```

### 5.2 Upload Frontend Build
```bash
# Run on your LOCAL machine
cd /Users/user/Documents/Copilot/accruefy
scp -r dist/* root@YOUR_DROPLET_IP:/var/www/accruefy/frontend/
```

## Step 6: Start Backend with PM2

### 6.1 Create PM2 Ecosystem File
```bash
nano /var/www/accruefy/backend/ecosystem.config.js
```

Add this configuration:
```javascript
module.exports = {
  apps: [{
    name: 'accruefy-backend',
    script: 'server.js',
    cwd: '/var/www/accruefy/backend',
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: '/var/log/accruefy-backend-error.log',
    out_file: '/var/log/accruefy-backend-out.log',
    log_file: '/var/log/accruefy-backend-combined.log',
    time: true
  }]
};
```

### 6.2 Start Application
```bash
cd /var/www/accruefy/backend
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 6.3 Verify Backend is Running
```bash
pm2 status
pm2 logs accruefy-backend

# Test backend directly
curl http://localhost:3001/health
```

## Step 7: Set Up SSL Certificates

### 7.1 Install SSL for Frontend
```bash
certbot --apache -d myquicktaxreturns.com -d www.myquicktaxreturns.com
```

### 7.2 Install SSL for Backend
```bash
certbot --apache -d api.myquicktaxreturns.com
```

Follow the prompts:
- Enter your email address
- Agree to terms of service
- Choose to redirect HTTP to HTTPS (recommended)

### 7.3 Test SSL Auto-Renewal
```bash
certbot renew --dry-run
```

## Step 8: Set Permissions

```bash
# Set ownership
chown -R www-data:www-data /var/www/accruefy

# Set proper permissions
find /var/www/accruefy -type d -exec chmod 755 {} \;
find /var/www/accruefy -type f -exec chmod 644 {} \;

# Ensure uploads directory is writable
chmod 775 /var/www/accruefy/backend/uploads
chown -R www-data:www-data /var/www/accruefy/backend/uploads
```

## Step 9: Configure Firewall

```bash
# Enable UFW firewall
ufw enable

# Allow SSH (important!)
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Check status
ufw status
```

## Step 10: Verify Deployment

### 10.1 Check Services
```bash
# Apache status
systemctl status apache2

# PM2 status
pm2 status

# Backend logs
pm2 logs accruefy-backend --lines 50
```

### 10.2 Test Endpoints
```bash
# Frontend
curl https://myquicktaxreturns.com

# Backend health check
curl https://api.myquicktaxreturns.com/health

# Backend API
curl https://api.myquicktaxreturns.com/api/admin/submissions
```

### 10.3 Test in Browser
1. Visit https://myquicktaxreturns.com
2. Navigate through pages
3. Try submitting a test form
4. Check admin dashboard: https://myquicktaxreturns.com/admin

## Maintenance Commands

### View Application Logs
```bash
# PM2 logs
pm2 logs accruefy-backend
pm2 logs accruefy-backend --lines 100

# Apache logs
tail -f /var/log/apache2/accruefy-frontend-error.log
tail -f /var/log/apache2/accruefy-backend-error.log
```

### Restart Application
```bash
# Restart backend
pm2 restart accruefy-backend

# Restart Apache
systemctl restart apache2
```

### Update Application
```bash
# Backend update
cd /var/www/accruefy/backend
git pull  # if using git
npm install --production
pm2 restart accruefy-backend

# Frontend update (build locally, then upload)
scp -r dist/* root@YOUR_DROPLET_IP:/var/www/accruefy/frontend/
```

### Monitor Resources
```bash
# System resources
htop

# PM2 monitoring
pm2 monit

# Disk usage
df -h

# Check uploads folder size
du -sh /var/www/accruefy/backend/uploads
```

## Troubleshooting

### Backend Not Starting
```bash
# Check PM2 logs
pm2 logs accruefy-backend

# Test server directly
cd /var/www/accruefy/backend
node server.js
```

### Frontend Shows Blank Page
```bash
# Check Apache logs
tail -f /var/log/apache2/accruefy-frontend-error.log

# Verify files uploaded
ls -la /var/www/accruefy/frontend

# Check permissions
ls -ld /var/www/accruefy/frontend
```

### API Calls Failing
```bash
# Test backend directly
curl http://localhost:3001/health

# Check proxy is working
curl https://api.myquicktaxreturns.com/health

# Check Apache backend logs
tail -f /var/log/apache2/accruefy-backend-error.log
```

### Email Not Sending
```bash
# Check .env file
cat /var/www/accruefy/backend/.env

# Check PM2 logs for email errors
pm2 logs accruefy-backend | grep -i email
```

### File Upload Issues
```bash
# Check uploads directory permissions
ls -la /var/www/accruefy/backend/uploads

# Fix permissions if needed
chmod 775 /var/www/accruefy/backend/uploads
chown -R www-data:www-data /var/www/accruefy/backend/uploads
```

## Security Best Practices

### 1. Secure SSH
```bash
# Disable root login
nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
systemctl restart sshd
```

### 2. Regular Updates
```bash
# Set up automatic security updates
apt install unattended-upgrades
dpkg-reconfigure --priority=low unattended-upgrades
```

### 3. Backup Strategy
```bash
# Create backup script
nano /root/backup.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /var/www/accruefy/backend/uploads

# Backup configuration
tar -czf $BACKUP_DIR/config_$DATE.tar.gz /var/www/accruefy/backend/.env /etc/apache2/sites-available

# Keep only last 7 days
find $BACKUP_DIR -type f -mtime +7 -delete
```

Make executable:
```bash
chmod +x /root/backup.sh
```

Add to crontab (daily at 2am):
```bash
crontab -e
# Add: 0 2 * * * /root/backup.sh
```

## Performance Optimization

### Enable Apache Compression
```bash
a2enmod deflate
systemctl restart apache2
```

### Enable Apache Caching
```bash
a2enmod expires
a2enmod headers
systemctl restart apache2
```

Add to frontend VirtualHost:
```apache
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

## Quick Reference

### Useful Commands
```bash
# Service Management
systemctl status apache2
systemctl restart apache2
pm2 status
pm2 restart accruefy-backend

# Logs
pm2 logs accruefy-backend
tail -f /var/log/apache2/accruefy-frontend-error.log
tail -f /var/log/apache2/accruefy-backend-error.log

# SSL Renewal
certbot renew

# System Monitoring
htop
df -h
free -h
```

### Important File Locations
- Frontend: `/var/www/accruefy/frontend`
- Backend: `/var/www/accruefy/backend`
- Uploads: `/var/www/accruefy/backend/uploads`
- Apache configs: `/etc/apache2/sites-available/`
- Apache logs: `/var/log/apache2/`
- PM2 logs: `/var/log/accruefy-backend-*.log`

## Support

If you encounter issues:
1. Check application logs (PM2 and Apache)
2. Verify DNS is propagated: `nslookup myquicktaxreturns.com`
3. Test backend directly: `curl http://localhost:3001/health`
4. Check firewall rules: `ufw status`
5. Review Apache error logs

---

**Deployment Checklist:**
- [ ] Droplet created and accessible
- [ ] DNS records configured
- [ ] Apache and Node.js installed
- [ ] Virtual hosts configured
- [ ] Backend code deployed
- [ ] Backend .env configured
- [ ] Backend started with PM2
- [ ] Frontend built and deployed
- [ ] SSL certificates installed
- [ ] Firewall configured
- [ ] Application tested in browser
- [ ] Email notifications tested
- [ ] File uploads tested
- [ ] Admin dashboard tested
- [ ] Backup script configured
