# ==========================================
FROM helsinkitest/node:14-slim as deployable
# ==========================================

# Official image has npm log verbosity as info. More info - https://github.com/nodejs/docker-node#verbosity
ENV NPM_CONFIG_LOGLEVEL warn

ARG NODE_ENV=production
ENV NODE_ENV $NODE_ENV

# Hardcode $HOME to /app, as yarn will need to put some stray files inside $HOME
# In Openshift $HOME would be / by default
ENV HOME /app

# Expose port 8086
EXPOSE 8086

# Yarn
ENV YARN_VERSION 1.19.1
RUN yarn policies set-version $YARN_VERSION

USER root
RUN bash /tools/apt-install.sh build-essential

# Most files from source tree are needed at runtime
COPY  . .

# Install npm dependencies and build the bundle
ENV PATH /app/node_modules/.bin:$PATH
RUN yarn config set network-timeout 300000
RUN yarn && yarn cache clean --force && yarn build

# Allow minimal writes to get the frontend server running
RUN chgrp 0 .yarn .babel.json && chmod g+w .yarn .babel.json

RUN bash /tools/apt-cleanup.sh build-essential

# Run the frontend server using arbitrary user to simulate
# Openshift when running using fe. Docker. Under actual
# Openshift, the user will be random
USER 158435:0
CMD [ "yarn", "start" ]
