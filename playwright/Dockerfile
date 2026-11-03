FROM node:26-bookworm-slim@sha256:bc0a2afd3b74ce12222fc8bab99271e66257f021078f5f4a5d687a77d280c1d9

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
