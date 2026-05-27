# Deployment Rules

- Run `npm run validate` before production deployment.
- Use `npm run build:pages` for GitHub Pages static export.
- Static export does not provide server-only paid delivery routes.
- Production server hosting must provide the variables listed in `.env.example`.
- Keep `public/CNAME` aligned with the intended GitHub Pages custom domain.
- Do not commit generated private download archives.
