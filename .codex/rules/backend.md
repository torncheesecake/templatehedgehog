# Backend Rules

- Keep Stripe, Redis, storage, and token secrets server-only.
- Validate all route input before calling provider logic.
- Rate-limit public write endpoints and commerce-sensitive routes.
- Return consistent JSON errors with meaningful status codes.
- Keep paid delivery behind session validation, signed tokens, and replay protection where configured.
- Add tests for checkout, webhook, token, download, and persistence changes.
