FROM node:lts-trixie-slim@sha256:28fd420825d8e922eab0fd91740c7cf88ddbdc8116a2b20a82049f0c946feb03

#based on the official cypress image, but flattened to reduce duplication and
#using -slim rather than buster to reduce size and a non-root user to run tests
#uses the chrome stable repo

RUN apt-get update && \
  apt-get install -y \
  xvfb \
  # clean up
  && rm -rf /var/lib/apt/lists/* \
  && apt-get clean

# a few environment variables to make NPM installs easier
# good colors for most applications
ENV TERM xterm
# avoid million NPM install messages
ENV npm_config_loglevel warn

# Node libraries
RUN node -p process.versions

# Install deps + add Chrome Stable + purge all the things
#from https://hub.docker.com/r/justinribeiro/chrome-headless/dockerfile/
RUN apt-get update && \
  apt-get install -y \
  chromium \
  # clean up
  && rm -rf /var/lib/apt/lists/* \
  && apt-get clean

# "fake" dbus address to prevent errors
# https://github.com/SeleniumHQ/docker-selenium/issues/87
ENV DBUS_SESSION_BUS_ADDRESS=/dev/null

# avoid too many progress messages
# https://github.com/cypress-io/cypress/issues/1243
ENV CI=1

# disable shared memory X11 affecting Cypress v4 and Chrome
# https://github.com/cypress-io/cypress-docker-images/issues/270
ENV QT_X11_NO_MITSHM=1
ENV _X11_NO_MITSHM=1
ENV _MITSHM=0

RUN mkdir /test-results && chown node /test-results
RUN mkdir -p -m0777 /home/node/cypress/downloads && chown node /home/node/cypress

WORKDIR /home/node

COPY --chown=node:node package.json package.json
COPY --chown=node:node package-lock.json package-lock.json

USER node

RUN npm ci --ignore-scripts

ENV CYPRESS_VIDEO=false

COPY --chown=node:node cypress.config.ts cypress.config.ts
COPY --chown=node:node reporter-config.json reporter-config.json
COPY --chown=node:node cypress cypress

ENV CYPRESS_CACHE_FOLDER=/home/node/.cache/Cypress

RUN ./node_modules/.bin/cypress install

ENTRYPOINT ["npm", "run"]

CMD ["test"]
