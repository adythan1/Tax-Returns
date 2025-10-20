# 🚀 Quick Start Guide - Portal Google Drive Integration

## What You Have Now

✅ A complete serverless Portal system that:
- Uploads user documents to Google Drive
- Sends email notifications to admin
- Works without a dedicated backend server
- Organized 3-step form for better UX

## 5-Minute Setup (Do This First)

### 1. Google Service Account (~5 min)

**Go to:** https://console.cloud.google.com

1. Click **Select a project** → **New Project**
   - Name: "Accruefy Portal"
   - Click **Create**

2. Wait for project creation, then select it

3. Click **☰ Menu** → **APIs & Services** → **Library**
   - Search: "Google Drive API"
   - Click **Enable**

4. Click **☰ Menu** → **IAM & Admin** → **Service Accounts**
   - Click **+ Create Service Account**
   - Name: `accruefy-uploads`
   - Click **Create and Continue**
   - Role: Select **Editor**
   - Click **Continue** → **Done**

5. Click on the service account you just created

6. Go to **Keys** tab → **Add Key** → **Create New Key**
   - Type: **JSON**
   - Click **Create**
   - **Save this file securely!** (You'll need it in step 3)

7. Copy the `client_email` from the JSON (looks like: `accruefy-uploads@...`)

### 2. Create Google Drive Folder (~2 min)

**Go to:** https://drive.google.com

1. Click **+ New** → **Folder**
   - Name: "Portal Submissions"
   - Click **Create**

2. Right-click the folder → **Share**
   - Paste the `client_email` from step 1.7
   - Change role to **Editor**
   - **Uncheck** "Notify people"
   - Click **Share**

3. Open the folder, copy the folder ID from URL:
   ```
   https://drive.google.com/drive/folders/COPY_THIS_PART
   ```
   Save this ID for step 3!

### 3. Configure Environment Variables (~3 min)

**In your project folder:**

1. Copy the example file:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and fill in:
   ```bash
   # Paste folder ID from step 2.3
   GOOGLE_DRIVE_FOLDER_ID=paste_folder_id_here
   
   # Open the JSON file from step 1.6, copy ENTIRE contents
   GOOGLE_SERVICE_ACCOUNT_KEY='paste_entire_json_here'
   
   # Your Gmail (or create SendGrid account)
   EMAIL_USER=your-email@gmail.com
   
   # Gmail App Password (see below) or SendGrid API key
   EMAIL_PASSWORD=your_password_here
   
   # Where notifications go
   ADMIN_EMAIL=info@mytaxreturns.com
   ```

### 4. Create Gmail App Password (~2 min)

**If using Gmail:**

1. Go to: https://myaccount.google.com
2. Click **Security**
3. Enable **2-Step Verification** (if not enabled)
4. Search for "App passwords"
5. Select:
   - App: **Mail**
   - Device: **Other** → "Accruefy Portal"
6. Click **Generate**
7. **Copy the 16-character password** → Paste in `.env` as `EMAIL_PASSWORD`

**Alternative: Use SendGrid (recommended for production)**
- Sign up at: https://sendgrid.com
- Free tier: 100 emails/day
- Get API key from dashboard

### 5. Test It! (~2 min)

```bash
# Install dependencies (if not done)
npm install

# Start dev server
npm run dev
```

**Visit:** http://localhost:8080/portal

**Test the flow:**
1. Fill out personal info → Next
2. Fill out tax info → Next
3. Upload a test file → Submit
4. Check your admin email!
5. Check Google Drive folder!

### 6. Deploy to Vercel (~3 min)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy (test)
vercel
```

**Add environment variables in Vercel:**
1. Go to: https://vercel.com/dashboard
2. Select your project
3. **Settings** → **Environment Variables**
4. Add all variables from your `.env` file
5. Click **Save**

**Deploy to production:**
```bash
vercel --prod
```

**Your Portal is now live!** 🎉

---

## Troubleshooting

### "Invalid credentials" error
- Check `GOOGLE_SERVICE_ACCOUNT_KEY` is the **entire** JSON (including `{` and `}`)
- Make sure it's wrapped in **single quotes** in `.env`

### "Permission denied" on Drive
- Did you share the folder with the service account email?
- Is the folder ID correct?

### Email not sending
- Gmail: Check App Password is 16 chars, no spaces
- Gmail: Is 2FA enabled?
- Try SendGrid instead

### Nothing happens when I submit
- Check browser console for errors
- Check Vercel logs (if deployed)
- Make sure `/api/submit-portal` endpoint exists

---

## What Happens When User Submits?

1. **Frontend collects data:**
   - Personal info (name, email, phone, SSN, address)
   - Tax info (status, year, service type)
   - Documents (W2, IDs, forms, etc.)

2. **API creates Drive folder:**
   - Name: `FirstName_LastName_2024-10-17`
   - Location: Inside your "Portal Submissions" folder

3. **API uploads files:**
   - Each file uploaded to the folder
   - Organized and ready to access

4. **Admin gets email:**
   ```
   Subject: New Portal Submission - John Doe
   
   [All form data]
   
   Google Drive Folder: [Click to view]
   
   Files uploaded:
   - W2_Form.pdf
   - Drivers_License.jpg
   - SSN_Card.jpg
   ```

5. **User sees success:**
   - Toast notification
   - Form resets
   - Ready for next submission

---

## File Structure

```
your-project/
├── api/
│   └── submit-portal.ts        ← Serverless API endpoint
├── src/
│   └── pages/
│       └── DocumentUpload.tsx  ← Updated Portal form
├── .env                        ← Your secrets (NOT in Git)
├── .env.example                ← Template
├── vercel.json                 ← Deployment config
├── API_SETUP.md                ← Detailed setup guide
├── PORTAL_README.md            ← Full documentation
└── IMPLEMENTATION_SUMMARY.md   ← What we built
```

---

## Security Checklist

Before going live:

- [ ] `.env` file is in `.gitignore` ✓
- [ ] Service account JSON not committed to Git ✓
- [ ] Gmail App Password used (not main password) ✓
- [ ] Drive folder is **private** (not public)
- [ ] Admin email is correct
- [ ] Test submission works end-to-end
- [ ] Consider adding CAPTCHA for production
- [ ] Consider encrypting SSN before email

---

## Need Help?

**Read:**
- `API_SETUP.md` - Detailed step-by-step
- `PORTAL_README.md` - Complete reference
- `IMPLEMENTATION_SUMMARY.md` - What we built

**Check:**
- Browser DevTools Console (F12)
- Vercel Function Logs
- Email spam folder

**Common Issues:**
- Forgot to enable Drive API
- Service account email not shared on folder
- Wrong folder ID
- Invalid JSON format in env var
- Gmail 2FA not enabled

---

## You're All Set! 🎉

Once you complete steps 1-6, your Portal will:
- ✅ Accept user submissions
- ✅ Upload documents to Drive
- ✅ Email you with folder links
- ✅ Work seamlessly on Vercel

**Estimated Total Time:** 15-20 minutes

**Cost:** $0 (free tier)

**Scalability:** Handles hundreds of submissions/month on free tier

---

**Questions?** Check the detailed docs or ask!

**Ready to test?** Run `npm run dev` and go to `/portal`!

