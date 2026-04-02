# Stitch-n-Stab

A small, personal storefront for **Elaine’s** handmade crochet — one-of-a-kind pieces with humor and personality, not a generic ecommerce template. The public site is a warm catalog; a simple admin area lets Elaine publish listings and photos.

**Live site:** [stitchnstab.com](https://stitchnstab.com)

## Tech stack

- **Framework:** [Next.js](https://nextjs.org) (App Router)
- **Database:** PostgreSQL with [Prisma](https://www.prisma.io)
- **Styling:** [Tailwind CSS](https://tailwindcss.com) v4
- **Auth:** JWT cookies for `/admin` (credentials from environment variables)

## Local development

**Requirements:** Node.js 20+, npm, and a PostgreSQL URL (e.g. [Neon](https://neon.tech) free tier).

```bash
cp .env.example .env
# Edit .env: DATABASE_URL, ADMIN_USERNAME, ADMIN_PASSWORD, JWT_SECRET, NEXT_PUBLIC_SITE_URL

npm install
npx prisma migrate deploy
npm run dev
```

- **Storefront:** [http://localhost:3000](http://localhost:3000)
- **Admin:** [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

**Images:** Without `BLOB_READ_WRITE_TOKEN`, uploads go to `public/uploads/` (ignored by git). On Vercel, connect **Vercel Blob** so uploads persist.

## Repository layout

| Path | Purpose |
|------|--------|
| `src/app/` | Routes and layouts (`/`, `/products/[id]`, `/admin/...`) |
| `src/components/site/` | Public UI (header, footer, gallery) |
| `src/components/admin/` | Admin UI helpers |
| `src/server/` | Database client, auth, server actions |
| `src/middleware.ts` | Protects `/admin/*` with JWT |
| `prisma/` | Schema and migrations |
| `public/` | Static assets; local uploads under `public/uploads/` only |

## Deployment (Vercel)

Typical setup: **Vercel** (hosting + Blob), **Neon** (Postgres), DNS at your registrar (e.g. PorkBun).

1. Import the repo in Vercel; framework **Next.js**.
2. Set environment variables **before** the first production deploy:

   | Variable | Notes |
   |----------|--------|
   | `DATABASE_URL` | Pooled Neon URL; prefer `sslmode=verify-full` (see Neon docs if you see SSL warnings) |
   | `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Admin login |
   | `JWT_SECRET` | Long random string (32+ characters) |
   | `NEXT_PUBLIC_SITE_URL` | Canonical URL, e.g. `https://stitchnstab.com` |
   | `NEXT_PUBLIC_INSTAGRAM_URL` | Optional footer link |

3. Deploy. The build runs migrations then `next build`.
4. **Vercel Blob:** Storage → create a Blob store and link it to the project so `BLOB_READ_WRITE_TOKEN` is available (do not commit this token).
5. **Domain:** Add the domain in Vercel and create the DNS records your registrar shows (apex + `www` if you use it). Wait for DNS + HTTPS.

**Smoke test:** Homepage loads, admin login works, new product images use Blob URLs in production (not `/uploads/...`).

## Security and secrets

- **Never commit** `.env`, `.env.local`, or any file with real passwords or database URLs. This repo’s `.gitignore` ignores `.env*` except `.env.example`, which contains **placeholders only**.
- Copy `.env.example` → `.env` locally and set real values; use the Vercel dashboard for production secrets.
- If a secret was ever committed or pushed, rotate it (database password, `JWT_SECRET`, admin password, Blob token) and use `git filter-repo` or GitHub support if history must be scrubbed.

## Features

- Public product grid and detail pages with image gallery  
- Admin: create, hide, mark sold, delete listings; image upload  
- Optional product view counter (API route)

## License

This project is licensed under the [MIT License](LICENSE).
