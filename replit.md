# AI.FO Landing Page

## Overview
Production-ready single-page marketing website for AI.FO (domain: getaifo.com). A dark, minimal, CFO-grade landing page designed for high conversion.

## Tech Stack
- **Frontend:** React + TypeScript + Vite + Tailwind CSS v4
- **Backend:** Express.js
- **External:** Airtable API for waitlist submissions
- **Fonts:** Bebas Neue (display), DM Sans (body)

## Architecture
- `client/` — React frontend with all page components
- `server/` — Express backend with API routes
- `shared/` — Shared schema definitions

## Key Components
- `Nav.tsx` — Fixed nav with smooth scroll anchors
- `Hero.tsx` — Hero section with abstract SVG visualization
- `HowItWorks.tsx` — 3-step process (Ingest → Normalize → Reason)
- `WhoWhy.tsx`, `Problem.tsx`, `ExistingTools.tsx`, `WhyNow.tsx` — Content sections
- `ProductVision.tsx` — CFO Brief card with tabbed examples
- `TechnicalChallenge.tsx` — Side-by-side orange panels
- `Wedge.tsx` — "Where AI.FO Starts" section
- `WhoThisIsFor.tsx` — Target audience cards
- `EarlyAccess.tsx` — Waitlist form (connected to Airtable)
- `Footer.tsx` — Simple footer

## API Routes
- `POST /api/waitlist` — Submits waitlist data to Airtable
  - Rate limited: 10 requests/IP/hour
  - Honeypot field: `companyWebsite`
  - Server-side validation with Zod

## Environment Variables (Secrets)
- `AIRTABLE_API_TOKEN` — Airtable personal access token
- `AIRTABLE_BASE_ID` — Airtable base ID
- Table name is hardcoded as "Submissions"

## Design System
- Colors: Black bg, white text, accent `#CC6600`
- Cards: `bg-white/[0.04] border border-white/10 rounded-lg`
- Buttons: Primary (orange bg, black text), Secondary (orange border, white text)
