# Deployment Guide - Namecheap cPanel

This guide will help you deploy AccrueFy Tax Returns to Namecheap shared hosting with cPanel.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ Namecheap hosting account with cPanel access
- ✅ Node.js support enabled (check cPanel → Setup Node.js App)
- ✅ Domain or subdomain configured
- ✅ Gmail App Password for email notifications
- ✅ FTP/SFTP access credentials

---

## 🏗️ Architecture Overview

```
yourdomain.com              → Frontend (React app)
api.yourdomain.com          → Backend (Node.js/Express)
/home/username/uploads/     → File storage
```

---

## 📦 Part 1: Backend Deployment (Node.js)

### Step 1: Build Backend Package

On your local machine:

```bash
cd /Users/user/Documents/Copilot/accruefy/server

# Create deployment package
zip -r backend-deploy.zip . -x "node_modules/*" -x "uploads/*" -x ".env"
```

### Step 2: Upload via cPanel File Manager

1. Login to cPanel
2. Go to **File Manager**
3. Navigate to `/home/yourusername/`
4. Create folder: `accruefy-backend`
5. Upload `backend-deploy.zip`
6. Extract the zip file
7. Delete the zip file after extraction

### Step 3: Configure Environment Variables

1. In cPanel File Manager, go to `accruefy-backend`
2. Create new file: `.env`
3. Add the following content:

```env
# Email Configuration
EMAIL_SERVICE=gmail
EMAIL_USER=segujjashome@gmail.com
EMAIL_PASSWORD=your-gmail-app-password-here
ADMIN_EMAIL=laconradoecks@gmail.com

# Server Configuration
PORT=3001
NODE_ENV=production
```

⚠️ **Important:** Replace `your-gmail-app-password-here` with your actual Gmail App Password

### Step 4: Set Up Node.js Application

1. In cPanel, go to **"Setup Node.js App"**
2. Click **"Create Application"**
3. Configure:
   - **Node.js version:** 18.x or higher
   - **Application mode:** Production
   - **Application root:** `accruefy-backend`
   - **Application URL:** `api.yourdomain.com` (or subdomain)
   - **Application startup file:** `server.js`
   - **Environment variables:** (add from .env if needed)

4. Click **"Create"**
5. Copy the command shown (looks like: `source /home/user/nodevenv/...`)
6. Open **Terminal** in cPanel
7. Run the copied command
8. Navigate to backend: `cd accruefy-backend`
9. Install dependencies: `npm install`
10. Start the app (cPanel usually auto-starts it)

### Step 5: Verify Backend is Running

Test in browser: `https://api.yourdomain.com/health`

Should return:
```json
{"status":"ok","message":"Server is running"}
```

---

## 🎨 Part 2: Frontend Deployment (React)

### Step 1: Update Frontend Configuration

On your local machine:

```bash
cd /Users/user/Documents/Copilot/accruefy

# Create production environment file
echo "VITE_BACKEND_URL=https://api.yourdomain.com" > .env.production
```

⚠️ **Important:** Replace `api.yourdomain.com` with your actual backend URL

### Step 2: Build Frontend

```bash
npm run build
```

This creates a `dist/` folder with optimized production files.

### Step 3: Upload Frontend via cPanel

1. In cPanel File Manager, go to `/public_html/`
2. Create folder: `accruefy` (or use root if main domain)
3. Upload all files from `dist/` folder
4. Folder structure should look like:
   ```
   /public_html/accruefy/
   ├── index.html
   ├── assets/
   │   ├── index-[hash].js
   │   └── index-[hash].css
   └── ...
   ```

### Step 4: Configure .htaccess for React Router

Create `/public_html/accruefy/.htaccess`:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>

# Enable CORS (if needed)
<IfModule mod_headers.c>
  Header set Access-Control-Allow-Origin "*"
</IfModule>

# Compression
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

---

## 🔐 Part 3: SSL Certificate Setup

1. In cPanel, go to **SSL/TLS Status**
2. Enable **AutoSSL** (free Let's Encrypt certificates)
3. Wait 5-10 minutes for certificates to be issued
4. Verify both domains have SSL:
   - ✅ `https://yourdomain.com`
   - ✅ `https://api.yourdomain.com`

---

## 📁 Part 4: File Upload Directory Setup

### Create Uploads Directory

In cPanel Terminal:

```bash
cd /home/yourusername/accruefy-backend
mkdir uploads
chmod 755 uploads
```

### Set Permissions

Ensure Node.js app can write to uploads:

```bash
chown yourusername:yourusername uploads
```

---

## ✅ Part 5: Testing Deployment

### 1. Test Frontend
Visit: `https://yourdomain.com/accruefy`

Should see:
- ✅ Homepage loads
- ✅ Navigation works
- ✅ All pages accessible

### 2. Test Backend API
Visit: `https://api.yourdomain.com/health`

Should return:
```json
{"status":"ok","message":"Server is running"}
```

### 3. Test Portal Submission

1. Go to: `https://yourdomain.com/accruefy/portal`
2. Fill out the form
3. Upload test documents
4. Submit
5. Check admin email for notification
6. Verify files in: `/home/yourusername/accruefy-backend/uploads/`

### 4. Test Admin Dashboard

1. Go to: `https://yourdomain.com/accruefy/admin`
2. Login with password: `admin123`
3. Should see submissions
4. Click "View" to see details
5. Download individual files
6. Download ZIP

---

## 🔧 Troubleshooting

### Backend Not Starting

**Check Node.js logs:**
```bash
# In cPanel Terminal
cd accruefy-backend
tail -f logs/nodejs.log
```

**Common issues:**
- ❌ Port already in use → Change PORT in .env
- ❌ Missing dependencies → Run `npm install` again
- ❌ Permission denied → Check folder permissions

### Frontend Not Loading

**Check .htaccess:**
- Ensure it exists in frontend root
- Check Apache error logs in cPanel

**Common issues:**
- ❌ 404 on refresh → .htaccess missing or incorrect
- ❌ Blank page → Check browser console for errors
- ❌ API errors → Wrong VITE_BACKEND_URL

### File Upload Errors

**Check permissions:**
```bash
ls -la uploads/
# Should show: drwxr-xr-x yourusername yourusername
```

**Common issues:**
- ❌ Permission denied → Run `chmod 755 uploads`
- ❌ Disk quota exceeded → Check cPanel disk usage
- ❌ Files not appearing → Check uploads/ folder path

### Email Not Sending

**Check Gmail settings:**
- ✅ 2FA enabled on Gmail account
- ✅ App Password created (not regular password)
- ✅ Correct credentials in .env

**Test email:**
```bash
# In cPanel Terminal
cd accruefy-backend
node -e "require('dotenv').config(); console.log(process.env.EMAIL_USER)"
```

---

## 📊 Monitoring & Maintenance

### Check Disk Usage

In cPanel → **Disk Usage**
- Monitor uploads folder size
- Clean up old submissions if needed

### Backup Strategy

**Manual Backup:**
1. Download uploads folder via FTP monthly
2. Export submissions as needed

**Automated (via cPanel):**
1. Go to **Backup Wizard**
2. Schedule automatic backups
3. Store off-site

### Update Application

**Backend updates:**
```bash
# Local machine
cd server
zip -r backend-update.zip . -x "node_modules/*" -x "uploads/*" -x ".env"

# Upload to cPanel, extract, restart Node.js app
```

**Frontend updates:**
```bash
# Local machine
npm run build
# Upload dist/ contents to /public_html/accruefy/
```

---

## 🚀 Performance Optimization

### Enable Caching

Add to `.htaccess`:
```apache
# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### Monitor Performance

In cPanel → **Metrics** → **Resource Usage**
- CPU usage should be <10%
- Memory should be <100MB
- If higher, consider upgrading plan

---

## 📞 Support Resources

**Namecheap Support:**
- Live Chat: Available 24/7
- Knowledge Base: https://www.namecheap.com/support/knowledgebase/
- Node.js Setup: Search "Node.js application cPanel"

**Application Issues:**
- Check server logs in cPanel
- Check browser console (F12)
- Review this deployment guide

---

## 🎯 Post-Deployment Checklist

- [ ] Backend running on `https://api.yourdomain.com`
- [ ] Frontend accessible on `https://yourdomain.com`
- [ ] SSL certificates active (padlock in browser)
- [ ] Test form submission works
- [ ] Email notifications received
- [ ] Files uploaded to server
- [ ] Admin dashboard accessible
- [ ] File downloads working
- [ ] ZIP download working
- [ ] Change admin password from default
- [ ] Set up automated backups
- [ ] Monitor disk usage

---

## 🔐 Security Recommendations

### 1. Change Admin Password

Edit `src/pages/AdminDashboard.tsx` line 59:
```typescript
if (password === "your-secure-password-here") {
```

Rebuild and redeploy frontend.

### 2. Restrict Admin Access (Optional)

Add to `/public_html/accruefy/admin/.htaccess`:
```apache
# Password protect admin section
AuthType Basic
AuthName "Admin Area"
AuthUserFile /home/yourusername/.htpasswd
Require valid-user
```

### 3. Regular Updates

- Keep Node.js version updated in cPanel
- Update npm packages monthly:
  ```bash
  cd accruefy-backend
  npm update
  ```

---

## 📈 Scaling Considerations

### When to Upgrade Hosting

Monitor these metrics monthly:
- **Disk usage** > 80% → Upgrade storage
- **Submissions** > 500/month → Consider VPS
- **CPU** consistently high → Upgrade plan

### Migration to VPS

If outgrowing shared hosting:
1. Keep same code (works on VPS)
2. Copy uploads folder
3. Update DNS
4. No code changes needed!

---

## 🎉 Deployment Complete!

Your AccrueFy Tax Returns application is now live and ready to accept client submissions!

**Live URLs:**
- Website: `https://yourdomain.com/accruefy`
- Portal: `https://yourdomain.com/accruefy/portal`
- Admin: `https://yourdomain.com/accruefy/admin`
- API: `https://api.yourdomain.com`

**Next Steps:**
1. Test thoroughly with real data
2. Share portal link with clients
3. Monitor submissions in admin dashboard
4. Set up regular backups
5. Update admin password for security

Good luck with your tax returns business! 🚀
