#!/usr/bin/env bash
# Runs the e2e and accessibility tests locally in the official Playwright Docker image, against a
# production build of this app and the shared dev Kerrokantasi API (same setup as the PR review
# environment).
#
#   pnpm test:e2e:docker                          # all tests
#   pnpm test:e2e:docker e2e/tests/accessibility.spec.ts --project=chromium
#   A11Y_UPDATE_BASELINE=1 pnpm test:e2e:docker   # rewrite accessibility baselines
set -euo pipefail

cd "$(dirname "${BASH_SOURCE[0]}")/../.."

PLAYWRIGHT_VERSION=$(node -p "require('./package.json').devDependencies['@playwright/test'].replace(/^[^0-9]*/, '')")
PNPM_VERSION=$(node -p "require('./package.json').packageManager.split('@')[1].split('+')[0]")

mkdir -p report test-results e2e/a11y-baseline

tty_flags=()
if [ -t 0 ]; then
  tty_flags=(-it)
fi

exec docker run --rm ${tty_flags[@]+"${tty_flags[@]}"} \
  --ipc=host \
  --workdir /app \
  -e CI \
  -e A11Y_UPDATE_BASELINE \
  -e PNPM_VERSION="$PNPM_VERSION" \
  -e pnpm_config_store_dir=/pnpm-store \
  -e E2E_TESTS_ENV_URL=http://localhost:3000 \
  -v "$PWD:/src:ro" \
  -v kerrokantasi-ui-e2e-node-modules:/app/node_modules \
  -v kerrokantasi-ui-e2e-pnpm-store:/pnpm-store \
  -v "$PWD/report:/app/report" \
  -v "$PWD/test-results:/app/test-results" \
  -v "$PWD/e2e/a11y-baseline:/app/e2e/a11y-baseline" \
  "mcr.microsoft.com/playwright:v${PLAYWRIGHT_VERSION}-noble" \
  bash /src/e2e/docker/run-in-container.sh "$@"
