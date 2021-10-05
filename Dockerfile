FROM cypress/included:8.3.1
RUN npm install "cypress-grep"

WORKDIR /root

ENV CYPRESS_VIDEO=false

COPY cypress.json cypress.json
COPY cypress cypress
