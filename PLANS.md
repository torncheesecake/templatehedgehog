# Plans

## Repository Modernisation Plan

Status: active

1. Keep source boundaries clear: routes in `src/app`, reusable UI in `src/components`, business rules in `src/lib`, generated/catalogue content in `src/data`, and product settings in `src/config`.
2. Standardise validation around `npm run check` for daily work and `npm run validate` for release readiness.
3. Keep AI-facing guidance current in `AGENTS.md`, `CURRENT_STATE.md`, `TASKS.md`, `CHANGELOG_AI.md`, and `.codex`.
4. Reduce local clutter by ignoring generated artefacts and keeping generated output ownership explicit.
5. Prefer targeted improvements to wholesale rewrites until tests and smoke coverage are broader.

## Content System Plan

Status: proposed

1. Add a generated manifest after every MJML build.
2. Validate source count, compiled count, preview image paths, and pack archive contents.
3. Keep committed generated files for static rendering until the deployment model changes.
4. Split large catalogue files only after manifest validation is in place.

## Commerce Stability Plan

Status: proposed

1. Preserve existing checkout, webhook, and download API route names.
2. Add mocked integration tests for success redirects and expired/invalid token flows.
3. Document environment variable requirements for production server hosting separately from GitHub Pages.
4. Keep replay protection Redis-backed in production.

## UX Quality Plan

Status: proposed

1. Treat homepage, pricing, layouts, components, docs, and success pages as the core buyer journey.
2. Prefer real product previews over abstract decoration.
3. Add manual responsive QA notes to release checklists until visual regression exists.
4. Keep tier comparison, proof, and delivery trust signals above low-value promotional copy.
