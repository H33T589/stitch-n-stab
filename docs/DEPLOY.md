# Deploy Stitch-n-Stab (Vercel + PorkBun)

This project deploys as:

- **Frontend + server actions:** Vercel (Next.js)
- **Database:** Neon Postgres
- **Image uploads in production:** Vercel Blob
- **Domain:** `stitchnstab.com` on PorkBun

---

## Where you are now

If you've already done these, skip ahead:

- [x] Neon project created
- [x] `DATABASE_URL` added locally in `.env`
- [x] `npx prisma migrate deploy` succeeded locally
- [x] Code committed/pushed to GitHub

Your next move is mainly **Vercel setup + PorkBun DNS**.

---

## 1) Neon connection string format (important)

Use the pooled Neon URL if available. Keep it secret.

If the URL has `sslmode=require`, change it to:

- `sslmode=verify-full`

Examples:

- `...neondb?sslmode=require` -> `...neondb?sslmode=verify-full`
- `...neondb?channel_binding=require` -> `...neondb?channel_binding=require&sslmode=verify-full`

---

## 2) Vercel project setup

1. Go to [https://vercel.com](https://vercel.com) and import the `stitch-n-stab` GitHub repo.
2. Framework should auto-detect as **Next.js**.
3. Before first deploy, set **Environment Variables** in Vercel:

| Name | Value |
|------|-------|
| `DATABASE_URL` | Neon URL (with `sslmode=verify-full`) |
| `ADMIN_USERNAME` | Your admin username |
| `ADMIN_PASSWORD` | Strong password |
| `JWT_SECRET` | 32+ char random string |
| `NEXT_PUBLIC_SITE_URL` | `https://stitchnstab.com` |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Optional |

Scope: set these for **Production** (and Preview if you want).

4. Deploy.

Notes:

- Build runs `prisma migrate deploy && next build`.
- If `DATABASE_URL` is wrong, deployment will fail at migration step.

---

## 3) Enable Vercel Blob (required for prod image upload)

Vercel server filesystem is ephemeral, so production uploads must use Blob.

1. In Vercel project: **Storage -> Blob -> Create Store**.
2. Link the Blob store to this project.
3. Redeploy once linked.

Vercel typically injects `BLOB_READ_WRITE_TOKEN` automatically. Do not commit this token.

---

## 4) Connect PorkBun domain to Vercel

1. In Vercel: **Project -> Settings -> Domains**.
2. Add:
   - `stitchnstab.com`
   - `www.stitchnstab.com` (optional but recommended)
3. Vercel will show exact DNS records.
4. In PorkBun DNS, create exactly what Vercel shows.

Typical pattern (always trust Vercel’s exact instructions over this example):

- Apex/root (`@`): `A` record to Vercel target
- `www`: `CNAME` to Vercel target

5. Wait for DNS propagation (minutes to up to 48h). HTTPS cert is auto-issued by Vercel after verification.

---

## 5) Verify production end-to-end

After deploy + DNS:

1. Open `https://stitchnstab.com`
2. Open `https://stitchnstab.com/admin/login`
3. Sign in with `ADMIN_USERNAME` / `ADMIN_PASSWORD`
4. Add a product with at least one photo
5. Confirm:
   - product appears on homepage
   - image URL is from Blob (not `/uploads/...`)
   - hide/sold/delete actions work

---

## 6) Local development (ongoing)

```bash
npm install
npx prisma migrate deploy
npm run dev
```

Local behavior:

- Without `BLOB_READ_WRITE_TOKEN`: images save to `public/uploads/`
- With token: images upload to Blob

---

## Troubleshooting quick map

- **Vercel deploy fails at migration:** bad or missing `DATABASE_URL`
- **Admin login works but upload fails in production:** Blob not connected/token missing
- **Domain not opening:** DNS records in PorkBun don’t match Vercel yet
- **HTTPS pending:** wait for DNS verification + cert issuance

---

## Final checklist

- [ ] GitHub repo is up to date
- [ ] Vercel env vars set (Production)
- [ ] Neon `DATABASE_URL` uses `sslmode=verify-full`
- [ ] Blob store connected to Vercel project
- [ ] PorkBun DNS records match Vercel
- [ ] `https://stitchnstab.com` and `/admin/login` work
