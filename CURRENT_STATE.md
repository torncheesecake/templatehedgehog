# Current State

Last updated: 2026-05-27

## Health

Overall health is moderate to good. The project has a coherent Next.js App Router structure, strict TypeScript, a real unit/API test suite, CI, static export deployment, and clear product boundaries around configuration, data, components, and libraries.

## Strengths

- Clear commercial product model with Starter, Pro, and Enterprise tiers.
- MJML content is generated through scripts rather than assembled at runtime.
- Checkout, webhook, token, download, rate-limit, analytics, and MJML safety logic have test coverage.
- Public proof pages and paid delivery concerns are separated.
- Rebranding is mostly centralised in `src/config/template.ts`.
- CI and GitHub Pages workflows are already present.
- Production Pi deployment is now documented and scriptable through `npm run deploy:pi`.

## Known Issues

- Static export cannot run server-only commerce routes, so GitHub Pages is a public proof surface rather than the full product backend.
- Full production currently depends on the self-hosted Raspberry Pi at `matthew@192.168.4.22`; keep `docs/deployment.md` current if the host, service, path, or domain changes.
- `src/data/email-components/compiled.*`, `src/data/email-layouts/compiled.*`, and `src/data/email-examples/compiled.*` are generated but committed. This is intentional for static rendering, but it increases diff size.
- Several legacy-compatible routes redirect to newer catalogue routes. Keep them documented so future agents do not remove them accidentally.
- Generated preview folders and local build artefacts can grow quickly and should stay ignored.
- The downloadable paid archive process depends on correct private inputs and environment-specific storage settings.

## Technical Debt

- Some content catalogues are large single files. Splitting by feature family would improve reviewability, but it should be done carefully to avoid breaking generated data.
- Test discovery is currently explicit in `package.json`; this is stable but needs maintenance when new tests are added.
- The public asset library contains multiple historical brand marks. It needs a future asset audit before heavy brand work.
- Layout add-on filenames include historical spelling and campaign names. Rename only with a compatibility plan because generated metadata may reference them.

## Active Priorities

1. Keep checkout, webhook, and token-gated download behaviour stable.
2. Keep generated MJML output reproducible from source libraries.
3. Improve buyer proof pages without weakening performance or accessibility.
4. Reduce generated artefact clutter in local working trees.
5. Keep AI-facing project rules current as architecture changes.

## Architectural Concerns

- Do not mix paid source delivery with public preview pages.
- Do not make static export assumptions in server-only route handlers.
- Keep API route inputs validated and rate-limited.
- Keep route-level React focused on composition. Move durable rules into data or library modules.

## Next Major Improvements

- Add a lightweight content-generation manifest that records source counts, generated counts, and build timestamps.
- Add a script that verifies all public preview image paths referenced by data files exist.
- Split large workflow/catalogue data into smaller typed modules after a green validation run.
- Add end-to-end smoke tests for checkout redirection and public catalogue navigation using mocked Stripe responses.
