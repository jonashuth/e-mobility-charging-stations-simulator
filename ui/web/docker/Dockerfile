FROM node:lts-alpine AS builder

# Build dashboard
WORKDIR /usr/builder
COPY . ./
RUN set -ex \
  && corepack enable \
  && corepack prepare pnpm@latest --activate \
  && pnpm set progress=false \
  && pnpm config set depth 0 \
  && pnpm install --ignore-scripts \
  && cp ui/web/docker/config.json ui/web/public/config.json \
  && pnpm build

FROM node:lts-alpine

WORKDIR /usr/app
COPY --from=builder /usr/builder ./
COPY ui/web/docker/run.sh /run.sh
COPY ui/web/docker/autoconfig.sh /autoconfig.sh
COPY ui/web/start.js /usr/app/start.js

RUN set -ex \
  && chmod +x /run.sh \
  && chmod +x /autoconfig.sh

ENTRYPOINT ["/bin/sh", "-c", "/autoconfig.sh && /run.sh"]
