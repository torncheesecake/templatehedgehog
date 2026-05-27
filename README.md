# Template Hedgehog

**Premium production email systems for teams that need to ship reliably at speed.**

Template Hedgehog is a commercial Next.js product for developers, SaaS teams, and agencies running lifecycle and transactional email in production.

It combines production MJML architecture, secure Stripe checkout, and token-gated delivery in one operational system.

## Who It Is For

- SaaS teams running onboarding, lifecycle, and billing workflows
- Agencies delivering repeatable client email systems
- Developers who need safe handoff from source to production HTML

## Why Teams Buy

- Ship faster from proven production email architecture
- Reduce rebuild work across repeated campaigns and lifecycle sends
- Keep handoff clean with MJML source plus production-safe compiled HTML
- Buy and deliver safely with Stripe checkout, webhook verification, and token-gated downloads

## Commercial Tiers

| Tier           |    Price | Position                         | Includes                                                                                                                                           |
| -------------- | -------: | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Starter**    |  **£59** | Get production-ready quickly     | Curated starter system, onboarding and transactional essentials, 3 layouts, MJML + compiled HTML, setup docs                                       |
| **Pro**        | **£179** | Complete production email system | Full component library, layouts/workflows, lifecycle and transactional systems, token examples, advanced implementation guidance, 6 months updates |
| **Enterprise** | **£349** | Commercial deployment licence    | Commercial reuse rights, white-label/internal deployment, reusable generation framework, priority support, 12 months updates                       |

**Recommended:** Start with Starter, then move to Pro for full operational coverage. Enterprise is for teams needing licensing and deployment scale.

## What Is Public vs Protected

Public:

- Rendered previews
- Architecture and implementation guidance
- Component and layout references

Protected:

- Full raw MJML source before purchase
- Paid archive delivery behind checkout validation and token gating

## Screenshots

Add images in `public/screenshots/` and reference them here:

- Homepage positioning
- Pricing decision page
- Component and layout views
- Success and download confirmation

Example:

```md
![Homepage](./public/screenshots/homepage.png)
![Pricing](./public/screenshots/pricing.png)
![Layouts](./public/screenshots/layouts.png)
```

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
4. Set minimum local variables:
   - `NEXT_PUBLIC_SITE_URL`
   - `NEXT_PUBLIC_SITE_DOMAIN`
   - `DOWNLOAD_TOKEN_SECRET`
   - `WAITLIST_STORAGE_MODE=memory`
   - `RATE_LIMIT_STORE_MODE=memory`
5. Run:
   ```bash
   npm run dev
   ```
6. Open [http://localhost:3000](http://localhost:3000).

## Commercial Flow

1. Buyer discovers public proof and pricing.
2. Buyer checks out through `/api/checkout`.
3. Stripe webhook confirms purchase at `/api/webhooks/stripe`.
4. Buyer receives token-gated delivery via `/api/download` and `/api/downloads/[token]`.

## Product Capabilities

- Production component and layout catalogue
- Stripe checkout and verified webhook handling
- Token-gated paid archive delivery
- Waitlist capture with shared-store support
- MJML build scripts for components, layouts, and production examples
- Rebrandable configuration from a single source

## Scripts

- `npm run dev` - development server
- `npm run build` - production build
- `npm run start` - production server
- `npm run lint` - ESLint
- `npm run typecheck` - TypeScript validation
- `npm run test:unit` - unit and API route tests
- `npm run check` - lint, typecheck, and unit tests
- `npm run validate` - full local release gate
- `npm run build:content` - compile generated product content used by the app
- `npm run build:components` - compile component MJML
- `npm run build:layouts` - compile layout MJML
- `npm run build:examples` - compile example MJML
- `npm run build:pack` - build downloadable archive
- `npm run build:layout-addons` - process optional MJML addon folder

## Environment

See [`.env.example`](./.env.example) for full variables.

### Production Requirements

- App URL:
  - `NEXT_PUBLIC_APP_URL`
- Stripe:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_WEBHOOK_SECRET`
- Shared persistence:
  - `REDIS_URL`
  - `SHARED_STORE_PREFIX`
- Download replay protection:
  - `DOWNLOAD_TOKEN_SECRET`
  - `DOWNLOAD_TOKEN_REPLAY_STORE=redis`
- Waitlist and rate limiting:
  - `WAITLIST_STORAGE_MODE=redis`
  - `RATE_LIMIT_STORE_MODE=redis`
- Download provider mode:
  - `DOWNLOAD_STORAGE_MODE=provider`
  - `DOWNLOAD_PROVIDER_BUCKET`
  - `DOWNLOAD_PROVIDER_REGION`
  - `DOWNLOAD_PROVIDER_ACCESS_KEY_ID`
  - `DOWNLOAD_PROVIDER_SECRET_ACCESS_KEY`

## Release Gate

Run before deployment:

1. `npm ci`
2. `npm run validate`

## Rebrand and Customise

- Main configuration: [`src/config/template.ts`](./src/config/template.ts)
- Token helpers: [`src/lib/templateTokens.ts`](./src/lib/templateTokens.ts)
- MJML libraries:
  - [`src/data/email-components/library`](./src/data/email-components/library)
  - [`src/data/email-layouts`](./src/data/email-layouts)
  - [`src/data/email-examples/library`](./src/data/email-examples/library)

## Call to Action

If your team ships production email, use Starter to move quickly, then upgrade to Pro for full operational coverage.
