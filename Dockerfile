FROM cypress/included:9.1.1

WORKDIR /root

RUN npm install "cypress-grep"
RUN npm install "cypress-failed-log"

ENV CYPRESS_VIDEO=false

COPY cypress.json cypress.json
COPY cypress cypress
