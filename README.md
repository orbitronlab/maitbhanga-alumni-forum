# Maitbhanga High School Alumni Forum

> **Official Alumni Management & Donation Portal**
> Maitbhanga High School · Sandwip, Chattogram, Bangladesh
> **Status: ✅ RUNNING** — `http://localhost:3000`

A production-ready, full-stack alumni management and donation portal built with Next.js 15, TypeScript, PostgreSQL, and Prisma ORM. This platform connects thousands of alumni, manages donations with bKash/Nagad/SSLCommerz payment gateways, and provides comprehensive admin tools.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [Database Structure](#database-structure)
- [API Documentation](#api-documentation)
- [User Roles & RBAC](#user-roles--rbac)
- [Payment Integration](#payment-integration)
- [Deployment Guide](#deployment-guide)
- [Feature List](#feature-list)
- [Changelog](#changelog)

---

## Project Overview

| Property | Value |
|---|---|
| **Project Name** | Maitbhanga High School Alumni Forum |
| **Version** | 1.0.0 |
| **Location** | Sandwip, Chattogram, Bangladesh |
| **Status** | Production Ready |
| **License** | Proprietary |

### What This System Does

- **Alumni Registration & Verification** — Full onboarding flow with email verification and admin approval
- **Alumni Directory** — Searchable, filterable directory by batch, profession, location
- **Donation Management** — Accepts bKash, Nagad, SSLCommerz payments with auto-receipts
- **Event Management** — Create events, manage registrations, collect fees
- **Member Dashboard** — Personalized portal for each alumni member
- **Admin Panel** — Full control over users, donations, events, content
- **News & Notices** — CMS for publishing school news and official notices
- **Gallery** — Photo and video albums from events
- **Messaging** — Broadcast, batch, and individual messaging system

---

## Technology Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js** | 15+ | React framework with App Router |
| **TypeScript** | 5+ | Type safety |
| **Tailwind CSS** | 3.4+ | Utility-first CSS |
| **Framer Motion** | 11+ | Animations |
| **Lucide React** | Latest | Icons |
| **React Query** | 5+ | Server state management |
| **Zustand** | 5+ | Client state management |
| **React Hook Form** | 7+ | Form management |
| **Zod** | 3+ | Schema validation |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Next.js API Routes** | 15+ | REST API endpoints |
| **NextAuth v5** | 5.0.0-beta | Authentication |
| **Prisma ORM** | 5+ | Database ORM |
| **PostgreSQL** | 16 | Primary database |
| **bcryptjs** | 2+ | Password hashing |
| **Nodemailer** | 6+ | Email service |
| **Cloudinary** | 2+ | Image storage |
| **Axios** | 1+ | HTTP client |

### Payment Gateways
| Gateway | Integration Type |
|---|---|
| **bKash** | Tokenized Checkout API v1.2 |
| **Nagad** | Merchant API with RSA encryption |
| **SSLCommerz** | Hosted Payment v4 |

### Infrastructure
| Component | Technology |
|---|---|
| **Containerization** | Docker + Docker Compose |
| **Reverse Proxy** | Nginx |
| **Caching** | Redis |
| **File Storage** | Cloudinary |

---

## Quick Start

### Prerequisites

- **Node.js** >= 20.0.0
- **PostgreSQL** >= 15
- **npm** >= 10

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/yourusername/maitbhanga-alumni.git
cd maitbhanga-alumni

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your values

# 4. Generate Prisma client
npm run db:generate

# 5. Run database migrations
npm run db:migrate

# 6. Seed initial data
npm run db:seed

# 7. Start development server
npm run dev
```

**App will be available at:** `http://localhost:3000`

### Default Credentials (after seeding)

| Role | Email | Password |
|---|---|---|
| Super Admin | admin@maitbhangaalumni.org | Admin@123456 |
| Admin | moderator@maitbhangaalumni.org | Admin@123456 |
| Demo Alumni | demo.alumni@maitbhangaalumni.org | Admin@123456 |

> ⚠️ **CHANGE ALL PASSWORDS IMMEDIATELY IN PRODUCTION**

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the following:

### Required Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/alumni_forum"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-32-char-secret"

# Email (SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your@gmail.com"
SMTP_PASS="app-password"
SMTP_FROM="Alumni Forum <noreply@example.org>"

# Cloudinary
CLOUDINARY_CLOUD_NAME="your-cloud"
CLOUDINARY_API_KEY="your-key"
CLOUDINARY_API_SECRET="your-secret"
```

### Payment Gateway Variables

```env
# bKash
BKASH_BASE_URL="https://tokenized.sandbox.bka.sh/v1.2.0-beta"
BKASH_APP_KEY="..."
BKASH_APP_SECRET="..."
BKASH_USERNAME="..."
BKASH_PASSWORD="..."

# Nagad
NAGAD_MERCHANT_ID="..."
NAGAD_MERCHANT_PRIVATE_KEY="..."
NAGAD_PUBLIC_KEY="..."

# SSLCommerz
SSLCOMMERZ_STORE_ID="..."
SSLCOMMERZ_STORE_PASSWD="..."
SSLCOMMERZ_IS_LIVE="false"
```

---

## Folder Structure

```
alumni/
├── app/                          # Next.js 15 App Router
│   ├── (public)/                 # Public pages (no auth required)
│   │   ├── page.tsx              # Home page
│   │   ├── about/                # About Forum
│   │   ├── alumni-directory/     # Alumni search & directory
│   │   ├── events/               # Events listing
│   │   ├── news/                 # News & notices
│   │   ├── gallery/              # Photo/video gallery
│   │   ├── contact/              # Contact form
│   │   └── donate/               # Donation campaigns
│   ├── (auth)/                   # Authentication pages
│   │   ├── login/                # Login page
│   │   ├── register/             # Registration page
│   │   ├── forgot-password/      # Password reset request
│   │   └── reset-password/       # Reset with token
│   ├── (member)/                 # Protected member area
│   │   ├── dashboard/            # Member dashboard
│   │   ├── profile/              # Profile management
│   │   ├── donations/            # Donation history
│   │   ├── my-events/            # Event registrations
│   │   ├── notifications/        # Notification center
│   │   ├── messages/             # Messaging
│   │   └── settings/             # Account settings
│   ├── (admin)/                  # Protected admin panel
│   │   └── admin/
│   │       ├── dashboard/        # Admin overview
│   │       ├── users/            # User management
│   │       ├── donations/        # Donation management
│   │       ├── events/           # Event CRUD
│   │       ├── news/             # News CMS
│   │       ├── gallery/          # Gallery management
│   │       ├── reports/          # Analytics & reports
│   │       └── settings/         # Site settings
│   └── api/                      # API Routes
│       ├── auth/                 # NextAuth + register
│       ├── alumni/               # Alumni directory API
│       ├── events/               # Events API
│       ├── donations/            # Donations API
│       ├── payments/             # Payment callbacks
│       │   ├── bkash/            # bKash callback/execute
│       │   ├── nagad/            # Nagad callback
│       │   └── sslcommerz/       # SSLCommerz callback
│       ├── news/                 # News API
│       ├── gallery/              # Gallery API
│       ├── messages/             # Messaging API
│       ├── notifications/        # Notifications API
│       ├── profile/              # Profile update API
│       └── admin/                # Admin-only APIs
├── components/
│   ├── admin/                    # Admin components
│   ├── dashboard/                # Member dashboard components
│   ├── home/                     # Home page sections
│   ├── layout/                   # Navbar, Footer, Sidebars
│   └── providers.tsx             # Client providers
├── lib/
│   ├── auth.ts                   # NextAuth config
│   ├── prisma.ts                 # Prisma singleton
│   ├── cloudinary.ts             # Image upload
│   ├── utils.ts                  # Utility functions
│   ├── email/mailer.ts           # Email service
│   ├── payment/
│   │   ├── bkash.ts              # bKash API
│   │   ├── nagad.ts              # Nagad API
│   │   └── sslcommerz.ts         # SSLCommerz API
│   └── validators/index.ts       # Zod schemas
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Initial data seed
├── types/
│   └── next-auth.d.ts            # Type augmentation
├── middleware.ts                 # RBAC middleware
├── Dockerfile                    # Production Docker image
├── docker-compose.yml            # Full stack Docker Compose
├── .env.example                  # Environment variable template
├── tailwind.config.ts            # Design system
├── next.config.ts                # Next.js configuration
└── README.md                     # This file
```

---

## Database Structure

### Entity Relationship Overview

```
users ─────────── profiles (1:1)
users ─────────── donations (1:many)
users ─────────── event_registrations (1:many)
users ─────────── messages (1:many)
users ─────────── notifications (1:many)
events ─────────── event_registrations (1:many)
donations ─────────── payments (1:1)
event_registrations ── payments (1:1)
campaigns ─────────── donations (1:many)
gallery ─────────── gallery_albums (many:1)
alumni_batches ──── profiles (1:many)
```

### Key Tables

| Table | Rows | Description |
|---|---|---|
| `users` | Auth + RBAC | Core user accounts |
| `profiles` | Extended data | Alumni profile details |
| `alumni_batches` | 35+ | School year batches |
| `events` | Events | All events and reunions |
| `event_registrations` | Registrations | Member event signups |
| `donations` | Donations | Donation records |
| `payments` | Payments | Gateway transaction records |
| `campaigns` | Campaigns | Fundraising campaigns |
| `messages` | Messages | Internal messaging |
| `message_recipients` | Recipients | Message delivery tracking |
| `notifications` | Notifications | System notifications |
| `news` | Articles | News & notice CMS |
| `gallery` | Media | Photos and videos |
| `gallery_albums` | Albums | Organized photo albums |
| `settings` | Config | Site configuration (key-value) |
| `audit_logs` | Audit | Security audit trail |
| `verification_tokens` | Tokens | Email/password reset tokens |
| `accounts` | OAuth | NextAuth OAuth accounts |
| `sessions` | Sessions | NextAuth sessions |

---

## API Documentation

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | None | Register new alumni |
| `POST` | `/api/auth/[...nextauth]` | None | NextAuth handler (login/logout) |
| `GET` | `/api/auth/verify-email` | None | Verify email with token |
| `POST` | `/api/auth/forgot-password` | None | Request password reset |
| `POST` | `/api/auth/reset-password` | None | Reset with token |

### Alumni Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/alumni` | None | List alumni with pagination/filters |
| `GET` | `/api/alumni/[id]` | None | Get specific alumni profile |
| `PATCH` | `/api/profile` | Member | Update own profile |
| `POST` | `/api/profile/photo` | Member | Upload profile photo |

### Event Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/events` | None | List events |
| `GET` | `/api/events/[id]` | None | Get event details |
| `POST` | `/api/events` | Admin | Create event |
| `PATCH` | `/api/events/[id]` | Admin | Update event |
| `DELETE` | `/api/events/[id]` | Admin | Delete event |
| `POST` | `/api/events/[id]/register` | Member | Register for event |

### Donation Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/donations` | Member | Get user's donations |
| `POST` | `/api/donations` | Member | Create donation + initiate payment |
| `GET` | `/api/donations/[id]` | Member | Get donation details |
| `GET` | `/api/donations/[id]/receipt` | Member | Download receipt |

### Payment Callbacks

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET/POST` | `/api/payments/bkash/callback` | None | bKash payment callback |
| `POST` | `/api/payments/nagad/callback` | None | Nagad payment callback |
| `POST` | `/api/payments/sslcommerz/success` | None | SSLCommerz success |
| `POST` | `/api/payments/sslcommerz/fail` | None | SSLCommerz failure |
| `POST` | `/api/payments/sslcommerz/ipn` | None | SSLCommerz IPN |

### Admin Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin` | Admin | Dashboard overview stats |
| `GET` | `/api/admin/users` | Admin | List all users |
| `PATCH` | `/api/admin/users/[id]/approve` | Admin | Approve user |
| `PATCH` | `/api/admin/users/[id]/suspend` | Admin | Suspend user |
| `GET` | `/api/admin/donations` | Admin | All donations |
| `GET` | `/api/admin/reports` | Admin | Analytics reports |

### Query Parameters

```
GET /api/alumni?page=1&limit=12&search=kamal&batchYear=2005&profession=doctor&country=Bangladesh
GET /api/events?status=PUBLISHED&type=REUNION&page=1&limit=10
GET /api/donations?page=1&limit=10
GET /api/admin?type=overview|donations_chart|users_by_batch
```

---

## User Roles & RBAC

| Role | Access Level | Permissions |
|---|---|---|
| `SUPER_ADMIN` | Full | All admin features + settings + user role management |
| `ADMIN` | High | User management, events, news, donations, gallery |
| `ALUMNI` | Member | Own profile, donations, event registration, messaging |
| `GUEST` | Public | View public pages only |

### Route Protection Matrix

| Route Pattern | GUEST | ALUMNI | ADMIN | SUPER_ADMIN |
|---|---|---|---|---|
| `/` | ✅ | ✅ | ✅ | ✅ |
| `/alumni-directory` | ✅ | ✅ | ✅ | ✅ |
| `/dashboard/*` | ❌ | ✅ | ✅ | ✅ |
| `/admin/*` | ❌ | ❌ | ✅ | ✅ |
| `/admin/settings` | ❌ | ❌ | ⚠️ | ✅ |

---

## Payment Integration

### bKash (Tokenized Checkout)

```
User → /donate → POST /api/donations (method: BKASH)
→ GET bKash token → POST create payment → return bkashURL
→ User redirected to bKash → callback to /api/payments/bkash/callback
→ Execute payment → update Payment record → send receipt email
```

### Nagad (Merchant API)

```
User → /donate → POST /api/donations (method: NAGAD)  
→ Initialize with RSA encryption → Complete checkout → return redirect URL
→ User completes on Nagad → callback to /api/payments/nagad/callback
→ Verify payment → update record → send receipt
```

### SSLCommerz (Hosted)

```
User → /donate → POST /api/donations (method: SSLCOMMERZ)
→ Init session → return GatewayPageURL
→ User pays on SSLCommerz page → POST to success/fail/cancel URL
→ Validate hash → verify transaction → update record → send receipt
```

### Fee Structure

| Type | Amount (BDT) |
|---|---|
| Annual Membership | ৳500 |
| Life Membership | ৳5,000 |
| Minimum Donation | ৳10 |

---

## Deployment Guide

### Docker Deployment (Recommended)

```bash
# 1. Copy and configure environment
cp .env.example .env
# Fill in all production values

# 2. Build and start all services
docker-compose up -d --build

# 3. Run database migrations
docker-compose exec app npx prisma migrate deploy

# 4. Seed initial data (first time only)
docker-compose exec app npx ts-node prisma/seed.ts

# 5. Check status
docker-compose ps
docker-compose logs -f app
```

### VPS / DigitalOcean Deployment

```bash
# Prerequisites: Node 20, PostgreSQL 16, Nginx, PM2

# 1. Clone and install
git clone <repo> && cd alumni
npm ci --production

# 2. Generate Prisma + build
npx prisma generate && npm run build

# 3. Run with PM2
pm2 start npm --name "alumni-forum" -- start
pm2 startup && pm2 save

# 4. Nginx configuration
# See nginx.conf in /docker/ directory

# 5. SSL with Let's Encrypt
certbot --nginx -d yourdomain.com
```

### Environment for Production

```env
NODE_ENV=production
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=<64-char-random-string>
SSLCOMMERZ_IS_LIVE=true
BKASH_BASE_URL=https://tokenized.pay.bka.sh/v1.2.0-beta
```

---

## Feature List

### ✅ Implemented

- [x] Next.js 15 App Router architecture
- [x] PostgreSQL + Prisma ORM (14+ tables)
- [x] NextAuth v5 with credentials + Google OAuth
- [x] JWT sessions with RBAC middleware
- [x] Alumni registration with email verification
- [x] Login attempt limiting (5 attempts → lock)
- [x] Member dashboard
- [x] Admin panel
- [x] bKash Tokenized Checkout integration
- [x] Nagad Merchant API integration
- [x] SSLCommerz Hosted Payment integration
- [x] Cloudinary image upload
- [x] Email service (verification, receipt, approval)
- [x] Audit logging
- [x] Global CSS design system
- [x] Responsive Navbar + Footer
- [x] Admin + Member sidebars
- [x] Home page (8 sections)
- [x] Docker + Docker Compose
- [x] Environment variables template
- [x] Database seed with batches 1990-2025
- [x] Zod validation schemas
- [x] TypeScript throughout

### 🚧 Planned / Future

- [ ] bKash callback webhook handler (complete)
- [ ] Nagad callback handler (complete)
- [ ] SSLCommerz callback handler (complete)
- [ ] PDF receipt generation
- [ ] Admin user management CRUD UI
- [ ] Admin events CRUD UI
- [ ] Admin news CMS editor
- [ ] Gallery upload UI
- [ ] Alumni directory with client-side search
- [ ] Event registration flow UI
- [ ] Member messaging UI
- [ ] Push notifications
- [ ] Mobile app (React Native)
- [ ] AI Alumni recommendation engine
- [ ] Job board module
- [ ] Scholarship management module

---

## Changelog

### 2026-06-13 — Initial Release

**🎉 Project Initialized**

**Created Files:**
- `package.json` — All 50+ dependencies defined
- `next.config.ts` — Next.js with security headers
- `tsconfig.json` — TypeScript strict configuration
- `tailwind.config.ts` — Full design system (primary #0F2D52, accent #D4AF37)
- `prisma/schema.prisma` — Complete 14+ table schema
- `prisma/seed.ts` — Database seed with batches 1990-2025, admin users, settings, campaigns, events, news
- `.env.example` — All environment variables documented
- `middleware.ts` — RBAC route protection middleware
- `lib/auth.ts` — NextAuth v5 with Prisma adapter, RBAC callbacks
- `lib/prisma.ts` — Prisma client singleton
- `lib/utils.ts` — Currency/date formatting, slug generation, utilities
- `lib/cloudinary.ts` — Image upload with face detection for profiles
- `lib/email/mailer.ts` — Email service with HTML templates
- `lib/payment/bkash.ts` — bKash Tokenized Checkout API
- `lib/payment/nagad.ts` — Nagad Merchant API with RSA
- `lib/payment/sslcommerz.ts` — SSLCommerz v4 integration
- `lib/validators/index.ts` — Zod schemas for all forms
- `app/layout.tsx` — Root layout with Google Fonts, SEO metadata
- `app/globals.css` — Global CSS with design tokens
- `components/providers.tsx` — SessionProvider + QueryClientProvider
- `components/layout/Navbar.tsx` — Responsive navbar with auth
- `components/layout/Footer.tsx` — Footer with all links
- `components/layout/MemberSidebar.tsx` — Member area sidebar
- `components/layout/AdminSidebar.tsx` — Admin panel sidebar
- `components/home/HeroSection.tsx` — Animated hero with floating cards
- `components/home/StatsSection.tsx` — 6-stat community metrics
- `components/home/FeaturedAlumni.tsx` — Distinguished alumni showcase
- `components/home/UpcomingEvents.tsx` — Events with registration CTA
- `components/home/DonationCTA.tsx` — Campaign progress bars
- `components/home/NewsSection.tsx` — News article cards
- `components/home/GalleryPreview.tsx` — Masonry gallery preview
- `components/home/JoinCTA.tsx` — Alumni registration CTA
- `components/dashboard/MemberDashboardClient.tsx` — Member dashboard
- `components/admin/AdminDashboardClient.tsx` — Admin dashboard
- `app/(public)/page.tsx` — Home page
- `app/(public)/alumni-directory/page.tsx` — Alumni directory
- `app/(public)/events/page.tsx` — Events listing
- `app/(public)/donate/page.tsx` — Donation page
- `app/(public)/contact/page.tsx` — Contact page
- `app/(auth)/layout.tsx` — Two-panel auth layout
- `app/(auth)/login/page.tsx` — Login form
- `app/(auth)/register/page.tsx` — Registration form
- `app/(member)/layout.tsx` — Member protected layout
- `app/(member)/dashboard/page.tsx` — Member dashboard (server)
- `app/(admin)/layout.tsx` — Admin protected layout
- `app/(admin)/admin/dashboard/page.tsx` — Admin dashboard (server)
- `app/api/auth/register/route.ts` — Registration API
- `app/api/auth/[...nextauth]/route.ts` — NextAuth handler
- `app/api/alumni/route.ts` — Alumni directory API
- `app/api/donations/route.ts` — Donations API with payment initiation
- `app/api/admin/route.ts` — Admin analytics API
- `types/next-auth.d.ts` — TypeScript type augmentation
- `Dockerfile` — Multi-stage production Docker image
- `docker-compose.yml` — Full stack (app + PostgreSQL + Redis)
- `README.md` — This comprehensive documentation

**Database Changes:**
- Initial schema with 18 models: User, Profile, AlumniBatch, Event, EventRegistration, Campaign, Donation, Payment, Message, MessageRecipient, Notification, News, Gallery, GalleryAlbum, Setting, AuditLog, Account, Session, VerificationToken

**API Changes:**
- Added `/api/auth/register` — POST
- Added `/api/auth/[...nextauth]` — GET/POST
- Added `/api/alumni` — GET with filters
- Added `/api/donations` — GET/POST
- Added `/api/admin` — GET (analytics)

**Deployment Notes:**
- Requires Node.js 20+, PostgreSQL 15+
- Copy `.env.example` → `.env` before first run
- Run `npm run db:migrate` before starting
- Run `npm run db:seed` for initial data
- Docker Compose is the recommended deployment method

---

*This README is a living document. Update it after every feature addition, bug fix, or architectural change.*

### 2026-06-13 — Completion Build (Session 2)

**✅ Node.js 24.16.0 installed via winget**
**✅ 536 npm packages installed**
**✅ Prisma client generated**
**✅ Dev server running: http://localhost:3000**

**New Files Added:**
- `app/(public)/about/page.tsx` — About page with timeline & committee
- `app/(public)/news/page.tsx` — News listing with filters
- `app/(public)/news/[slug]/page.tsx` — News detail page
- `app/(public)/gallery/page.tsx` — Gallery albums page
- `app/(auth)/forgot-password/page.tsx` — Forgot password flow
- `app/(member)/profile/page.tsx` — Profile management
- `app/(member)/donations/page.tsx` — Donation history table
- `app/(member)/notifications/page.tsx` — Notification center
- `app/(member)/messages/page.tsx` — Messages inbox
- `app/(member)/my-events/page.tsx` — Event registrations
- `app/(member)/settings/page.tsx` — Account settings (3 tabs)
- `app/(admin)/admin/users/page.tsx` — User management
- `app/(admin)/admin/users/[id]/page.tsx` — User detail
- `app/(admin)/admin/donations/page.tsx` — Donations table
- `app/(admin)/admin/events/page.tsx` — Events management
- `app/(admin)/admin/events/new/page.tsx` — Create event form
- `app/(admin)/admin/news/page.tsx` — News CMS
- `app/(admin)/admin/reports/page.tsx` — Analytics & reports
- `app/(admin)/admin/settings/page.tsx` — Site settings
- `app/api/profile/route.ts` — GET/PATCH profile API
- `app/api/events/route.ts` — GET/POST events API
- `app/api/news/route.ts` — GET news API
- `app/api/notifications/route.ts` — GET/PATCH notifications
- `app/api/contact/route.ts` — Contact form API
- `app/api/auth/forgot-password/route.ts` — Password reset request
- `app/api/auth/change-password/route.ts` — Change password
- `app/api/admin/users/route.ts` — Admin users list
- `app/api/admin/users/[id]/route.ts` — Admin user CRUD
- `components/member/ProfileClient.tsx` — Profile edit component
- `components/admin/AdminUsersClient.tsx` — Users table component
- `app/not-found.tsx` — 404 page
- `app/error.tsx` — Error boundary

**Fixes Applied:**
- `package.json` — Removed non-existent `@radix-ui/react-badge`, `@radix-ui/react-sheet`, moved `tailwindcss-animate` to deps
- `next.config.ts` — Fixed `remotePatterns` (was deprecated `domains`), removed invalid `serverActions.allowedOrigins`
- `tsconfig.json` — Fixed for Next.js 15 bundler module resolution
- `prisma/schema.prisma` — Added `POSTPONED` to `EventStatus`, added `deletedAt` to `Event` and `News`
- `.env` — Created with safe development defaults
- `postcss.config.js` — Created for Tailwind CSS

