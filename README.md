# TechPDX-Calendar

An [Astro](https://astro.build) event calendar for the Portland tech community.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) with your browser to see the result.

## Vercel

This project is deployed on Vercel.

```bash
npm i -g vercel@latest
vercel env pull .env  # or copy env values from Vercel console manually
```

## Database (Prisma)

```bash
npx prisma db push              # Push schema changes (also runs generate)
npx prisma db push --force-reset # Drop and recreate database
npx prisma studio               # Local database GUI for testing/data entry
```
