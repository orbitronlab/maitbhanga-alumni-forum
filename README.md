# 🎓 Maitbhanga High School Alumni Forum

<div align="center">
  <h3>Official Alumni Portal — Sandwip, Chattogram, Bangladesh</h3>
  <p>Connecting generations of Maitbhanga High School alumni since 2024</p>

  ![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
  ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-green?logo=postgresql)
  ![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)
  ![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)
</div>

---

## 🌐 Live Website

| Environment | URL |
|---|---|
| **Production** | https://alumni-4fiyp6pkk-orbitron-lab-s-projects.vercel.app |
| **Vercel Dashboard** | https://vercel.com/orbitron-lab-s-projects/alumni |
| **GitHub Repo** | https://github.com/orbitronlab/maitbhanga-alumni-forum |

---

## 🔑 Login Credentials

> **Default password for all test accounts:** `Admin@123456`

| Role | Email | Password | Access |
|---|---|---|---|
| **Super Admin** | `admin@maitbhangaalumni.org` | `Admin@123456` | Full access — all admin panels |
| **Admin / Moderator** | `moderator@maitbhangaalumni.org` | `Admin@123456` | Moderator — approve users, events |
| **Demo Alumni** | `demo.alumni@maitbhangaalumni.org` | `Admin@123456` | Member view — profile, events |

> ⚠️ **Change all passwords immediately after first login in production!**

---

## 🗄️ Database — Neon PostgreSQL

| Item | Value |
|---|---|
| **Provider** | Neon (Serverless PostgreSQL) |
| **Project ID** | `noisy-moon-58091820` |
| **Database** | `neondb` |
| **Region** | `us-east-1` (AWS) |
| **Console** | https://console.neon.tech/app/projects/noisy-moon-58091820 |

### Connection Strings

```env
# Pooled (for app/API usage — use this in production)
DATABASE_URL="postgresql://neondb_owner:npg_f6Ysimuj7SVe@ep-fragrant-forest-adb4pojc-pooler.c-2.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"

# Unpooled (for migrations/prisma deploy)
DATABASE_URL_UNPOOLED="postgresql://neondb_owner:npg_f6Ysimuj7SVe@ep-fragrant-forest-adb4pojc.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

---

## 🔧 Environment Variables

### Required in Vercel (Production)

```env
# Database
DATABASE_URL="postgresql://neondb_owner:npg_f6Ysimuj7SVe@ep-fragrant-forest-adb4pojc-pooler.c-2.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"

# NextAuth
NEXTAUTH_URL="https://alumni-4fiyp6pkk-orbitron-lab-s-projects.vercel.app"
NEXTAUTH_SECRET="maitbhanga-alumni-super-secret-key-2024-secure-production-xyz789"

# App URL
NEXT_PUBLIC_APP_URL="https://alumni-4fiyp6pkk-orbitron-lab-s-projects.vercel.app"

# Email (Gmail SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="orbitronlab@gmail.com"
SMTP_PASS="izkjnktbmhzhyjgg"
SMTP_FROM="Maitbhanga Alumni Forum <orbitronlab@gmail.com>"
```

### Local Development (`.env.local`)

```env
DATABASE_URL="postgresql://neondb_owner:npg_f6Ysimuj7SVe@ep-fragrant-forest-adb4pojc-pooler.c-2.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="maitbhanga-alumni-super-secret-key-change-in-production-32chars"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="orbitronlab@gmail.com"
SMTP_PASS="izkjnktbmhzhyjgg"
SMTP_FROM="Maitbhanga Alumni Forum <orbitronlab@gmail.com>"
```

---

## 🇧🇩 Bilingual Feature — EN / বাংলা

The site supports **English and Bangla** language switching:

- **Toggle Location:** Top-right corner of the **Homepage Hero section** (pill-shaped EN / বাং switcher with gold animation)
- **Navbar toggle:** Also present in the navigation bar (desktop and mobile)
- **Persistence:** Language choice saved to `localStorage` — persists across page reloads
- **Fonts:** English uses `Outfit` / `Inter` — Bangla uses `Noto Serif Bengali` (Google Fonts)

### Pages with full translation:
- ✅ Navbar (all links, auth menu)  
- ✅ Hero Section  
- ✅ Stats Section  
- ✅ Join CTA Section  

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.7 |
| **Styling** | Tailwind CSS 3 + Custom Design System |
| **Animations** | Framer Motion 11 |
| **ORM** | Prisma 5 |
| **Database** | PostgreSQL (Neon serverless) |
| **Auth** | NextAuth v5 (beta) |
| **Email** | Nodemailer + Gmail SMTP |
| **Payments** | bKash / Nagad / SSLCommerz (wired, needs keys) |
| **Storage** | Cloudinary (needs keys) |
| **Deployment** | Vercel (Singapore region) |
| **CI/CD** | GitHub → Vercel auto-deploy |

---

## 🗂️ Project Structure

```
alumni/
├── app/
│   ├── (auth)/          # Login, Register pages
│   ├── (public)/        # Homepage + public pages
│   │   ├── page.tsx     # Home
│   │   ├── about/
│   │   ├── events/
│   │   ├── news/
│   │   ├── gallery/
│   │   ├── donate/
│   │   └── contact/
│   ├── (protected)/     # Alumni dashboard, profile
│   ├── admin/           # Admin panel (role-gated)
│   └── api/             # API routes (auth, donations, events…)
├── components/
│   ├── home/            # HeroSection, StatsSection, JoinCTA…
│   ├── layout/          # Navbar, Footer
│   └── ui/              # LanguageToggle, HomeLangToggle, Button…
├── lib/
│   ├── i18n/            # translations.ts, LanguageContext.tsx
│   ├── prisma.ts        # Prisma client singleton
│   ├── auth.ts          # NextAuth config
│   └── email/           # Email templates
├── prisma/
│   ├── schema.prisma    # Full DB schema (20 tables)
│   ├── seed.ts          # Initial data seeder
│   └── migrations/      # SQL migration history
└── vercel.json          # Vercel build config
```

---

## 🛠️ Local Development Setup

```bash
# 1. Clone the repo
git clone https://github.com/orbitronlab/maitbhanga-alumni-forum.git
cd maitbhanga-alumni-forum

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Copy env file and fill in values
cp .env.example .env.local
# Edit .env.local with your values

# 4. Push schema to database
npm run db:push

# 5. Seed initial data
npm run db:seed

# 6. Start development server
npm run dev
```

Open http://localhost:3000

---

## 📋 NPM Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run db:push` | Push Prisma schema to DB |
| `npm run db:seed` | Seed initial data |
| `npm run db:migrate` | Create new migration |
| `npm run db:migrate:prod` | Deploy migrations (production) |
| `npm run db:studio` | Open Prisma Studio |

---

## 🔐 Admin Panel

Access the admin dashboard at `/admin/dashboard` after logging in as Super Admin or Admin.

**Admin Features:**
- 👥 Member management (approve/reject registrations)
- 📅 Event creation and management
- 💰 Donation campaign management
- 📰 News & announcements
- 🖼️ Gallery management
- 📊 Dashboard analytics
- 📨 Broadcast messages to alumni
- ⚙️ Site settings

---

## 💳 Payment Setup (Not yet active)

To enable payments, add these to your `.env`:

```env
# bKash
BKASH_BASE_URL="https://tokenized.sandbox.bka.sh/v1.2.0-beta"
BKASH_APP_KEY="your-key"
BKASH_APP_SECRET="your-secret"
BKASH_USERNAME="your-username"
BKASH_PASSWORD="your-password"

# Nagad
NAGAD_BASE_URL="http://sandbox.mynagad.com:10080/remote-payment-gateway-1.0"
NAGAD_MERCHANT_ID="your-merchant-id"

# SSLCommerz
SSLCOMMERZ_STORE_ID="your-store-id"
SSLCOMMERZ_STORE_PASSWD="your-password"
```

---

## 🌐 GitHub Repository

- **Repo:** https://github.com/orbitronlab/maitbhanga-alumni-forum
- **Branch:** `master`
- **Auto-Deploy:** Every push to `master` triggers a Vercel deployment

### To deploy updates:
```bash
git add -A
git commit -m "your message"
git push
```
Or double-click **`deploy.bat`** in the project root.

---

## 🗃️ Database Tables (20 total)

| Table | Description |
|---|---|
| `users` | Alumni user accounts |
| `profiles` | Extended alumni profile data |
| `alumni_batches` | SSC batches (1990–2025) |
| `events` | Events and reunions |
| `event_registrations` | Event sign-ups |
| `campaigns` | Donation campaigns |
| `donations` | Donation records |
| `payments` | Payment transactions |
| `messages` | Admin messages |
| `message_recipients` | Message delivery tracking |
| `notifications` | User notifications |
| `news` | News articles and notices |
| `gallery` | Photo/video items |
| `gallery_albums` | Gallery collections |
| `settings` | Site configuration |
| `audit_logs` | Admin action history |
| `accounts` | OAuth provider accounts |
| `sessions` | Auth sessions |
| `verification_tokens` | Email verification |

---

## 📞 Contact & Support

| Item | Value |
|---|---|
| **School** | Maitbhanga High School, Sandwip, Chattogram |
| **Forum Email** | info@maitbhangaalumni.org |
| **Dev Email** | orbitronlab@gmail.com |
| **Facebook** | https://facebook.com/maitbhangaalumni |

---

## 🛡️ Security Notes

> [!CAUTION]
> The credentials in this README are for **development/testing only**.
> Before going fully public:
> 1. Change all admin passwords
> 2. Rotate `NEXTAUTH_SECRET` to a proper 32-char random string
> 3. Set up a custom domain in Vercel
> 4. Enable Vercel's Deployment Protection settings
> 5. Store secrets in Vercel Environment Variables — not in code

---

## 📄 License

Private project — All rights reserved © 2024 Maitbhanga High School Alumni Forum.

---

<div align="center">
  <p>Built with ❤️ for the Maitbhanga community</p>
  <p><strong>মাইটভাঙ্গা উচ্চ বিদ্যালয় প্রাক্তন ছাত্র ফোরাম</strong></p>
</div>
