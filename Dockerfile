# ============================================================
# STAGE 1: Build the Static Assets
# ============================================================
FROM container-registry.platta-net.hel.fi/devops-toolchain/nodejs-builder-base:1.0 AS staticbuilder

# 1. Install dependencies
# Base already has /app as WORKDIR and default user active
COPY --chown=default:root package.json yarn.lock ./
RUN yarn --frozen-lockfile --ignore-engines --network-concurrency 1 && yarn cache clean --force

# 2. Copy source and build
COPY --chown=default:root . . 
RUN yarn build

# 3. Generate the readiness include file
ARG REACT_APP_SENTRY_RELEASE
ENV REACT_APP_RELEASE=${REACT_APP_SENTRY_RELEASE:-""}

# Use the gettext/envsubst built into base image
RUN export APP_VERSION=$(grep version package.json | awk -F: '{ print $2 }' | sed 's/[", ]//g') && \
    envsubst '${APP_VERSION},${REACT_APP_RELEASE}' < .prod/readiness.conf.template > readiness.conf

# ============================================================
# STAGE 2: Production Runtime
# ============================================================
FROM container-registry.platta-net.hel.fi/devops-toolchain/nginx-spa-standard:1.0 AS production

# 1. Copy the compiled static assets
COPY --from=staticbuilder /app/dist /usr/share/nginx/html

# 2. Inject App-Specific Nginx Config
COPY --from=staticbuilder /app/readiness.conf* /etc/nginx/includes/
COPY .prod/nginx_env.conf /etc/nginx/env/

# 3. Setup Runtime Env Injection
# The Managed Entrypoint in the base image will automatically execute env.sh
COPY ./scripts/env.sh .
COPY .env .
COPY package.json .

# - USER (Inherited 1001 from base image)
# - EXPOSE (Inherited 8080 from base image)
# - ENTRYPOINT/CMD (Inherited from base image)