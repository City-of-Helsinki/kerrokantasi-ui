# ===============================================
FROM helsinkitest/node:12-slim as staticbuilder
# ===============================================

# Offical image has npm log verbosity as info. More info - https://github.com/nodejs/docker-node#verbosity
ENV NPM_CONFIG_LOGLEVEL warn

# set our node environment, either development or production
# defaults to production, compose overrides this to development on build and run
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

# Yarn
ENV YARN_VERSION 1.19.1
RUN yarn policies set-version $YARN_VERSION

USER root
RUN apt-install.sh build-essential

# Use non-root user
USER appuser

# Install dependencies
COPY --chown=appuser:appuser package.json yarn.lock /app/
COPY --chown=appuser:appuser config_dev.toml.example /app/config_dev.toml
RUN yarn && yarn cache clean --force

# Copy all files
COPY --chown=appuser:appuser . .

# Compile bundle
RUN yarn build

# Start express server
CMD [ "yarn", "start" ]

# Expose port 8086
EXPOSE 8086
