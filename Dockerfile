# Production image for the Next.js frontend (standalone output). Built and run by
# inc_backend/deploy/hetzner/docker-compose.yml on the Hetzner server.

# 1) Install dependencies (build on Linux so native packages like sharp match).
FROM node:22-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 2) Build. NEXT_PUBLIC_* values are baked into the bundle at build time.
FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Empty API URL = the site calls its own /api, which Caddy routes to the API.
ARG NEXT_PUBLIC_API_URL=""
ARG NEXT_PUBLIC_GOOGLE_AUTH=""
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_GOOGLE_AUTH=$NEXT_PUBLIC_GOOGLE_AUTH \
    NEXT_TELEMETRY_DISABLED=1
RUN npm run build

# 3) Run: only the standalone server and its static assets.
FROM node:22-alpine AS run
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/public ./public
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
USER node
EXPOSE 3000
CMD ["node", "server.js"]
