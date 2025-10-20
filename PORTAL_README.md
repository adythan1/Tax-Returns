# Accruefy Portal - Google Drive Integration

## ✅ What's Been Implemented

A complete serverless solution for Portal submissions that:
- ✅ Uploads user documents to Google Drive
- ✅ Creates organized folders per submission (e.g., `John_Doe_2024-10-17`)
- ✅ Sends email notifications to admin with Drive folder link
- ✅ Works without a dedicated backend server
- ✅ 3-step wizard form for better UX

## 🏗️ Architecture

```
Portal Form (React)
       ↓
   FormData with files
       ↓
/api/submit-portal (Vercel Serverless)
       ↓
   ┌───────┴───────┐
   ↓               ↓
Google Drive    Email (Admin)
(File Storage)  (Notification)
```

## 📁 Files Created/Modified

### New Files:
- `api/submit-portal.ts` - Serverless API endpoint
- `vercel.json` - Vercel deployment config
- `.env.example` - Environment variables template
- `API_SETUP.md` - Detailed setup instructions

### Modified Files:
- `src/pages/DocumentUpload.tsx` - Wired to API endpoint
- `package.json` - Added dependencies (googleapis, nodemailer, formidable)

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Google Drive

Follow the detailed guide in `API_SETUP.md`, but here's the quick version:

1. **Create Service Account:**
   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Enable Google Drive API
   - Create service account
   - Download JSON key

2. **Create Drive Folder:**
   - Create "Portal Submissions" folder in Google Drive
   - Share with service account email (from JSON)
   - Copy folder ID from URL

### 3. Set Up Email

**Option A: Gmail (Quick)**
```bash
# Enable 2FA in Google Account
# Generate App Password
# Use in .env
```

**Option B: SendGrid (Production)**
```bash
# Sign up at sendgrid.com
# Get API key
# Modify api/submit-portal.ts to use SendGrid
```

### 4. Configure Environment Variables

Create `.env` file:
```bash
GOOGLE_DRIVE_FOLDER_ID=your_folder_id
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account",...}'
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=info@mytaxreturns.com
```

### 5. Test Locally

```bash
npm run dev
```

Visit: http://localhost:8080/portal

### 6. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Deploy to production
vercel --prod
```

## 📧 Email Notification Format

Admin receives an email with:
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
Google Drive Folder: [Link]

Files uploaded:
- W2 Form.pdf
- Drivers License.jpg
- SSN Card.jpg
```

## 🔐 Security

- ✅ All uploads encrypted in transit (HTTPS)
- ✅ Service account credentials stored in env variables
- ✅ Files uploaded to private Drive folder
- ✅ No file storage on serverless function (direct stream to Drive)
- ✅ Email credentials never exposed to frontend
- ⚠️ SSN data sent via email (consider encryption for production)

## 📊 Flow Diagram

```
User fills Portal form (3 steps)
  ↓
Step 1: Personal Info
  ↓
Step 2: Tax Info
  ↓
Step 3: Upload Documents
  ↓
Submit → Frontend sends FormData to /api/submit-portal
  ↓
API creates Drive folder: "FirstName_LastName_2024-10-17"
  ↓
API uploads each file to folder
  ↓
API sends email to admin with:
  - All form data
  - Link to Drive folder
  - List of uploaded files
  ↓
Frontend shows success message
```

## 🎯 Next Steps (Optional Enhancements)

### Immediate:
- [ ] Test with real Google service account
- [ ] Configure production email (SendGrid recommended)
- [ ] Deploy to Vercel

### Future:
- [ ] Add file size/type validation
- [ ] Implement rate limiting
- [ ] Add CAPTCHA to prevent spam
- [ ] Encrypt SSN before sending email
- [ ] Send confirmation email to user
- [ ] Add upload progress indicators
- [ ] Store submission metadata in database
- [ ] Create admin dashboard to view submissions

## 🐛 Troubleshooting

### "Invalid credentials"
- Check `GOOGLE_SERVICE_ACCOUNT_KEY` is valid JSON
- Verify service account has Drive API enabled

### "Permission denied"
- Share Drive folder with service account email
- Check `GOOGLE_DRIVE_FOLDER_ID` is correct

### "Email not sending"
- Verify Gmail 2FA is enabled
- Check App Password is correct (16 chars, no spaces)
- Try SendGrid for production

### "Module not found"
- Run `npm install` after pulling repo
- Check `node_modules` exists

### Files not uploading locally
- API works in Vercel/serverless environment
- For local dev, ensure port matches (`npm run dev` uses 8080)

## 📝 Environment Variables Reference

```bash
# Required
GOOGLE_DRIVE_FOLDER_ID=       # From Drive folder URL
GOOGLE_SERVICE_ACCOUNT_KEY=   # JSON from Google Cloud
EMAIL_USER=                   # Gmail or SendGrid
EMAIL_PASSWORD=               # App password or API key
ADMIN_EMAIL=                  # Where notifications go

# Optional
NODE_ENV=production           # production/development
```

## 🤝 Support

Need help? Check:
1. `API_SETUP.md` for detailed setup
2. Vercel logs for deployment errors
3. Browser console for frontend errors
4. Server logs for API errors

---

**Built with:** React + TypeScript + Vite + Vercel + Google Drive API + Nodemailer
