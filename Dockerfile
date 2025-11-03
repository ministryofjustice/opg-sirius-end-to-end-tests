FROM node:24-bookworm-slim

#based on the official cypress image, but flattened to reduce duplication and
#using -slim rather than buster to reduce size and a non-root user to run tests
#uses the chrome stable repo

RUN apt-get update && apt-get upgrade -y && \
  apt-get install --no-install-recommends -y \
  bzip2 \
  libgtk2.0-0 \
  libgtk-3-0 \
  libnotify-dev \
  libgconf-2-4 \
  libgbm-dev \
  libnss3 \
  libxss1 \
  libasound2 \
  libxtst6 \
  xauth \
  xvfb \
  # clean up
  && rm -rf /var/lib/apt/lists/* \
  && apt-get clean

# a few environment variables to make NPM installs easier
# good colors for most applications
ENV TERM xterm
# avoid million NPM install messages
ENV npm_config_loglevel warn
# allow installing when the main user is root
ENV npm_config_unsafe_perm true

# Node libraries
RUN node -p process.versions

# Install deps + add Chrome Stable + purge all the things
#from https://hub.docker.com/r/justinribeiro/chrome-headless/dockerfile/
RUN apt-get update && apt-get install -y \
	apt-transport-https \
	ca-certificates \
	curl \
	gnupg \
	--no-install-recommends \
	&& apt-get update && apt-get install -y \
	chromium \
  wget \
	fontconfig \
	fonts-ipafont-gothic \
	fonts-wqy-zenhei \
	fonts-thai-tlwg \
	fonts-kacst \
	fonts-symbola \
	fonts-noto \
	fonts-freefont-ttf \
	--no-install-recommends \
	&& apt-get purge --auto-remove -y curl gnupg \
	&& rm -rf /var/lib/apt/lists/*

# "fake" dbus address to prevent errors
# https://github.com/SeleniumHQ/docker-selenium/issues/87
ENV DBUS_SESSION_BUS_ADDRESS=/dev/null

# add codecs needed for video playback in firefox
# https://github.com/cypress-io/cypress-docker-images/issues/150
# We don't use video so disabling until we need it
#RUN apt-get install mplayer -y

# install Firefox browser
ARG FIREFOX_VERSION=93.0
RUN wget --no-verbose -O /tmp/firefox.tar.bz2 https://download-installer.cdn.mozilla.net/pub/firefox/releases/$FIREFOX_VERSION/linux-x86_64/en-US/firefox-$FIREFOX_VERSION.tar.bz2 \
  && tar -C /opt -xjf /tmp/firefox.tar.bz2 \
  && rm /tmp/firefox.tar.bz2 \
  && ln -fs /opt/firefox/firefox /usr/bin/firefox

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
