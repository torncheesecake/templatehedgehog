# Deployment Rules

- Run `npm run validate` before production deployment.
- Use `npm run deploy:pi:dry-run` and `npm run deploy:pi` for the live self-hosted Raspberry Pi deployment. The Pi is `matthew@192.168.4.22`, the app path is `/srv/templatehedgehog/current`, and the service is `templatehedgehog.service`.
- Use `npm run build:pages` for GitHub Pages static export.
- Static export does not provide server-only paid delivery routes.
- Production server hosting must provide the variables listed in `.env.example`.
- Keep `public/CNAME` aligned with the intended GitHub Pages custom domain.
- Do not commit generated private download archives.
- Keep `docs/deployment.md` updated whenever hosting, service names, paths, or restart behaviour changes.
