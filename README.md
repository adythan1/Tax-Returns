# AccrueFy Tax Returns# Welcome to your project



A modern, user-friendly web application for tax return services with secure document submission portal.## Project info



## 🚀 Project OverviewThere are several ways of editing your application.



This is a full-stack tax returns platform featuring:Changes made via Lovable will be committed automatically to this repo.

- **Marketing Website**: Home, Services, About, Contact pages

- **Client Portal**: Secure 3-step document submission wizard**Use your preferred IDE**

- **Backend API**: Node.js/Express server with email notifications

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

## 🛠️ Tech Stack

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

### Frontend

- **Vite 5** - Lightning-fast build toolFollow these steps:

- **React 18** - UI framework

- **TypeScript** - Type safety```sh

- **Tailwind CSS** - Utility-first styling# Step 1: Clone the repository using the project's Git URL.

- **shadcn-ui** - Beautiful component librarygit clone <YOUR_GIT_URL>

- **React Router** - Client-side routing

- **TanStack Query** - Data fetching# Step 2: Navigate to the project directory.

cd <YOUR_PROJECT_NAME>

### Backend

- **Node.js** - Runtime# Step 3: Install the necessary dependencies.

- **Express** - Web frameworknpm i

- **Multer** - File upload handling

- **Nodemailer** - Email notifications# Step 4: Start the development server with auto-reloading and an instant preview.

- **CORS** - Cross-origin supportnpm run dev

```

## 📦 Getting Started

**Edit a file directly in GitHub**

### Prerequisites

- Node.js 18+ and npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating))- Navigate to the desired file(s).

- Gmail account for email notifications- Click the "Edit" button (pencil icon) at the top right of the file view.

- Make your changes and commit the changes.

### Installation

**Use GitHub Codespaces**

1. **Clone the repository**

```bash- Navigate to the main page of your repository.

git clone <YOUR_GIT_URL>- Click on the "Code" button (green button) near the top right.

cd <YOUR_PROJECT_NAME>- Select the "Codespaces" tab.

```- Click on "New codespace" to launch a new Codespace environment.

- Edit files directly within the Codespace and commit and push your changes once you're done.

2. **Install frontend dependencies**

```bash## What technologies are used for this project?

npm install

```This project is built with:



3. **Install backend dependencies**- Vite

```bash- TypeScript

cd server- React

npm install- shadcn-ui

cd ..- Tailwind CSS

```

## Can I connect a custom domain to my Lovable project?

4. **Configure environment variables**

Yes, you can!

Frontend (`.env.local`):

```bashTo connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

echo "VITE_BACKEND_URL=http://localhost:3001" > .env.local

```Read more here: [Setting up a custom domain] 


Backend (`server/.env`):
```bash
cd server
cp .env.example .env
# Edit .env with your email credentials
```

5. **Start development servers**

Terminal 1 - Backend:
```bash
cd server
npm start
```

Terminal 2 - Frontend:
```bash
npm run dev
```

Visit `http://localhost:8080` 🎉

## 📚 Documentation

- **[Backend Setup Guide](server/README.md)** - Complete backend configuration
- **[Backend Comparison](BACKEND_COMPARISON.md)** - Why we chose this architecture
- **[Design Improvements](DESIGN_IMPROVEMENTS.md)** - UI/UX decisions

## 🏗️ Project Structure

```
accruefy/
├── src/                    # Frontend React application
│   ├── pages/             # Page components (Home, Portal, etc.)
│   ├── components/        # Reusable UI components
│   ├── hooks/             # Custom React hooks
│   └── lib/               # Utilities
├── server/                # Backend Node.js application
│   ├── server.js          # Express server
│   ├── uploads/           # File storage (git-ignored)
│   └── README.md          # Backend documentation
├── public/                # Static assets
└── package.json           # Frontend dependencies
```

## 🔑 Key Features

### Client Portal
- **3-Step Wizard**: Personal Info → Tax Info → Documents
- **Smart Validation**: Step-by-step form validation
- **File Upload**: Support for W2, 1099, K1, ID documents, and more
- **Accordion UI**: Organized, collapsible document sections
- **Progress Tracking**: Visual step indicators

### Email Notifications
- Admin receives formatted submission details
- Includes all form fields and uploaded file list
- Professional HTML email template

### File Organization
- User-specific folders: `timestamp_FirstName_LastName/`
- Timestamped filenames to prevent conflicts
- Support for PDF, DOC, DOCX, JPG, PNG
- 10MB file size limit per file

## 🚀 Deployment

### Frontend (Vercel - Free)
```bash
vercel
```

### Backend Options
- **Railway** (Free tier) - Recommended
- **Heroku** (Free tier)
- **DigitalOcean** ($4/month)

See [server/README.md](server/README.md) for detailed deployment instructions.

## 🔒 Environment Variables

### Frontend
- `VITE_BACKEND_URL` - Backend API URL

### Backend
- `EMAIL_SERVICE` - Email provider (e.g., Gmail)
- `EMAIL_USER` - Email address
- `EMAIL_PASSWORD` - App password
- `ADMIN_EMAIL` - Recipient for submissions
- `PORT` - Server port (default: 3001)

## 📧 Contact Form

The Contact page uses [Formspree](https://formspree.io) for submissions.
- No backend setup required
- Form endpoint configured in `src/pages/Contact.tsx`

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

This project is private and proprietary.
