# 🚀 Simple Backend Setup (Much Easier!)

## Why This Is Better

✅ **No Google Drive API setup** - Just save files locally
✅ **No service accounts** - No complex authentication
✅ **Simple email** - Just Gmail App Password
✅ **5-minute setup** - vs 20+ minutes for serverless
✅ **Easy to debug** - Standard Node.js server
✅ **Easy to deploy** - Any hosting provider

---

## Quick Setup (5 Minutes)

### 1. Set Up Email (2 minutes)

**Option A: Gmail (Easiest)**

1. Go to: https://myaccount.google.com
2. Click **Security** → Enable **2-Step Verification**
3. Search for "App passwords"
4. Create new app password:
   - App: **Mail**
   - Device: **Other** → "Accruefy Backend"
5. **Copy the 16-character password**

**Option B: SendGrid (Production)**
- Sign up at sendgrid.com
- Free tier: 100 emails/day
- Get API key

### 2. Configure Backend (1 minute)

```bash
cd server

# Copy example env file
cp .env.example .env

# Edit .env
nano .env
```

**Add your details:**
```bash
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
ADMIN_EMAIL=info@mytaxreturns.com
PORT=3001
```

### 3. Install & Run (2 minutes)

```bash
# Install backend dependencies
npm install

# Start the server
npm start
```

You should see:
```
✅ Server running on port 3001
📧 Email configured: your-email@gmail.com
📁 Uploads directory: /path/to/server/uploads

🚀 Ready to receive Portal submissions!
```

### 4. Configure Frontend (.env.local)

**In project root:**
```bash
# Create frontend env file
echo "VITE_BACKEND_URL=http://localhost:3001" > .env.local
```

### 5. Start Frontend & Test

**In another terminal:**
```bash
# In project root
npm run dev
```

**Test it:**
1. Go to: http://localhost:8080/portal
2. Fill out the form
3. Upload test files
4. Submit
5. Check your email! 📧

---

## How It Works

```
User fills Portal form
  ↓
Frontend sends to: http://localhost:3001/api/submit-portal
  ↓
Backend saves files to: server/uploads/timestamp_FirstName_LastName/
  ↓
Backend sends email to admin with:
  - All form data
  - List of uploaded files
  - File location on server
  ↓
Frontend shows success message
```

---

## File Structure

```
server/
├── server.js           ← Main server file
├── package.json        ← Dependencies
├── .env               ← Your secrets
├── .env.example       ← Template
└── uploads/           ← Files saved here (auto-created)
    └── 1234567_John_Doe/
        ├── w2.pdf
        ├── license.jpg
        └── ssn.jpg
```

---

## What Gets Emailed

Admin receives:
```
Subject: New Portal Submission - John Doe

Personal Information:
- Name: John Doe
- Email: john@example.com
- Phone: (555) 123-4567
- SSN: XXX-XX-XXXX
- Address: 123 Main St

Tax Information:
- Filing Status: Single
- Tax Year: 2024
- Service Type: Individual Tax Filing

Uploaded Documents:
✅ W2 Form:
  📄 W2_2024.pdf (245 KB)
  
✅ Driver's License:
  📄 License_Front.jpg (1.2 MB)
  
✅ 1099 Form:
  📄 1099_INT.pdf (156 KB)

Files Location:
/path/to/server/uploads/1234567_John_Doe
```

---

## Production Deployment

### Option 1: DigitalOcean (Easiest)

**$4/month** - Simple droplet

```bash
# On your droplet
git clone your-repo
cd your-repo/server
npm install
npm install -g pm2

# Set up env
nano .env

# Start with PM2 (keeps running)
pm2 start server.js --name accruefy-backend
pm2 save
pm2 startup
```

**Update frontend .env:**
```bash
VITE_BACKEND_URL=http://your-droplet-ip:3001
```

### Option 2: Heroku (Free Tier)

```bash
# In server folder
heroku create accruefy-backend
heroku config:set EMAIL_USER=your-email@gmail.com
heroku config:set EMAIL_PASSWORD=your-app-password
heroku config:set ADMIN_EMAIL=info@mytaxreturns.com
git push heroku main
```

**Update frontend .env:**
```bash
VITE_BACKEND_URL=https://accruefy-backend.herokuapp.com
```

### Option 3: Railway (Easy)

1. Go to railway.app
2. Click "New Project" → "Deploy from GitHub"
3. Select your repo
4. Add environment variables
5. Done! Get your URL

---

## Advantages Over Serverless

| Feature | Simple Backend | Serverless (Previous) |
|---------|---------------|---------------------|
| Setup Time | 5 minutes | 20+ minutes |
| Configuration | .env file | Google Console + Service Account |
| File Storage | Local folder | Google Drive API |
| Email | Direct send | Via API |
| Debugging | Console logs | Function logs |
| Cost (low traffic) | $4-12/month | Free (complex setup) |
| Ease | ⭐⭐⭐⭐⭐ | ⭐⭐ |

---

## Testing

```bash
# Test server is running
curl http://localhost:3001/health

# Should return: {"status":"ok","message":"Server is running"}
```

**Test form submission:**
1. Start backend: `npm start` (in server/)
2. Start frontend: `npm run dev` (in project root)
3. Go to Portal: http://localhost:8080/portal
4. Fill & submit
5. Check email and `server/uploads/` folder

---

## Troubleshooting

### Server won't start
```bash
# Check if port is already in use
lsof -i :3001

# Kill the process or change port in .env
```

### Email not sending
- Check Gmail App Password is correct (16 chars, no spaces)
- Verify 2FA is enabled
- Try sending a test email

### Files not uploading
- Check `server/uploads/` folder exists
- Check file size limits (10MB per file)
- Check file type (PDF, DOC, JPG, PNG only)

### CORS errors
- Backend has CORS enabled by default
- If deployed, update `cors()` in server.js with your frontend URL

---

## Security

✅ Files stored on your server (not public cloud)
✅ Email via authenticated SMTP
✅ File type validation
✅ File size limits
✅ CORS protection

**For production:**
- Use HTTPS (SSL certificate)
- Add rate limiting
- Consider file encryption
- Regular backups of uploads folder

---

## Next Steps

1. ✅ Set up Gmail App Password
2. ✅ Configure server/.env
3. ✅ Run `npm install` in server/
4. ✅ Start server: `npm start`
5. ✅ Configure frontend .env.local
6. ✅ Test submission
7. ✅ Deploy to production

---

## Cost Comparison

### Development (Free)
- Run locally on your machine

### Production Options:

**DigitalOcean Droplet:** $4-12/month
- Simple, reliable
- Full control
- SSH access

**Heroku:** Free tier / $7/month
- Easy deployment
- No server management

**Railway:** Free tier / $5/month
- Modern interface
- Easy setup

**AWS EC2:** Variable
- Most scalable
- Most complex

---

**Recommendation:** Start with DigitalOcean $4 droplet or Railway free tier

---

## Summary

✅ **Much simpler** than Google Drive API setup
✅ **5 minutes** to get running
✅ **Easy to debug** and maintain
✅ **Standard Node.js** - easy to hire help
✅ **Files saved locally** - you control them
✅ **$4-12/month** vs free-but-complex serverless

**This is the lean, practical solution!** 🚀

---

Need help? Check:
- Server logs: `tail -f server/logs.txt`
- Files location: `ls server/uploads/`
- Test endpoint: `curl localhost:3001/health`
