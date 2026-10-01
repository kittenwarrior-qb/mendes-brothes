#!/bin/sh
# Starts the Next.js server, then (once it answers) marks every cached page
# stale so visitors get content from the live database, not the build.
set -eu

node server.js &
PID=$!
trap 'kill -TERM "$PID" 2>/dev/null' TERM INT

(
  i=0
  while [ $i -lt 60 ]; do
    i=$((i + 1))
    sleep 2
    if wget -q -O /dev/null --post-data='' \
      --header="x-revalidate-secret: ${CRON_SECRET:-}" \
      "http://127.0.0.1:${PORT:-3000}/next/revalidate" 2>/dev/null; then
      echo "[entrypoint] caches refreshed"
      exit 0
    fi
  done
  echo "[entrypoint] warning: could not refresh caches (is CRON_SECRET set, 16+ chars?)"
) &

wait "$PID"
