#!/usr/bin/env bash
# Daily backup of the database and uploaded media. Keeps the last 14 days.
# Add to the server's crontab:   0 3 * * * /opt/mendez/web/deploy/backup.sh >> /var/log/mendez-backup.log 2>&1
set -euo pipefail
cd "$(dirname "$0")/.."
set -a; . ./.env; set +a

DEST=deploy/backups
STAMP=$(date +%Y%m%d-%H%M)
mkdir -p "$DEST"

docker compose exec -T db pg_dump -U "${POSTGRES_USER:-mendez}" -d "${POSTGRES_DB:-mendez}" --format=custom \
  > "$DEST/db-$STAMP.dump"

# The media volume is named <project>_media (project name "mendez" in docker-compose.yml).
docker run --rm -v mendez_media:/media:ro -v "$(pwd)/$DEST:/backup" alpine \
  tar -czf "/backup/media-$STAMP.tgz" -C /media .

find "$DEST" -type f -mtime +14 -delete
echo "$(date) backup ok: $DEST/*-$STAMP.*"

# Restore:
#   docker compose exec -T db pg_restore -U mendez -d mendez --clean --if-exists < deploy/backups/db-XXXX.dump
#   docker run --rm -v mendez_media:/media -v "$(pwd)/deploy/backups:/backup" alpine \
#     sh -c "tar -xzf /backup/media-XXXX.tgz -C /media && chown -R 1001:1001 /media"
#   docker compose restart app
