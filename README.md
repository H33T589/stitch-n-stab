# Stitch-n-Stab

A handmade crochet product catalog — browse unique, one-of-a-kind creations by Elaine.

Built with [Next.js](https://nextjs.org), [Prisma](https://www.prisma.io), and [Tailwind CSS](https://tailwindcss.com).

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 20+
- npm

### Setup

```bash
# Install dependencies
npm install

# Set up the database
npx prisma migrate dev

# Generate the Prisma client
npx prisma generate

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the public catalog.

### Environment Variables

Copy `.env.example` to `.env` and fill in:

| Variable         | Description                         |
| ---------------- | ----------------------------------- |
| `DATABASE_URL`   | SQLite connection string            |
| `ADMIN_USERNAME` | Admin login username                |
| `ADMIN_PASSWORD` | Admin login password                |
| `JWT_SECRET`     | Secret key for signing auth tokens  |

Optional (public footer link — safe to commit the name of this variable; put the real URL only in `.env`):

| Variable                    | Description                                      |
| --------------------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Full profile URL, e.g. `https://instagram.com/yourhandle` |

## Features

- **Public catalog** — responsive product grid with detail pages
- **Admin panel** — add, edit, and remove product listings
- **Image uploads** — attach multiple photos per product
- **Simple auth** — environment-based admin credentials with JWT sessions

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Database:** SQLite via Prisma ORM
- **Styling:** Tailwind CSS
- **Auth:** JWT cookies (jose)
