# Performance Rules

- Avoid client-side JavaScript for static content.
- Avoid runtime MJML compilation for public catalogue pages when generated output exists.
- Keep large generated content out of interactive client components.
- Use image dimensions, responsive sizing, and base-path-safe asset URLs.
- Watch homepage, pricing, and catalogue pages for bundle and image regressions.
- Prefer simple static data access over dynamic work in render paths.
