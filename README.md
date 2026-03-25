# Stitch-n-Stab

A handmade crochet product catalog — browse unique, one-of-a-kind creations by Elaine.

Live site: [stitchnstab.com](https://stitchnstab.com)

Built with [Next.js](https://nextjs.org), [Prisma](https://www.prisma.io), and [Tailwind CSS](https://tailwindcss.com).

## Getting Started (local)

### Prerequisites

- [Node.js](https://nodejs.org) 20+
- npm
- A **PostgreSQL** database URL (e.g. free tier from [Neon](https://neon.tech))

### Setup

```bash
cp .env.example .env
# Edit .env: set DATABASE_URL, ADMIN_*, JWT_SECRET, NEXT_PUBLIC_SITE_URL

npm install

# Apply schema to your database (first time / after pulling migrations)
npx prisma migrate deploy

npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the catalog and [http://localhost:3000/admin/login](http://localhost:3000/admin/login) for admin.

**Images:** Locally, uploads go to `public/uploads/` when `BLOB_READ_WRITE_TOKEN` is not set. In production on Vercel, enable **Vercel Blob** (see deploy guide).

## Deploy (Vercel + domain)

Step-by-step checklist (Neon, Vercel env vars, Blob, PorkBun DNS): **[docs/DEPLOY.md](docs/DEPLOY.md)**.

## Environment Variables

See [.env.example](.env.example) for all keys. Never commit real secrets — `.env` stays local / in the Vercel dashboard only.

## Features

- **Public catalog** — responsive product grid with detail pages
- **Admin panel** — add, hide, mark sold, or delete listings
- **Image uploads** — local disk in dev; Vercel Blob in production
- **Simple auth** — environment-based admin login with JWT cookies

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL via Prisma ORM
- **Styling:** Tailwind CSS
- **Auth:** JWT cookies (jose)
