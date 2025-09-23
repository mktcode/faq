FROM node:23-slim AS base
# Shared base to maximize cache reuse and avoid repeating apt installs
RUN --mount=type=cache,target=/var/cache/apt \
  --mount=type=cache,target=/var/lib/apt/lists \
  apt-get update \
  && apt-get install -y --no-install-recommends curl vim
WORKDIR /app

FROM base AS builder
COPY package.json package-lock.json ./
# Cache npm downloads between builds
RUN --mount=type=cache,target=/root/.npm \
  npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM base AS runner
WORKDIR /app
COPY --from=builder /app/.output ./
COPY --from=builder /app/server/db/migrate.ts ./server/migrate.ts
COPY --from=builder /app/server/db/down.ts ./server/down.ts
COPY --from=builder /app/server/db/migrations ./server/migrations

ENV NODE_ENV=production
ENV PORT=80
EXPOSE 80
CMD ["node", "server/index.mjs"]
