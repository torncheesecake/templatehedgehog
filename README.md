# Template Hedgehog

Template Hedgehog is a Next.js commercial template for teams building production MJML email systems with checkout and gated delivery.

It includes:
- Public component/layout galleries
- Stripe checkout and webhook handling
- Token-gated download delivery
- Shared-store-backed waitlist capture
- Rebrandable template config in one place

## Who It Is For

- Engineering teams shipping transactional or lifecycle email systems
- Agencies delivering white-label template implementations
- Product teams that need a safe production baseline rather than a demo

## Quick Start

1. Install Node.js 20+.
2. Install dependencies:
   ```bash
   npm ci
   ```
3. Create local env:
   ```bash
   cp .env.example .env.local
   ```
4. Set minimum local values in `.env.local`:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SITE_DOMAIN`
   - `DOWNLOAD_TOKEN_SECRET`
5. Start the app:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

See [`.env.example`](./.env.example) for the full list.

Minimum for local development:
- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_SITE_DOMAIN`
- `DOWNLOAD_TOKEN_SECRET`
- `WAITLIST_STORAGE_MODE=memory`
- `RATE_LIMIT_STORE_MODE=memory`

Required for production:
- App URL:
  - `NEXT_PUBLIC_APP_URL` (recommended canonical public URL)
- Stripe:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- Shared persistence:
  - `REDIS_URL`
  - `SHARED_STORE_PREFIX` (recommended)
- Download replay protection:
  - `DOWNLOAD_TOKEN_SECRET`
  - `DOWNLOAD_TOKEN_REPLAY_STORE=redis`
- Waitlist persistence and rate limiting:
  - `WAITLIST_STORAGE_MODE=redis` (production enforced)
  - `RATE_LIMIT_STORE_MODE=redis` (production enforced)
- Download provider mode:
  - `DOWNLOAD_STORAGE_MODE=provider`
  - `DOWNLOAD_PROVIDER_BUCKET`
  - `DOWNLOAD_PROVIDER_REGION`
  - `DOWNLOAD_PROVIDER_ACCESS_KEY_ID`
  - `DOWNLOAD_PROVIDER_SECRET_ACCESS_KEY`

Branding and metadata:
- `NEXT_PUBLIC_BRAND_NAME`
- `NEXT_PUBLIC_PRODUCT_NAME`
- `NEXT_PUBLIC_SUPPORT_EMAIL`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_COMPANY_LEGAL_NAME`
- `NEXT_PUBLIC_COMPANY_ADDRESS`

## Scripts

- `npm run dev`: development server
- `npm run build`: production build
- `npm run start`: production server
- `npm run lint`: ESLint
- `npm run test:unit`: unit and API route tests
- `npm run build:components`: compile component MJML
- `npm run build:layouts`: compile layout MJML
- `npm run build:examples`: compile example MJML
- `npm run build:pack`: build downloadable archive
- `npm run build:layout-addons`: process optional external MJML addon folder

## API Route Overview

- `POST /api/checkout`
  - Creates Stripe checkout sessions.
  - Returns explicit user-safe errors when unavailable.

- `POST /api/webhooks/stripe`
  - Enforces signature verification and validates supported event payloads.

- `GET|HEAD /api/download`
  - Validates paid Stripe session before serving the archive.
  - Filesystem mode is blocked in production.

- `GET /api/downloads/[token]`
  - Validates signed, short-lived, single-use token.
  - Redirects to gated download.

- `POST /api/waitlist`
  - Validates email payload.
  - Uses shared persistence in production.
  - Uses shared rate limiting in production.

- `POST /api/mjml/compile`
  - Disabled in production.
  - In development, applies untrusted MJML safety rules before compile.

## Production Readiness

What is live:
- Checkout, webhook verification, paid-session download validation, token-gated download access, waitlist capture with shared backing, MJML catalogue/build pipeline.

What is intentionally excluded:
- Public auth flows/routes.
- Public subscribe/reviews/analytics ingestion APIs.

What infrastructure is required:
- Redis-compatible shared store via `REDIS_URL` for production-safe waitlist persistence, distributed waitlist rate limiting, and download token replay protection.
- Object storage provider (S3-compatible) for production download delivery.
- Stripe account and webhook endpoint for payments.

## Deployment Notes

- Use Node.js 20+.
- CI runs on pull requests via [`.github/workflows/ci.yml`](./.github/workflows/ci.yml).
- Release gate sequence:
  1. `npm ci`
  2. `npm run lint`
  3. `npm run test:unit`
  4. `npm run build`
- Configure Stripe webhook endpoint to `POST /api/webhooks/stripe`.

## Template Customisation Boundaries

- Primary config surface: [`src/config/template.ts`](./src/config/template.ts)
- Content token normalisation: [`src/lib/templateTokens.ts`](./src/lib/templateTokens.ts)

## MJML Beta Caveat

This template currently uses `mjml@5.0.0-beta.2` to address known security advisories affecting older versions.

Recommended practice:
- Keep MJML compile tests in CI.
- Validate critical templates in your target ESP/client matrix before release.
