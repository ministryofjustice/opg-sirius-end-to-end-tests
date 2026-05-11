FROM node:25-bookworm-slim@sha256:67134eb99e14d566f2882a38a374b8351ea474656487dbb1e0c79e4064cc1725

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
