FROM cypress/included:9.2.0

WORKDIR /root

RUN apt-get update
RUN apt-get upgrade -y

RUN npm install "cypress-grep@2.12.0"
RUN npm install "cypress-failed-log@2.9.2"

ENV CYPRESS_VIDEO=false

COPY cypress.json cypress.json
COPY cypress cypress
