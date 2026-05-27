# Libraries

Shared business logic and infrastructure utilities live in `src/lib`.

## Responsibilities

- `analytics` and `funnelAnalytics`: event naming and funnel tracking helpers.
- `asset-path`: base-path-safe public asset paths for static export.
- `download`, `downloadToken`, `pack`, `packCatalog`, `packSize`, `versioning`: paid delivery and archive concerns.
- `html-snippets`, `clipboard`, `templateTokens`: generated content and template handling.
- `mjml`: MJML compilation and safety checks.
- `rateLimit`: request throttling primitives.
- `seo`: metadata and JSON-LD helpers.
- `shared/redis`: shared Redis client utilities.
- `stripe-server`: server-only Stripe integration.
- `waitlist/store`: waitlist persistence abstraction.

## Standards

- Keep route handlers thin by moving durable rules here.
- Keep server-only integrations out of client components.
- Add tests for token, payment, archive, safety, and persistence changes.
- Prefer explicit types and small pure functions where possible.
