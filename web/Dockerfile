# syntax=docker/dockerfile:1.7
#
# Production image for the Mendez Brothes website (Payload CMS + Next.js).
#
#   docker compose build app        # no database needed at build time
#
# The build stage starts a throw-away PostgreSQL so `next build` can run
# without reaching your real database. Pages rendered at build time are empty
# shells; the entrypoint refreshes every page from the real database on boot.

ARG NODE_VERSION=22.17.0

FROM node:${NODE_VERSION}-alpine AS base
RUN apk add --no-cache libc6-compat && corepack enable
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---------- dependencies ----------
FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# ---------- tools: full source + deps (migrations, seed) ----------
FROM base AS tools
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# ---------- build ----------
FROM tools AS builder
ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=${NEXT_PUBLIC_SERVER_URL} \
    NODE_ENV=production \
    PAYLOAD_SECRET=build-time-only-not-used-at-runtime \
    DATABASE_URL=postgres://postgres@127.0.0.1:5432/postgres
RUN apk add --no-cache postgresql17 \
 && mkdir -p /run/postgresql /tmp/pgdata \
 && chown postgres:postgres /run/postgresql /tmp/pgdata \
 && su postgres -c "initdb -D /tmp/pgdata -A trust -U postgres >/dev/null" \
 && su postgres -c "pg_ctl -D /tmp/pgdata -o '-h 127.0.0.1' -w start >/dev/null" \
 && pnpm payload migrate \
 && pnpm build \
 && su postgres -c "pg_ctl -D /tmp/pgdata -m fast -w stop >/dev/null"

# ---------- runtime ----------
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0 \
    MEDIA_DIR=/app/media \
    BACKUP_DIR=/app/backups

# postgresql17-client: pg_dump / pg_restore for the admin Backups screen
RUN apk add --no-cache postgresql17-client \
 && addgroup --system --gid 1001 nodejs \
 && adduser --system --uid 1001 nextjs \
 && mkdir -p /app/media /app/backups /app/.next \
 && chown -R nextjs:nodejs /app/media /app/backups /app/.next

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --chown=nextjs:nodejs docker/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

USER nextjs
EXPOSE 3000
VOLUME ["/app/media", "/app/backups"]

HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:3000/robots.txt || exit 1

ENTRYPOINT ["/app/entrypoint.sh"]
