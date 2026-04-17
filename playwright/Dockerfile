FROM node:lts-bookworm@sha256:1698b8f453a36aa5b2545a0ab21b1781bef5c62a4626a2e8d2a01e7cde4fad45

WORKDIR /playwright

COPY --chown=node:node package.json package.json
COPY --chown=node:node package-lock.json package-lock.json

RUN npm ci --ignore-scripts

# Install chromium and dependencies
RUN apt-get update && apt-get upgrade -y
RUN npx playwright install chromium --with-deps

# Copy prettier config
COPY --chown=node:node .prettierignore .prettierignore

# Copy eslint config
COPY --chown=node:node eslint.config.mjs eslint.config.mjs

# Copy playwright files
COPY --chown=node:node playwright.config.ts playwright.config.ts
COPY --chown=node:node fixtures fixtures
COPY --chown=node:node tests tests
COPY --chown=node:node utils utils

ENTRYPOINT ["npm", "run"]
