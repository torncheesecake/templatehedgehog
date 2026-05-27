# Tasks

## Immediate

- Keep `npm run check` green after source changes.
- Add new test files to `package.json` when they are created.
- Verify `npm run build:content` after MJML source changes.
- Audit any new public asset path against `src/lib/asset-path.ts` and static export requirements.

## Next Priorities

- Add a public asset existence checker for data-referenced preview images.
- Add a generated-content manifest for components, layouts, examples, and packs.
- Review historical brand assets and remove or archive unused variants.
- Review large catalogue modules for a low-risk split by family or route.
- Add mocked API smoke tests for `/api/checkout`, `/api/download`, and `/api/downloads/[token]`.

## Future Improvements

- Build the ready-layout catalogue flow described in `ROADMAP.md`.
- Add shareable URL state and keyboard-accessible selection behaviour for bundle pricing.
- Expand documentation for private download pack creation and release signing.
- Add visual regression checks for homepage, pricing, layouts, components, and success pages.
- Add a production deployment runbook for non-static hosting.

## Optional Enhancements

- Add a docs index page that links product, technical, and release documentation.
- Add a script that reports unused public images.
- Add bundle-size tracking for key pages.
- Add a lightweight ADR folder for major architecture decisions.
