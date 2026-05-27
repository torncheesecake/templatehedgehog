# Data

This folder contains public product catalogues, workflow metadata, compiled MJML output, and lightweight JSON stores used by the app.

## Ownership

- `email-components`: reusable MJML component source, metadata, categories, and compiled output.
- `email-layouts`: ready-made layout systems and compiled output.
- `email-examples`: legacy example library that still backs workflow compatibility.
- `layout-addons`: generated optional layout add-on metadata.
- `workflows`: buyer-facing lifecycle and transactional workflow definitions.
- `mjml-library.ts`: shared MJML library exports.
- `funnel-events.json`: analytics event metadata.
- `waitlist.json`: local fallback persistence for waitlist-style flows.

## Standards

- Treat `compiled.ts` and `compiled.json` as generated artefacts.
- Edit source MJML and metadata first, then run the relevant build script.
- Keep slugs stable because public routes and generated previews rely on them.
- Document any intentional legacy compatibility mapping.
