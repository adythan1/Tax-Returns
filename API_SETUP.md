# Portal Submission API - Setup Guide

## Overview
This serverless API handles Portal form submissions by:
1. Uploading documents to Google Drive (organized by user/date)
2. Sending email notifications to admin
3. Returning success/error to frontend

## Setup Steps

### 1. Google Drive Setup

#### Create Service Account:
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable **Google Drive API**
4. Go to **IAM & Admin** → **Service Accounts**
5. Click **Create Service Account**
   - Name: `accruefy-portal-uploads`
   - Click **Create and Continue**
   - Role: **Editor** (or custom role with Drive permissions)
   - Click **Done**
6. Click on the service account → **Keys** tab
7. **Add Key** → **Create New Key** → **JSON**
8. Download the JSON file (keep it secure!)

#### Create Google Drive Folder:
1. Go to [Google Drive](https://drive.google.com)
2. Create a folder called **"Portal Submissions"**
3. Right-click → **Share**
4. Add your service account email (from JSON: `client_email`)
   - Give **Editor** permission
5. Copy the folder ID from the URL:
   - URL: `https://drive.google.com/drive/folders/FOLDER_ID_HERE`

### 2. Email Setup (Gmail Example)

#### Create App Password:
1. Go to [Google Account Settings](https://myaccount.google.com)
2. **Security** → **2-Step Verification** (enable if not already)
3. Search for **App passwords**
4. Select **Mail** and **Other (Custom name)**: "Accruefy Portal"
5. Copy the generated 16-character password

**Alternative:** Use SendGrid, AWS SES, or Mailgun for production

### 3. Environment Variables

Create `.env` file in project root:

```bash
# Google Drive Configuration
GOOGLE_DRIVE_FOLDER_ID=your_folder_id_from_step_1
GOOGLE_SERVICE_ACCOUNT_KEY='{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}'

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-16-char-app-password
ADMIN_EMAIL=info@mytaxreturns.com
```

**For Vercel Deployment:**
Add these as Environment Variables in Vercel dashboard:
- Project Settings → Environment Variables
- Paste the entire JSON for `GOOGLE_SERVICE_ACCOUNT_KEY`

### 4. Install Dependencies

```bash
npm install
```

### 5. Test Locally

```bash
npm run dev
```

The API will be available at: `http://localhost:8080/api/submit-portal`

### 6. Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Add environment variables in Vercel dashboard
# Then deploy production
vercel --prod
```

## API Endpoint

**POST** `/api/submit-portal`

**Content-Type:** `multipart/form-data`

**Fields:**
- `firstName`, `lastName`, `email`, `phone`, `ssn`, `address`
- `filingStatus`, `taxYear`, `serviceType`, `additionalInfo`
- File fields: `w2`, `driversLicense`, `ssnCard`, `form1095`, `form1099`, `k1`, `other`

**Response:**
```json
{
  "success": true,
  "message": "Submission successful",
  "folderLink": "https://drive.google.com/...",
  "filesUploaded": 5
}
```

## Security Notes

- Never commit `.env` or service account JSON to Git
- Use Vercel's environment variables for production
- Consider adding rate limiting for production
- Validate file types and sizes server-side

## Troubleshooting

**"Invalid credentials" error:**
- Check service account JSON is valid
- Ensure service account has access to Drive folder

**"Permission denied" error:**
- Share Drive folder with service account email
- Check folder ID is correct

**Email not sending:**
- Verify Gmail App Password is correct
- Check 2FA is enabled
- Try SendGrid for production

## Next Steps

- [ ] Set up Google service account
- [ ] Create Drive folder and share with service account
- [ ] Configure email (Gmail app password or SendGrid)
- [ ] Add environment variables to Vercel
- [ ] Test submission locally
- [ ] Deploy to Vercel
