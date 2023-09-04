# ==========================================
FROM registry.access.redhat.com/ubi8/nodejs-18 AS deployable
# ==========================================

WORKDIR /app

USER root
RUN curl --silent --location https://dl.yarnpkg.com/rpm/yarn.repo | tee /etc/yum.repos.d/yarn.repo
RUN yum -y install yarn

# Official image has npm log verbosity as info. More info - https://github.com/nodejs/docker-node#verbosity
ENV NPM_CONFIG_LOGLEVEL warn

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Yarn
ENV YARN_VERSION 1.19.1
RUN yarn policies set-version $YARN_VERSION

# Most files from source tree are needed at runtime
COPY . /app/
RUN chown -R default:root /app

# Install npm dependencies and build the bundle
USER default

RUN yarn cache clean --force
RUN yarn
RUN yarn build

# Run the frontend server using arbitrary user to simulate
# Openshift when running using fe. Docker. Under actual
# Openshift, the user will be random
USER 158435:0
CMD [ "yarn", "start" ]

# Expose port 8086
EXPOSE 8086
