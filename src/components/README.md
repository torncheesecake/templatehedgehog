# Components

Reusable React components are grouped by product area.

## Folders

- `analytics`: event-aware wrappers and tracking helpers.
- `conversion`: lead capture and buyer conversion components.
- `docs`: documentation page layout components.
- `email-components`: component catalogue presentation.
- `email-layouts`: layout catalogue presentation.
- `pricing`: pricing and offer presentation.
- `seo`: structured data helpers.
- `site`: shared site shell, navigation, page primitives, and visual system helpers.
- `ui`: generic UI primitives used across product areas.

## Standards

- Prefer server components unless client state or browser APIs are required.
- Keep shared primitives in `site` or `ui` rather than duplicating route-specific markup.
- Keep feature-specific components close to their domain folder.
- Avoid hard-coded brand and pricing values. Use `src/config/template.ts`.
