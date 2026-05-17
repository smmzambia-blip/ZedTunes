# ZedTunes

The fastest modern SEO-optimized music platform in Zambia.

## Tech Stack
- **Framework**: Next.js 15+ App Router
- **Database**: PostgreSQL (via Prisma ORM)
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React
- **Auth**: NextAuth.js

## Getting Started

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Configure your `DATABASE_URL` in `.env` to point to a valid PostgreSQL database.

3. Run migrations and generate Prisma Client:
   ```bash
   npx prisma db push
   npx prisma generate
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Deployment to Vercel

This repository is optimized for Vercel deployment.
- Vercel automatically runs `npx prisma generate` during the build step.
- Update your Environment Variables in the Vercel Dashboard (`DATABASE_URL`, `NEXTAUTH_SECRET`).

## SEO Features
- Server-rendered React components (`/app`) yield actual HTML to crawlers.
- `metadataBase` configured for full OpenGraph and Twitter card capabilities.
- Programmatic JSON-LD Schema on individual song pages.
- Auto-generated `sitemap.xml` and `robots.txt`.
