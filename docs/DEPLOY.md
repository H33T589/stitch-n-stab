# Deploy Stitch-n-Stab (Vercel + PorkBun)

Your live site will be **Next.js on Vercel**, **PostgreSQL on Neon** (free tier is fine to start), **images on Vercel Blob**, and the domain **stitchnstab.com** on PorkBun pointing at Vercel.

## 1. Neon (database)

1. Create a free account at [https://neon.tech](https://neon.tech).
2. Create a project and database.
3. Copy the **connection string** (pooled URL from Neon is fine). If it ends with `sslmode=require`, change it to **`sslmode=verify-full`** so Node’s `pg` driver doesn’t spam a security warning in dev (Neon supports it). If there’s no `sslmode`, append `&sslmode=verify-full` (or `?sslmode=verify-full` if the URL has no query yet).
4. Keep this string secret — it is your `DATABASE_URL`.

Apply migrations (creates the `Product` table):

```bash
# In this repo, with DATABASE_URL in .env
npx prisma migrate deploy
```

## 2. GitHub

Push the latest code to the branch Vercel will deploy from (usually `main`).

## 3. Vercel project

1. Go to [https://vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. **Add New Project** → import the **stitch-n-stab** repository.
3. Framework Preset: **Next.js** (auto-detected).
4. **Environment Variables** — add these before the first deploy (Production + Preview if you like):

   | Name | Value |
   |------|--------|
   | `DATABASE_URL` | Your Neon connection string |
   | `ADMIN_USERNAME` | e.g. `admin` (pick what Elaine will use) |
   | `ADMIN_PASSWORD` | Strong password (not the sample from docs) |
   | `JWT_SECRET` | Long random string (32+ characters) |
   | `NEXT_PUBLIC_SITE_URL` | `https://stitchnstab.com` |
   | `NEXT_PUBLIC_INSTAGRAM_URL` | Optional, full URL to the Instagram profile |

5. **Deploy**. The build runs `prisma migrate deploy` then `next build`, so the database must already exist and `DATABASE_URL` must be correct.

### Vercel Blob (product photos)

The filesystem on Vercel is not writable for uploads, so images use **Blob** in production.

1. In the Vercel project: **Storage** → **Blob** → create a store and **connect** it to this project.
2. Redeploy if needed. Vercel sets `BLOB_READ_WRITE_TOKEN` automatically — you usually do not paste it by hand.

## 4. Custom domain (PorkBun → Vercel)

1. In Vercel: **Project → Settings → Domains**.
2. Add **`stitchnstab.com`** and **`www.stitchnstab.com`** (optional but common).
3. Vercel will show the **DNS records** to create (often an **A** record for the apex and **CNAME** for `www`).

4. In **PorkBun** → your domain → **DNS**:

   - Add or edit records exactly as Vercel instructs (apex is often an **A** record to Vercel’s IP, or ALIAS/ANAME depending on PorkBun’s UI).
   - For `www`, usually a **CNAME** to `cname.vercel-dns.com` (or whatever Vercel displays).

5. Wait for DNS (often minutes, sometimes up to 48 hours). Vercel will issue **HTTPS** automatically once the domain verifies.

## 5. Local development after Postgres

Copy `.env.example` to `.env` and set `DATABASE_URL` to the **same** Neon database (simplest) or a separate Neon branch for dev. Run:

```bash
npm install
npx prisma generate
npm run dev
```

Without `BLOB_READ_WRITE_TOKEN`, images save under `public/uploads/` locally only.

## Checklist

- [ ] Neon project created; `DATABASE_URL` set on Vercel (+ local `.env`)
- [ ] `ADMIN_*` and `JWT_SECRET` set on Vercel (different from any committed examples)
- [ ] Blob store created and linked; production upload tested
- [ ] PorkBun DNS matches Vercel’s domain wizard
- [ ] Open `https://stitchnstab.com` and `/admin/login` and sign in
