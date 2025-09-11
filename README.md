# TechPDX-Calendar

This is a [Next.js](https://nextjs.org) project.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Vercel

This project is currently deployed on Vercel.

`npm i -g vercel@latest`
`vercel env pull .env` (if this does not work copy and paste env values from vercel console manually)
`npm install prisma --save-dev`
`npx prisma db push` - after a successful push, `generate` will be run.
`npx prisma studio` local instance of prism, create dummy data here

Create prisma client instance for app to interact with DB `mkdir lib && touch lib/prisma.ts`
