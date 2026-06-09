# Olalekan Ogundimu — Personal Brand Platform

A production-grade personal brand platform built with **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Firebase Firestore**, and **Framer Motion**.

Every piece of content is fully dynamic — managed from the admin dashboard with **zero hardcoded data**.

---

## 🗂 Project Structure

```
src/
├── app/
│   ├── page.tsx                  # Home page (all sections)
│   ├── blog/
│   │   ├── page.tsx              # Blog listing
│   │   └── [slug]/page.tsx       # Individual article
│   ├── mentorship/page.tsx       # Mentorship + application form
│   ├── schedule/page.tsx         # Book a call
│   └── admin/
│       ├── layout.tsx            # Admin shell + auth guard
│       ├── login/page.tsx        # Firebase Auth login
│       ├── page.tsx              # Dashboard overview
│       ├── projects/page.tsx     # CRUD + GitHub import
│       ├── articles/page.tsx     # Rich text editor + publish workflow
│       ├── skills/page.tsx       # Skill bars CRUD
│       ├── certifications/page.tsx
│       ├── testimonials/page.tsx
│       ├── contact-requests/page.tsx
│       ├── mentorship/page.tsx   # Application review
│       ├── newsletter/page.tsx   # Subscriber list + CSV export
│       ├── analytics/page.tsx    # View counts
│       ├── media/page.tsx        # Firebase Storage uploads
│       └── settings/page.tsx     # Full profile / site config
├── components/
│   ├── layout/PublicLayout.tsx   # Nav + Footer
│   ├── sections/                 # All public page sections
│   └── admin/AdminUI.tsx         # Shared admin components
├── lib/
│   ├── firebase.ts               # Firebase init
│   ├── firestore.ts              # All DB functions + TypeScript types
│   ├── github.ts                 # GitHub REST API integration
│   └── auth-context.tsx          # Firebase Auth context
└── styles/globals.css            # Design tokens + utility classes
```

---

## 🚀 Quick Start

### 1. Clone and Install

```bash
git clone <your-repo>
cd oo-platform
npm install
```

### 2. Create a Firebase Project

1. Go to [firebase.google.com/console](https://firebase.google.com/console)
2. Click **Add project** → give it a name
3. **Enable Firestore Database** (Production mode)
4. **Enable Firebase Storage**
5. **Enable Authentication** → Sign-in method → **Email/Password**
6. Create your admin user: **Authentication** → **Users** → **Add user**
   - Email: `ogundimuolalekan55@gmail.com` (or your preferred admin email)
   - Password: choose a strong password
7. Go to **Project Settings** → **Your apps** → **Web app** → copy the config

### 3. Configure Environment Variables

```bash
cp .env.local.example .env.local
```

Fill in `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

NEXT_PUBLIC_ADMIN_EMAIL=ogundimuolalekan55@gmail.com

# Optional: for GitHub repo import in admin
NEXT_PUBLIC_GITHUB_USERNAME=your-github-username
GITHUB_TOKEN=ghp_your_personal_access_token
```

### 4. Set Firestore Security Rules

In Firebase Console → **Firestore** → **Rules**, paste the contents of `firestore.rules`.

In Firebase Console → **Storage** → **Rules**, paste the contents of `storage.rules`.

### 5. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Admin dashboard: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 📋 Admin Dashboard Guide

### First-Time Setup (Do this in order)

1. **Settings** → Fill in your profile (name, bio, photo URL, contact info, social links, stats)
2. **Skills** → Add your technical skills by category with proficiency levels
3. **Certifications** → Add your AWS and other professional certifications
4. **Projects** → Add projects manually, or click **Import from GitHub** to pull your repos
5. **Testimonials** → Add testimonials from clients and colleagues
6. **Articles** → Write and publish your first blog post using the rich text editor

### GitHub Integration

- Set `NEXT_PUBLIC_GITHUB_USERNAME` in `.env.local`
- In **Admin → Projects**, click **Import from GitHub**
- Select any public repo to pre-fill the form (title, description, URL, language, topics)
- Review and customize, then save

### Publishing Articles

1. Go to **Admin → Articles → + New Article**
2. Write using the rich text editor (bold, headings, lists, blockquotes, code blocks)
3. Fill in category, tags, cover image URL in the sidebar
4. Click **Save Draft** to save without publishing, or **Publish** to make it live
5. Reading time is calculated automatically

### Media Uploads

1. Go to **Admin → Media Library**
2. Drag & drop images (PNG, JPG, SVG) or PDFs
3. Files upload to Firebase Storage
4. Click **Copy URL** to get the direct link, then paste it into project/article forms

---

## 🌍 Deployment

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Add all your `.env.local` variables to Vercel's **Environment Variables** in the project settings.

### Deploy to Netlify

```bash
npm run build
# Deploy the .next folder
```

---

## 🔑 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | ✅ | Firebase web API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | ✅ | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ✅ | Firebase project ID |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | ✅ | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | ✅ | Firebase sender ID |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | ✅ | Firebase app ID |
| `NEXT_PUBLIC_ADMIN_EMAIL` | ✅ | Email of the admin user |
| `NEXT_PUBLIC_GITHUB_USERNAME` | Optional | GitHub username for repo import |
| `GITHUB_TOKEN` | Optional | GitHub PAT for higher API rate limits |
| `NEXT_PUBLIC_SITE_URL` | Optional | Your production URL (for SEO) |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + CSS custom properties |
| Animations | Framer Motion |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| Storage | Firebase Storage |
| Rich Text | TipTap Editor |
| File Uploads | react-dropzone |
| Notifications | react-hot-toast |
| GitHub Data | GitHub REST API v3 |

---

## 📬 Contact

**Olalekan Ogundimu**
- Email: ogundimuolalekan55@gmail.com
- LinkedIn: [linkedin.com/in/olalekanogundimu](https://www.linkedin.com/in/olalekanogundimu)
- Instagram: [@mr_sams01](https://www.instagram.com/mr_sams01)
- Phone: +234 812 942 4016
