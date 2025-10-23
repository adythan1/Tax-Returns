# Project Structure

This document provides a comprehensive overview of the AccrueFy Tax Returns project architecture.

## 📁 Directory Overview

```
accruefy/
├── 📄 Configuration Files (Root)
├── 🎨 Frontend Application (src/)
├── ⚙️ Backend Server (server/)
└── 📦 Static Assets (public/)
```

---

## 📄 Root Configuration Files

### Development & Build
- `vite.config.ts` - Vite build configuration
- `tsconfig.json` - TypeScript base config
- `tsconfig.app.json` - TypeScript app config
- `tsconfig.node.json` - TypeScript Node config
- `package.json` - Frontend dependencies
- `bun.lockb` - Bun lock file

### Styling
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.js` - PostCSS configuration
- `components.json` - shadcn-ui configuration

### Linting & Quality
- `eslint.config.js` - ESLint rules

### Environment
- `.env.local` - Frontend environment variables (git-ignored)
- `.env.local.example` - Frontend env template

### Documentation
- `README.md` - Main project documentation
- `BACKEND_COMPARISON.md` - Backend architecture decision
- `DESIGN_IMPROVEMENTS.md` - UI/UX decisions

### Web
- `index.html` - HTML entry point
- `robots.txt` - SEO crawler instructions

---

## 🎨 Frontend Application (`src/`)

### Entry Points
```
src/
├── main.tsx          # Application entry point
├── App.tsx           # Root component with routing
├── App.css           # Global app styles
├── index.css         # Global styles with Tailwind
└── vite-env.d.ts     # Vite TypeScript definitions
```

### Pages (`src/pages/`)
Core application pages with routing:

- `Index.tsx` - Landing page wrapper
- `Home.tsx` - Homepage with hero and CTA
- `Services.tsx` - Services overview
- `About.tsx` - Company information
- `Contact.tsx` - Contact form with Formspree
- `DocumentUpload.tsx` - **Portal** (3-step wizard)
- `NotFound.tsx` - 404 error page

**Portal (DocumentUpload.tsx) Details:**
```tsx
// 3-Step Wizard Structure
Step 1: Personal Information
  - Name, Email, Phone, Address
  
Step 2: Tax Information  
  - Filing Status, Dependents, Income Types
  
Step 3: Documents
  - Accordion sections:
    • Identification (DL, SSN Card)
    • Income Forms (W2, 1099, K1)
    • Health Coverage (1095)
    • Other Documents
```

### Components (`src/components/`)

#### Layout
- `Layout.tsx` - Main layout wrapper with header/footer

#### UI Library (`src/components/ui/`)
shadcn-ui components (48 total):
- Forms: `input.tsx`, `button.tsx`, `textarea.tsx`, `form.tsx`, `label.tsx`, `checkbox.tsx`, `radio-group.tsx`, `select.tsx`, `switch.tsx`
- Display: `card.tsx`, `badge.tsx`, `avatar.tsx`, `alert.tsx`, `toast.tsx`, `progress.tsx`, `skeleton.tsx`
- Navigation: `navigation-menu.tsx`, `menubar.tsx`, `breadcrumb.tsx`, `tabs.tsx`, `pagination.tsx`
- Overlays: `dialog.tsx`, `sheet.tsx`, `drawer.tsx`, `alert-dialog.tsx`, `popover.tsx`, `tooltip.tsx`, `hover-card.tsx`
- Containers: `accordion.tsx`, `collapsible.tsx`, `scroll-area.tsx`, `resizable.tsx`, `sidebar.tsx`
- Data: `table.tsx`, `calendar.tsx`, `chart.tsx`, `carousel.tsx`
- Interactive: `command.tsx`, `context-menu.tsx`, `dropdown-menu.tsx`, `slider.tsx`, `toggle.tsx`, `toggle-group.tsx`
- Other: `separator.tsx`, `aspect-ratio.tsx`, `input-otp.tsx`, `sonner.tsx`

**Most Used Components in Portal:**
- `Accordion` - Document sections
- `Button` - Navigation, submission
- `Input` - Text fields
- `Card` - Content containers
- `Label` - Form labels
- `Progress` - Step indicator

### Hooks (`src/hooks/`)
- `use-mobile.tsx` - Mobile detection
- `use-toast.ts` - Toast notifications

### Library (`src/lib/`)
- `utils.ts` - Utility functions (cn, etc.)

### Assets (`src/assets/`)
- `hero-image.jpg` - Homepage hero
- `about-image.jpg` - About page image

---

## ⚙️ Backend Server (`server/`)

### Main Files
```
server/
├── server.js           # Express application
├── package.json        # Backend dependencies
├── README.md           # Setup & deployment guide
├── .env                # Environment variables (git-ignored)
├── .env.example        # Environment template
├── .gitignore          # Git ignore rules
└── uploads/            # File storage (git-ignored)
```

### Server Architecture (`server.js`)

#### Dependencies
```javascript
express       // Web framework
multer        // File upload handling
nodemailer    // Email sending
cors          // Cross-origin requests
dotenv        // Environment variables
path          // File path utilities
```

#### Key Components

**1. Multer Storage Configuration**
```javascript
// Creates user-specific folders
// Format: uploads/{timestamp}_{firstName}_{lastName}/
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = `${timestamp}_${firstName}_${lastName}`;
    // Creates folder if doesn't exist
  },
  filename: (req, file, cb) => {
    // Format: {timestamp}_{sanitized_filename}
  }
});
```

**2. File Upload Validation**
- **Allowed types**: PDF, DOC, DOCX, JPG, JPEG, PNG
- **Max size**: 10MB per file
- **Max files**: Unlimited (reasonable)

**3. Email Configuration**
```javascript
// Nodemailer transporter
{
  service: process.env.EMAIL_SERVICE,  // 'Gmail'
  auth: {
    user: process.env.EMAIL_USER,      // your-email@gmail.com
    pass: process.env.EMAIL_PASSWORD   // App Password
  }
}
```

**4. API Endpoints**
- `GET /health` - Health check
- `POST /api/submit-portal` - Form submission with files

**5. Email Template**
Professional HTML email with:
- Submission header with timestamp
- Personal information section
- Tax information section
- Uploaded files list with sizes
- User contact info

### File Organization

**Storage Pattern:**
```
server/uploads/
├── 1729712345_John_Doe/
│   ├── 1729712345_w2.pdf
│   ├── 1729712346_drivers_license.jpg
│   └── 1729712347_ssn_card.jpg
├── 1729712400_Jane_Smith/
│   ├── 1729712401_1099.pdf
│   └── 1729712402_k1.pdf
```

**Benefits:**
- ✅ Easy to find user files
- ✅ No file name conflicts
- ✅ Easy backup/migration
- ✅ Organized by submission

### Environment Variables

Required in `server/.env`:
```bash
EMAIL_SERVICE=Gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=info@mytaxreturns.com
PORT=3001
```

---

## 📦 Static Assets (`public/`)

```
public/
├── favicon.ico        # Browser tab icon
├── placeholder.svg    # Placeholder image
└── robots.txt         # SEO configuration
```

---

## 🔄 Data Flow

### Portal Submission Flow

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │ 1. User fills 3-step wizard
       │ 2. Attaches documents
       │ 3. Clicks Submit
       ▼
┌─────────────────┐
│  FormData API   │  
│  (JavaScript)   │
└──────┬──────────┘
       │ Packages form fields + files
       ▼
┌────────────────────┐
│  fetch() POST      │
│  /api/submit-portal│
└──────┬─────────────┘
       │ Sends to VITE_BACKEND_URL
       ▼
┌────────────────────┐
│  Express Server    │
│  (Backend)         │
└──────┬─────────────┘
       │ 1. Multer processes files
       │ 2. Creates user folder
       │ 3. Saves files to disk
       ▼
┌────────────────────┐
│  File System       │
│  uploads/user/     │
└────────────────────┘
       │
       ▼
┌────────────────────┐
│  Nodemailer        │
│  (Email Service)   │
└──────┬─────────────┘
       │ Sends formatted email
       ▼
┌────────────────────┐
│  Admin Email       │
│  (Gmail)           │
└────────────────────┘
       │
       ▼
┌────────────────────┐
│  Response to       │
│  Frontend          │
│  { success: true } │
└────────────────────┘
```

### Contact Form Flow

```
┌─────────────┐
│   Browser   │
│  (Contact)  │
└──────┬──────┘
       │ User fills contact form
       ▼
┌────────────────────┐
│  Formspree API     │
│  (External)        │
└──────┬─────────────┘
       │ Sends email to admin
       ▼
┌────────────────────┐
│  Admin Email       │
└────────────────────┘
```

---

## 🔧 Development Workflow

### Local Development

**Terminal 1: Backend**
```bash
cd server
npm install        # First time only
npm start          # Start Express server (port 3001)
```

**Terminal 2: Frontend**
```bash
npm install        # First time only
npm run dev        # Start Vite dev server (port 8080)
```

### Environment Setup

**1. Frontend (`.env.local`):**
```bash
VITE_BACKEND_URL=http://localhost:3001
```

**2. Backend (`server/.env`):**
```bash
EMAIL_SERVICE=Gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=info@mytaxreturns.com
PORT=3001
```

### Build Process

**Frontend:**
```bash
npm run build      # Creates dist/ folder
npm run preview    # Preview production build
```

**Backend:**
```bash
# No build step - Node.js runs directly
node server.js     # Production mode
```

---

## 🚀 Deployment Architecture

### Recommended Setup

```
┌─────────────────────────────────┐
│         Vercel CDN              │  ← Frontend (React)
│  https://accruefy.vercel.app    │
└────────────┬────────────────────┘
             │ API calls
             ▼
┌─────────────────────────────────┐
│       Railway/Heroku            │  ← Backend (Express)
│  https://api.accruefy.com       │
└────────────┬────────────────────┘
             │ Email via
             ▼
┌─────────────────────────────────┐
│          Gmail SMTP             │
│    smtp.gmail.com:587           │
└─────────────────────────────────┘
```

### Production Environment Variables

**Frontend (Vercel):**
```bash
VITE_BACKEND_URL=https://api.accruefy.com
```

**Backend (Railway/Heroku):**
```bash
EMAIL_SERVICE=Gmail
EMAIL_USER=info@mytaxreturns.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=info@mytaxreturns.com
PORT=3001  # Auto-assigned by host
```

---

## 📊 File Size Reference

### Frontend Bundle (Estimated)
- **Development**: ~5MB (unminified)
- **Production**: ~500KB (minified + gzipped)
- **Largest dependencies**:
  - React + React DOM: ~140KB
  - shadcn-ui + Radix: ~100KB
  - TanStack Query: ~50KB

### Backend
- **server.js**: ~8KB
- **node_modules**: ~15MB (express, multer, nodemailer)
- **uploads/**: Dynamic (grows with submissions)

---

## 🔐 Security Considerations

### Environment Variables
- ✅ Never commit `.env` files
- ✅ Use `.env.example` as template
- ✅ Rotate email passwords regularly

### File Uploads
- ✅ File type validation
- ✅ File size limits (10MB)
- ✅ Sanitized filenames
- ✅ User-specific folders

### CORS
- ✅ Configured for production domains
- ✅ Local development allowed

### Email
- ✅ Use Gmail App Passwords (not main password)
- ✅ 2FA required for Gmail

---

## 🧪 Testing Strategy

### Manual Testing Checklist

**Frontend:**
- [ ] All pages load correctly
- [ ] Navigation works
- [ ] Forms validate properly
- [ ] Mobile responsive
- [ ] Portal wizard transitions

**Backend:**
- [ ] Health check responds
- [ ] File uploads work
- [ ] Email sends successfully
- [ ] User folders created
- [ ] Error handling works

**Integration:**
- [ ] Frontend → Backend connection
- [ ] File upload end-to-end
- [ ] Email notification received
- [ ] Files saved correctly

---

## 📈 Future Enhancements

### Potential Features
1. **Admin Dashboard**: View all submissions
2. **Authentication**: User accounts and login
3. **Status Tracking**: Track return progress
4. **Payment Integration**: Stripe/PayPal
5. **Cloud Storage**: Migrate to AWS S3/Google Cloud
6. **Database**: PostgreSQL for submissions metadata
7. **Analytics**: Track user behavior
8. **PDF Generation**: Generate tax documents

### Scalability Path
```
Phase 1: Current (Local files + Email)
   ↓
Phase 2: Add database for metadata
   ↓
Phase 3: Migrate to cloud storage (S3)
   ↓
Phase 4: Add admin dashboard
   ↓
Phase 5: Add authentication & user accounts
```

---

## 🆘 Troubleshooting

### Common Issues

**"Cannot connect to backend"**
- Check `VITE_BACKEND_URL` in `.env.local`
- Ensure backend server is running
- Check CORS configuration

**"Email not sending"**
- Verify Gmail App Password
- Check 2FA is enabled
- Test with Gmail SMTP tester

**"Files not uploading"**
- Check file size (max 10MB)
- Verify file type (PDF, DOC, JPG, PNG)
- Check `uploads/` folder permissions

**"Port already in use"**
- Change PORT in `server/.env`
- Kill process: `lsof -ti:3001 | xargs kill`

---

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [Multer Documentation](https://github.com/expressjs/multer)
- [Nodemailer Documentation](https://nodemailer.com/)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [shadcn-ui Documentation](https://ui.shadcn.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)

---

## 📞 Support

For questions or issues:
- Check `server/README.md` for backend setup
- Check `BACKEND_COMPARISON.md` for architecture decisions
- Check `DESIGN_IMPROVEMENTS.md` for UI/UX decisions

---

**Last Updated**: October 23, 2025
