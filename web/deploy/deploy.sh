#!/usr/bin/env bash
# Build and (re)start the production stack on the VPS.
#
#   ./deploy/deploy.sh           # deploy / update
#   ./deploy/deploy.sh --seed    # first install with demo content (WIPES content!)
set -euo pipefail
cd "$(dirname "$0")/.."

[ -f .env ] || { echo "Missing .env — copy .env.example and fill it in."; exit 1; }

# shellcheck disable=SC1091
set -a; . ./.env; set +a
for v in PAYLOAD_SECRET CRON_SECRET POSTGRES_PASSWORD; do
  val="${!v:-}"
  if [ -z "$val" ] || [[ "$val" == change-me* ]]; then
    echo "Set a real value for $v in .env (openssl rand -hex 32)"; exit 1
  fi
done

echo "▶ Building image (no database needed)…"
docker compose build app

echo "▶ Starting database…"
docker compose up -d db

if [ "${1:-}" = "--seed" ]; then
  read -r -p "This deletes all site content and loads the demo. Continue? [y/N] " ok
  [ "$ok" = "y" ] || exit 1
  echo "▶ Seeding demo content…"
  docker compose --profile tools build seed
  docker compose --profile tools run --rm seed
fi

echo "▶ Starting website + Caddy (migrations run on boot)…"
docker compose up -d app caddy

echo "▶ Waiting for the site to answer…"
for _ in $(seq 1 60); do
  if docker compose exec -T app wget -q -O /dev/null http://127.0.0.1:3000/robots.txt 2>/dev/null; then
    echo "✔ Up: ${NEXT_PUBLIC_SERVER_URL}  (admin: ${NEXT_PUBLIC_SERVER_URL}/admin)"
    docker image prune -f >/dev/null
    exit 0
  fi
  sleep 2
done
echo "✖ The site did not come up — check: docker compose logs app"; exit 1
