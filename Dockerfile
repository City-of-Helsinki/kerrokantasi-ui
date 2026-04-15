# ============================================================
# STAGE 1: Build the Static Assets
# ============================================================
FROM helsinki.azurecr.io/ubi9/nodejs-22-yarn-builder-base AS staticbuilder

# 1. Install dependencies
# Base already has /app as WORKDIR
COPY --chown=default:root package.json yarn.lock ./
COPY --chown=default:root ./scripts ./scripts
COPY --chown=default:root ./public ./public
COPY --chown=default:root ./cities ./cities
COPY --chown=default:root ./assets ./assets

# 2. Run the install
RUN yarn --frozen-lockfile --ignore-engines --ignore-scripts --network-concurrency 1 \
 && yarn update-runtime-env \
 && yarn cache clean --force

# 3. Copy remaining source files
COPY --chown=default:root index.html vite.config.mjs eslint.config.mjs .prettierrc .env* ./
COPY --chown=default:root ./src ./src

# 4. Perform the build
ARG REACT_APP_SENTRY_RELEASE

RUN yarn build


# ============================================================
# STAGE 2: Production Runtime
# ============================================================
FROM helsinki.azurecr.io/ubi9/nginx-126-spa-standard AS production

ARG REACT_APP_SENTRY_RELEASE
ENV APP_RELEASE=${REACT_APP_SENTRY_RELEASE:-""}
# 1. Copy the compiled assets
COPY --from=staticbuilder /app/build /usr/share/nginx/html

# 2. Setup Runtime Env Injection
# env.sh is provided by the base image
WORKDIR /usr/share/nginx/html
COPY .env .

# 3. Inject Versioning for the /readiness endpoint from package.json using base image
COPY package.json .

# - env.sh      (Inherited from base image at /usr/share/nginx/html/env.sh)
# - USER 1001   (Inherited from base image)
# - EXPOSE 8080 (Inherited from base image)
# - ENTRYPOINT/CMD (Inherited from base image)