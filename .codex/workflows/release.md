# Release Workflow

1. Confirm `git status --short`.
2. Run `npm ci` if dependencies changed or the environment is fresh.
3. Run `npm run validate`.
4. Run `npm run build:pages` when publishing GitHub Pages.
5. Confirm required production variables from `.env.example`.
6. Confirm paid archive inputs exist and private archives are not committed.
7. Review checkout, webhook, and download routes for accidental public exposure.
8. Record notable changes in `CHANGELOG_AI.md`.
