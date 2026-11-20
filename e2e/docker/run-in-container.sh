#!/usr/bin/env bash
# Runs inside the Playwright container started by run.sh. Builds and serves the app from a copy of
# the read-only mounted source (/src), so nothing on the host is modified except the mounted
# report, test-results and a11y-baseline directories.
set -euo pipefail

echo "Copying sources..."
tar -C /src \
  --exclude=./.git \
  --exclude=./node_modules \
  --exclude=./build \
  --exclude=./dist \
  --exclude=./coverage \
  --exclude=./report \
  --exclude=./test-results \
  --exclude=./e2e/a11y-baseline \
  --exclude=./.env.local \
  --exclude='./.env.*.local' \
  --exclude='*/env-config.js' \
  --exclude='*/test-env-config.js' \
  -cf - . | tar -C /app -xf -

# The Playwright image ships Node without corepack; install the repo's pinned pnpm.
npm install -g --silent "pnpm@${PNPM_VERSION}"
pnpm install --frozen-lockfile --ignore-scripts

# Committed .env defaults (shared dev API) without analytics or error reporting.
cat > .env.local <<ENV
REACT_APP_MATOMO_ENABLED=false
REACT_APP_SENTRY_DSN=
ENV
pnpm update-runtime-env
pnpm exec vite build

pnpm exec vite preview --host 127.0.0.1 --port 3000 --strictPort > /tmp/preview.log 2>&1 &
for _ in $(seq 1 60); do
  curl -sf -o /dev/null http://127.0.0.1:3000/ && break
  sleep 1
done
curl -sf -o /dev/null http://127.0.0.1:3000/ || { cat /tmp/preview.log; exit 1; }

exec pnpm exec playwright test "$@"
