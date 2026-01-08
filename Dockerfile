# ===============================================
FROM registry.access.redhat.com/ubi9/nodejs-22 as appbase
# ===============================================

WORKDIR /app

USER root
RUN curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo
RUN yum -y install yarn

# Official image has npm log verbosity as info. More info - https://github.com/nodejs/docker-node#verbosity
ENV NPM_CONFIG_LOGLEVEL warn

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Yarn
ENV YARN_VERSION 1.22.19
RUN yarn policies set-version $YARN_VERSION

# Most files from source tree are needed at runtime
# COPY . /app/
RUN chown -R default:root /app

# Install npm dependencies and build the bundle
USER default

COPY --chown=default:root package.json yarn.lock /app/
COPY --chown=default:root ./scripts /app/scripts
COPY --chown=default:root ./public /app/public
COPY --chown=default:root ./cities /app/cities
COPY --chown=default:root ./assets /app/assets

RUN yarn config set network-timeout 300000
RUN yarn --frozen-lockfile --ignore-scripts --network-concurrency 1 && yarn cache clean --force
RUN yarn update-runtime-env

COPY --chown=default:root index.html vite.config.mjs eslint.config.mjs .babelrc .prettierrc .env* /app/
COPY --chown=default:root ./src /app/src

# =============================
FROM appbase as development
# =============================

WORKDIR /app

# Set NODE_ENV to development in the development container
ARG NODE_ENV=development
ENV NODE_ENV $NODE_ENV

# Bake package.json start command into the image
CMD yarn start

# ===================================
FROM appbase as staticbuilder
# ===================================

WORKDIR /app

RUN yarn build

# =============================
FROM registry.access.redhat.com/ubi9/nginx-122 as production
# =============================

USER root

RUN chgrp -R 0 /usr/share/nginx/html && \
    chmod -R g=u /usr/share/nginx/html

# Copy static build
COPY --from=staticbuilder /app/build /usr/share/nginx/html

# Copy nginx config
COPY .prod/nginx.conf  /etc/nginx/nginx.conf
RUN mkdir /etc/nginx/env
COPY .prod/nginx_env.conf  /etc/nginx/env/

WORKDIR /usr/share/nginx/html

# Copy default environment config and setup script
COPY ./scripts/env.sh .
COPY .env .

# Copy package.json so env.sh can read it
COPY package.json .

RUN chmod +x env.sh

USER 1001

CMD ["/bin/bash", "-c", "/usr/share/nginx/html/env.sh && nginx -g \"daemon off;\""]

# Expose port 8086
EXPOSE 8086
