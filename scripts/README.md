# Scripts

Build and maintenance scripts live here.

## Main Scripts

- `build-components.ts`: compiles component MJML library output.
- `build-layouts.ts`: compiles layout MJML library output.
- `build-examples.ts`: compiles legacy example MJML output.
- `build-layout-addons.ts`: processes optional private layout add-on MJML.
- `build-pack.ts`: builds the paid downloadable archive.
- `build-pages.sh`: runs static export for GitHub Pages.
- `regenerate-previews.sh`: regenerates selected public preview assets.

## Standards

- Keep scripts deterministic and safe to run from a clean checkout.
- Read inputs from `src/data` or `private` and write generated output to documented destinations.
- Do not silently expose private paid source into `public`.
- Prefer clear error messages over clever recovery.
