FROM node:25-bookworm-slim@sha256:81db02c4b671288a03915da9534dbd54f96d0e7c24d80ccc54f5b36b2e684370

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
