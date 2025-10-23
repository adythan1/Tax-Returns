# Pre-Deployment Checklist for Namecheap cPanel

Complete these tasks BEFORE deploying to production.

## 📝 Local Environment Tasks

### 1. Change Admin Password
- [ ] Open `src/pages/AdminDashboard.tsx`
- [ ] Line 59: Change `"admin123"` to a strong password
- [ ] Save and rebuild frontend

### 2. Create Production Environment File
- [ ] Create `.env.production` in root folder:
  ```
  VITE_BACKEND_URL=https://api.yourdomain.com
  ```
- [ ] Replace `api.yourdomain.com` with your actual subdomain

### 3. Update API URLs
- [ ] Search for any hardcoded `localhost:3001` in code
- [ ] Replace with environment variable usage: `import.meta.env.VITE_BACKEND_URL`

### 4. Build Production Frontend
- [ ] Run: `npm run build`
- [ ] Verify `dist/` folder created
- [ ] Check build has no errors

### 5. Prepare Backend Package
- [ ] Run: `cd server && zip -r backend-deploy.zip . -x "node_modules/*" -x "uploads/*" -x ".env"`
- [ ] Verify zip file created (~50KB without node_modules)

### 6. Test Locally One More Time
- [ ] Start backend: `cd server && node server.js`
- [ ] Start frontend: `npm run dev`
- [ ] Test full form submission
- [ ] Test admin dashboard
- [ ] Test file downloads
- [ ] Test ZIP download
- [ ] Verify email sent

---

## 🌐 Namecheap Account Setup

### 7. cPanel Access
- [ ] Login to Namecheap account
- [ ] Access cPanel for your hosting
- [ ] Note your cPanel username: `________________`

### 8. Domain/Subdomain Configuration
- [ ] Main domain/subdomain for frontend: `________________`
- [ ] API subdomain for backend: `________________`
- [ ] Both pointing to correct directories

### 9. Node.js Support Check
- [ ] cPanel → "Setup Node.js App" available
- [ ] Node.js version 18.x or higher available
- [ ] Note Node.js version: `________________`

### 10. SSL/HTTPS Preparation
- [ ] AutoSSL enabled in cPanel
- [ ] Wait for SSL certificates (5-10 min after domain setup)

---

## 📧 Email Configuration

### 11. Gmail App Password
- [ ] Gmail 2FA enabled on `segujjashome@gmail.com`
- [ ] App Password created
- [ ] Password saved securely: `________________`
- [ ] Test email works from production

---

## 🚀 Deployment Execution

### 12. Backend Deployment
- [ ] Upload `backend-deploy.zip` to cPanel
- [ ] Extract to `/home/username/accruefy-backend/`
- [ ] Create `.env` file with production values
- [ ] Setup Node.js App in cPanel
- [ ] Install dependencies: `npm install`
- [ ] Verify backend running: `https://api.yourdomain.com/health`

### 13. Frontend Deployment
- [ ] Upload `dist/` contents to `/public_html/accruefy/`
- [ ] Create `.htaccess` for React Router
- [ ] Test frontend loads: `https://yourdomain.com/accruefy`

### 14. Uploads Directory
- [ ] Create `/home/username/accruefy-backend/uploads/`
- [ ] Set permissions: `chmod 755 uploads`

---

## ✅ Post-Deployment Testing

### 15. Frontend Tests
- [ ] Homepage loads correctly
- [ ] All navigation links work
- [ ] Portal page accessible
- [ ] Admin page accessible
- [ ] No console errors (F12)

### 16. Backend Tests
- [ ] Health endpoint: `https://api.yourdomain.com/health`
- [ ] CORS working (no errors in browser console)
- [ ] API responding to requests

### 17. Full Integration Tests
- [ ] Submit test form through portal
- [ ] Email notification received
- [ ] Files uploaded to server
- [ ] Files visible in admin dashboard
- [ ] Download single file works
- [ ] Download ZIP works
- [ ] Admin login works with new password

### 18. Security Checks
- [ ] HTTPS enabled (padlock in browser)
- [ ] No sensitive data in browser console
- [ ] Admin password changed from default
- [ ] `.env` file not accessible via web

---

## 📊 Monitoring Setup

### 19. Set Up Monitoring
- [ ] Bookmark cPanel → Resource Usage
- [ ] Bookmark cPanel → Error Logs
- [ ] Note disk space usage: `______ GB / ______ GB`

### 20. Backup Plan
- [ ] Schedule cPanel automatic backups
- [ ] Test manual download of uploads folder
- [ ] Save backup locally

---

## 📞 Emergency Contacts

### Support Information
- **Namecheap Support:** 24/7 Live Chat
- **cPanel Username:** `________________`
- **Hosting Plan:** `________________`
- **Domain:** `________________`

### Application Credentials
- **Admin Password:** `________________` (keep secure!)
- **Email Account:** `segujjashome@gmail.com`
- **Admin Email:** `laconradoecks@gmail.com`

---

## 🎯 Launch Readiness

### Final Checks
- [ ] All checklist items above completed
- [ ] Test submission successful end-to-end
- [ ] Admin dashboard fully functional
- [ ] SSL certificates active
- [ ] Performance acceptable (page loads <3 seconds)
- [ ] No errors in logs

### Share With Team
- [ ] Portal URL: `https://yourdomain.com/accruefy/portal`
- [ ] Admin URL: `https://yourdomain.com/accruefy/admin`
- [ ] Admin password shared securely

---

## 🎉 Ready to Launch!

Once all items are checked, your application is ready for production use!

**Remember:**
- Monitor disk usage monthly
- Back up uploads folder regularly
- Keep Node.js and packages updated
- Review server logs for errors

**Need Help?**
- Refer to `DEPLOYMENT_GUIDE.md` for detailed instructions
- Contact Namecheap support for hosting issues
- Check browser console (F12) for frontend errors
- Check cPanel logs for backend errors

Good luck! 🚀
