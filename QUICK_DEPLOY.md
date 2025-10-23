# cPanel Deployment - Quick Start Guide

This is a simplified version for quick reference. See `DEPLOYMENT_GUIDE.md` for full details.

## 🚀 Quick Deployment Steps

### 1️⃣ Prepare Locally (5 minutes)

```bash
# Navigate to project
cd /Users/user/Documents/Copilot/accruefy

# Update production backend URL in .env.production
# Replace "api.yourdomain.com" with your actual subdomain

# Build frontend
npm run build

# Package backend
cd server
zip -r backend-deploy.zip . -x "node_modules/*" -x "uploads/*" -x ".env"
cd ..
```

**Files ready:**
- ✅ `dist/` folder (frontend)
- ✅ `server/backend-deploy.zip` (backend)

---

### 2️⃣ Deploy Backend (10 minutes)

**cPanel Steps:**
1. **File Manager** → Create folder: `accruefy-backend`
2. Upload `backend-deploy.zip` → Extract → Delete zip
3. Create `.env` file with:
   ```
   EMAIL_SERVICE=gmail
   EMAIL_USER=segujjashome@gmail.com
   EMAIL_PASSWORD=your-gmail-app-password
   ADMIN_EMAIL=laconradoecks@gmail.com
   PORT=3001
   NODE_ENV=production
   ```
4. **Setup Node.js App** → Create Application:
   - Application root: `accruefy-backend`
   - Startup file: `server.js`
   - URL: `api.yourdomain.com`
5. **Terminal** → Run:
   ```bash
   source /path/to/nodevenv/activate  # (copy from Node.js App page)
   cd accruefy-backend
   npm install
   ```
6. Verify: Visit `https://api.yourdomain.com/health`

---

### 3️⃣ Deploy Frontend (5 minutes)

**cPanel Steps:**
1. **File Manager** → `/public_html/` → Create folder: `accruefy`
2. Upload ALL files from local `dist/` folder
3. Create `.htaccess` file:
   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```
4. Verify: Visit `https://yourdomain.com/accruefy`

---

### 4️⃣ Configure SSL (2 minutes)

**cPanel Steps:**
1. **SSL/TLS Status** → Enable **AutoSSL**
2. Wait 5-10 minutes
3. Verify both URLs have HTTPS:
   - ✅ `https://yourdomain.com`
   - ✅ `https://api.yourdomain.com`

---

### 5️⃣ Test Everything (5 minutes)

- [ ] Frontend loads: `https://yourdomain.com/accruefy`
- [ ] Backend health: `https://api.yourdomain.com/health`
- [ ] Submit test form through portal
- [ ] Email received at `laconradoecks@gmail.com`
- [ ] Admin dashboard login works
- [ ] View submission details
- [ ] Download files
- [ ] Download ZIP

---

## ✅ Done!

**Your URLs:**
- 🌐 Website: `https://yourdomain.com/accruefy`
- 📝 Portal: `https://yourdomain.com/accruefy/portal`
- 🔐 Admin: `https://yourdomain.com/accruefy/admin`
- 🔌 API: `https://api.yourdomain.com`

**Next Steps:**
1. Change admin password (currently: `admin123`)
2. Test with real client submissions
3. Set up backups in cPanel
4. Monitor disk usage monthly

---

## 🆘 Common Issues

**Backend won't start:**
- Check Node.js logs in cPanel
- Verify `.env` file exists and has correct values
- Try restarting Node.js app in cPanel

**Frontend shows blank page:**
- Check `.htaccess` file exists
- Open browser console (F12) for errors
- Verify `VITE_BACKEND_URL` in `.env.production`

**"Network Error" in admin:**
- Backend not running → Restart Node.js app
- Wrong API URL → Check `.env.production`
- CORS issue → Check backend logs

**Emails not sending:**
- Verify Gmail App Password (not regular password)
- Check `.env` file has correct credentials
- Test from cPanel Terminal

---

## 📚 Need More Help?

See `DEPLOYMENT_GUIDE.md` for detailed instructions and troubleshooting.
