# Frontend Rules

- Prefer server components by default.
- Use client components only for browser APIs, event tracking, form interactivity, or local state.
- Compose pages from existing site primitives before adding new layout styles.
- Keep public proof visual and inspectable, using real product previews where available.
- Use `src/lib/asset-path.ts` for base-path-sensitive public assets.
- Keep text concise, concrete, and product-specific.
