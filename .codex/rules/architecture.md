# Architecture Rules

- Preserve the App Router structure in `src/app`.
- Keep route handlers focused on validation, orchestration, and response formatting.
- Move reusable domain logic into `src/lib`.
- Keep product configuration in `src/config/template.ts`.
- Keep catalogue and workflow data in `src/data`.
- Do not move public routes or slugs without redirects and tests.
- Treat generated data as an output of scripts, not as primary source.
