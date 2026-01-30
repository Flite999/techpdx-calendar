# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

TechPDX Calendar is an Astro-based event calendar application for Portland tech community events. It uses server-side rendering deployed on Vercel with a PostgreSQL database via Prisma.

## Commands

```bash
npm run dev        # Start dev server (localhost:4321)
npm run build      # Generate Prisma client and build for production
npm run preview    # Preview production build locally
```

### Database (Prisma)

```bash
npx prisma db push              # Push schema changes to database
npx prisma db push --force-reset # Drop and recreate database
npx prisma studio               # Open database GUI for testing/data entry
npx prisma generate             # Regenerate Prisma client (runs automatically on build)
```

### Environment Setup

Pull environment variables from Vercel: `vercel env pull .env`

## Architecture

### Tech Stack
- **Framework**: Astro 5 with server-side rendering (`output: 'server'`)
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel adapter
- **Styling**: Custom CSS (no framework)

### Key Directories
- `src/pages/` - Astro pages and API routes
- `src/components/` - Astro components (.astro files)
- `src/lib/` - Shared utilities (database, types, date helpers)
- `src/styles/global.css` - Global styles
- `prisma/schema.prisma` - Database schema

### Path Alias
`@/*` maps to `./src/*` (configured in tsconfig.json)

### Data Model
Single `Event` model with: title, start_time, end_time, website, description, location, slug (unique identifier)

### Calendar Logic
- Month navigation uses `?ym=YYYY-MM` query parameter
- Date utilities in `src/lib/dates.ts` handle UTC boundaries and grid generation
- Events filtered to exclude past events (where `end_time < now`)

### API Routes
- `POST /api/add-event` - Create event from form submission
- `POST /api/import-event` - Import event from ICS URL
- `GET /api/search?q=&page=` - Search events
- `GET /api/feed.ics` - ICS calendar feed

### Slug Generation
Events use hashids-based slugs generated from title + random number (`src/lib/hash.ts`)
