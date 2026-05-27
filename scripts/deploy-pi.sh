#!/usr/bin/env bash
set -euo pipefail

PI_USER="${PI_USER:-matthew}"
PI_HOST="${PI_HOST:-192.168.4.22}"
REMOTE_DIR="${REMOTE_DIR:-/srv/templatehedgehog/current}"
SERVICE_NAME="${SERVICE_NAME:-templatehedgehog.service}"
PUBLIC_URL="${PUBLIC_URL:-https://templatehedgehog.co.uk}"
SSH_TARGET="${PI_USER}@${PI_HOST}"

RSYNC_EXCLUDES=(
  "--exclude=.git/"
  "--exclude=node_modules/"
  "--exclude=.next/"
  "--exclude=out/"
  "--exclude=output/"
  "--exclude=test-results/"
  "--exclude=.artifacts/"
  "--exclude=.gh-pages-local/"
  "--exclude=.playwright-cli/"
  "--exclude=.next_stale_*/"
  "--exclude=tsconfig.tsbuildinfo"
  "--exclude=.env.local"
  "--exclude=private/downloads/"
  "--exclude=public/resources/saas-admin-pro-product-brief.txt"
  "--exclude=src/lib/mock-data.ts"
)

if [[ "${1:-}" == "--dry-run" ]]; then
  rsync -avzn --delete "${RSYNC_EXCLUDES[@]}" ./ "$SSH_TARGET:$REMOTE_DIR/"
  exit 0
fi

echo "Creating remote backup on $SSH_TARGET..."
ssh "$SSH_TARGET" "set -e; ts=\$(date +%Y%m%dT%H%M%S%z); mkdir -p /srv/templatehedgehog/backups; cp -al '$REMOTE_DIR' /srv/templatehedgehog/backups/current.\$ts; echo /srv/templatehedgehog/backups/current.\$ts"

echo "Syncing source to $REMOTE_DIR..."
rsync -az --delete "${RSYNC_EXCLUDES[@]}" ./ "$SSH_TARGET:$REMOTE_DIR/"

echo "Building on the Pi..."
ssh "$SSH_TARGET" "set -e; cd '$REMOTE_DIR'; npm run build"

echo "Restarting $SERVICE_NAME..."
ssh "$SSH_TARGET" "set -e; if sudo -n systemctl restart '$SERVICE_NAME' 2>/dev/null; then exit 0; fi; pid=\$(systemctl show -p MainPID --value '$SERVICE_NAME'); if [[ -z \"\$pid\" || \"\$pid\" == 0 ]]; then echo 'Could not find service MainPID' >&2; exit 1; fi; kill \"\$pid\"; for i in \$(seq 1 30); do sleep 1; new_pid=\$(systemctl show -p MainPID --value '$SERVICE_NAME'); if [[ -n \"\$new_pid\" && \"\$new_pid\" != 0 && \"\$new_pid\" != \"\$pid\" ]]; then exit 0; fi; done; echo 'Service did not restart with a new PID' >&2; exit 1"

echo "Checking remote service..."
ssh "$SSH_TARGET" "set -e; systemctl is-active '$SERVICE_NAME'; curl -skI -H 'Host: templatehedgehog.co.uk' https://127.0.0.1/ | sed -n '1,12p'"

echo "Checking public routes..."
for route in / /pricing /components /layouts /docs /about /support /changelog /success; do
  code="$(curl -sk -o /dev/null -w '%{http_code}' "$PUBLIC_URL$route")"
  printf '%s %s\n' "$code" "$route"
  [[ "$code" == "200" ]]
done

echo "Template Hedgehog Pi deployment complete."
