# Deployment

Template Hedgehog has two deployment targets:

- GitHub Pages for static public proof builds.
- The self-hosted Raspberry Pi for the full production Next.js app, checkout routes, and token-gated downloads.

## Production Pi

The live production app is served from the Raspberry Pi on the local network.

- SSH target: `matthew@192.168.4.22`
- App directory: `/srv/templatehedgehog/current`
- Service: `templatehedgehog.service`
- Service working directory: `/srv/templatehedgehog/current`
- Service port: `127.0.0.1:3001`
- Nginx vhost: `/etc/nginx/sites-available/templatehedgehog`
- Public domain: `https://templatehedgehog.co.uk`
- Runtime environment file: `/srv/templatehedgehog/current/.env.local`
- Backup directory: `/srv/templatehedgehog/backups`

The Nginx vhost proxies `templatehedgehog.co.uk`, `www.templatehedgehog.co.uk`, `templatehedgehog.com`, and `www.templatehedgehog.com` to the Next.js service on port `3001`.

## Standard Pi Deployment

From the repository root:

```bash
npm run deploy:pi:dry-run
npm run deploy:pi
```

The deployment script:

1. Creates a hard-link backup under `/srv/templatehedgehog/backups/current.<timestamp>`.
2. Syncs the local source to `/srv/templatehedgehog/current`.
3. Preserves `.env.local`, `node_modules`, `.next`, generated download archives, and local/generated cache folders during sync.
4. Runs `npm run build` on the Pi.
5. Restarts `templatehedgehog.service`.
6. Checks the local Nginx vhost and public canonical routes.

The script first tries passwordless `sudo systemctl restart templatehedgehog.service`. If sudo is not available, it terminates the service `MainPID`; systemd has `Restart=always` and starts the freshly built app.

## Manual Recovery Commands

If the helper script is unavailable, use this sequence from the repository root:

```bash
ssh matthew@192.168.4.22 'set -e; ts=$(date +%Y%m%dT%H%M%S%z); mkdir -p /srv/templatehedgehog/backups; cp -al /srv/templatehedgehog/current /srv/templatehedgehog/backups/current.$ts'
rsync -az --delete --exclude='.git/' --exclude='node_modules/' --exclude='.next/' --exclude='out/' --exclude='output/' --exclude='test-results/' --exclude='.artifacts/' --exclude='.gh-pages-local/' --exclude='.playwright-cli/' --exclude='.next_stale_*/' --exclude='tsconfig.tsbuildinfo' --exclude='.env.local' --exclude='private/downloads/' ./ matthew@192.168.4.22:/srv/templatehedgehog/current/
ssh matthew@192.168.4.22 'cd /srv/templatehedgehog/current && npm run build'
ssh matthew@192.168.4.22 'pid=$(systemctl show -p MainPID --value templatehedgehog.service); kill "$pid"'
```

Then verify:

```bash
ssh matthew@192.168.4.22 'systemctl is-active templatehedgehog.service'
curl -skI https://templatehedgehog.co.uk/
for route in / /pricing /components /layouts /docs /about /support /changelog /success; do curl -sk -o /dev/null -w "%{http_code} $route\n" "https://templatehedgehog.co.uk$route"; done
```

Expected result: all listed public routes return `200`, and `/checkout/success` may redirect when no valid checkout session is supplied.

## GitHub Pages

GitHub Pages remains configured for static public proof builds through `.github/workflows/deploy-pages.yml` and `npm run build:pages`. Static export disables server-only commerce routes and must not be treated as the full production backend.
