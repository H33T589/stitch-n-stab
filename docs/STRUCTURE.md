# Repository layout

Next.js **requires** routes under `src/app/`. Everything else is organized so “server” and “UI” are easy to find.

| Path | Role |
|------|------|
| `src/app/` | **Pages & layouts** — URLs (`/`, `/products/[id]`, `/admin/...`). Keep these thin; data loading and forms call into `src/server/`. |
| `src/components/site/` | **Public storefront UI** — header, footer (used by catalog and product pages). |
| `src/server/` | **Server-only** — database client (`db.ts`), auth helpers (`auth.ts`), **Server Actions** (`actions.ts` — `"use server"`). |
| `src/middleware.ts` | **Edge auth gate** for `/admin/*` (JWT cookie). Must stay at this path for Next.js. |
| `src/generated/prisma/` | **Generated** Prisma client (do not edit; from `npx prisma generate`). |
| `prisma/` | **Schema & migrations** — source of truth for the database. |
| `public/` | Static assets; `public/uploads/` for local dev image uploads only. |
| `docs/` | Deployment and project notes. |

**Admin UI** still lives under `src/app/admin/` (pages are part of the app router). If it grows, you can extract pieces into `src/components/admin/` later.
