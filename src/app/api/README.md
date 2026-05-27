# API Routes

API routes live under `src/app/api` and use Next.js App Router route handlers.

## Responsibilities

- `analytics/track`: event tracking with rate limiting.
- `checkout`: Stripe checkout session creation.
- `download`: purchase-session validation and signed download token creation.
- `downloads/[token]`: token-gated paid archive delivery.
- `mjml/compile`: MJML compilation endpoint.
- `reviews`, `subscribe`, `waitlist`: public lead and product proof endpoints.
- `webhooks/stripe`: Stripe webhook verification and purchase event handling.

## Standards

- Validate request payloads at the route boundary.
- Return consistent JSON error responses.
- Keep secrets and provider clients server-only.
- Use `src/lib` for durable business logic.
- Add or update route tests for behaviour changes.
