# AGENTS.md

## Operating Rules

- Use British English.
- Do not use em dashes.
- Be sceptical, double-check assumptions, and verify claims against the repository before acting.
- Preserve business logic unless a change is clearly safer, simpler, or better documented.
- Prefer small, reversible improvements over broad rewrites.
- Use `rg` for search and inspect nearby code before editing.
- Use `npm run check` for routine validation and `npm run validate` before release-level changes.

## Project Purpose

Template Hedgehog is a commercial Next.js product for production-ready email systems. It sells MJML source, compiled HTML, workflow guidance, and paid downloadable archives through a Stripe checkout and token-gated delivery flow.

The product has two important surfaces:

- Public marketing and proof pages that show previews, pricing, documentation, and product value.
- Protected delivery systems that verify checkout state and serve signed paid downloads.

## Architecture

- `src/app`: Next.js App Router pages, route handlers, metadata, sitemap, robots, and generated social images.
- `src/components`: Reusable React components grouped by feature or UI responsibility.
- `src/config`: Product, brand, pricing, and rebrand configuration. Keep customer-specific values here or in environment variables.
- `src/data`: Structured product catalogues, compiled MJML output, workflows, and content metadata.
- `src/lib`: Server/client utility modules for checkout, downloads, analytics, MJML, SEO, rate limiting, tokens, and shared infrastructure.
- `src/types`: Ambient type declarations.
- `scripts`: Build and generation scripts for MJML catalogues, layout add-ons, static pages, and paid archive packs.
- `private`: Non-public source assets and downloadable pack inputs. Do not expose raw paid source unintentionally.
- `public`: Public static assets, previews, logos, generated images, and GitHub Pages domain configuration.
- `docs`: Product, positioning, homepage, and technical planning documents.
- `.github/workflows`: CI and GitHub Pages deployment workflows.
- `.codex`: AI-agent rules, prompts, templates, and workflow checklists.

## Coding Standards

- TypeScript should remain strict and explicit at module boundaries.
- Prefer named exports for reusable utilities and data helpers.
- Keep configuration in `src/config/template.ts` rather than scattering brand, pricing, domain, or email values through pages.
- Keep API route logic small. Move reusable business rules into `src/lib`.
- Keep generated files clearly marked and rebuild them through scripts rather than hand-editing compiled artefacts.
- Keep tests close to the logic they protect using `*.test.ts` or `*.test.tsx`.
- Avoid broad renames unless they improve ownership or remove genuine confusion.

## Design Philosophy

- The product should feel operational, premium, and direct rather than decorative.
- Prioritise dense but readable proof: previews, implementation guidance, tier comparison, delivery safety, and trust signals.
- Use consistent section primitives, spacing, typography, and call-to-action patterns.
- Avoid unexplained visual novelty. Every visual should help buyers inspect the product or understand the workflow.

## Preferred Patterns

- App pages compose data from `src/data` and presentation from `src/components`.
- API handlers validate input early, rate-limit where relevant, and return consistent JSON error shapes.
- Server-only integrations, including Stripe and storage providers, stay in server route handlers or server-only libraries.
- Downloads use signed tokens and replay protection where production persistence is available.
- MJML source libraries are compiled through scripts before development, build, start, or static export.

## Forbidden Patterns

- Do not hard-code secrets, live Stripe keys, private download URLs, or customer-specific credentials.
- Do not expose `private/downloads` or raw paid MJML through public routes.
- Do not edit `compiled.ts` or `compiled.json` by hand unless repairing generated output with a matching source change.
- Do not add one-off route-specific utility code when an existing `src/lib` module owns the behaviour.
- Do not introduce new dependencies without a clear maintenance reason.
- Do not bypass rate limits or token checks in paid delivery paths.

## Testing Expectations

- Run `npm run check` after source changes.
- Run `npm run validate` before deployment, checkout/download changes, or major content-generation changes.
- Add tests when changing token generation, archive delivery, MJML safety, analytics, rate limiting, or API routes.
- For frontend changes, check responsive behaviour and important buyer flows manually when visual risk is non-trivial.

## Deployment Process

- Pull requests run CI with install, lint, tests, and build.
- GitHub Pages deployment uses `npm run build:pages` with static export settings.
- Full production is self-hosted on the Raspberry Pi at `matthew@192.168.4.22`, with the app at `/srv/templatehedgehog/current`, systemd service `templatehedgehog.service`, and Nginx proxying to `127.0.0.1:3001`.
- Use `npm run deploy:pi:dry-run` and then `npm run deploy:pi` for the repeatable Pi deployment path. See `docs/deployment.md` before changing the process.
- Production server deployments should run `npm run validate` or the Pi deployment script, which runs `npm run build` on the target host, and require production environment variables from `.env.example`.
- Static export disables server-only commerce routes. Treat GitHub Pages as public proof, not the complete paid delivery backend.

## UX Standards

- Keep navigation predictable and page purpose obvious in the first viewport.
- Use concrete product artefacts, previews, and implementation outcomes rather than vague marketing copy.
- Keep call-to-action labels specific to the buyer action.
- Preserve keyboard accessibility, semantic headings, visible focus states, and meaningful alt text.
- Avoid tiny text in dense proof sections. Buyers must be able to scan quickly.

## Performance Expectations

- Keep the first viewport light and avoid unnecessary client components.
- Prefer server components unless interactivity requires client state.
- Use generated static data where possible instead of expensive runtime compilation.
- Keep large generated assets out of source imports unless they are required for the rendered page.
