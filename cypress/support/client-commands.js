import randomText from "./random-text";

Cypress.Commands.add("createClient", (overrides = {}, alias = "client") => {
  cy.fixture("client/minimal.json").then((client) => {
    client = {
      ...client,
      firstname: randomText(),
      surname: randomText(),
      ...overrides
    };
    cy.postToApi("/api/v1/clients", client)
      .its("body")
      .then((res) => {
        cy.wrap(res).as(alias);
      });
  });
});

Cypress.Commands.add("withOrder", {prevSubject: true}, ({id: clientId}, overrides = {}, alias = "order") => {
  cy.fixture("order/minimal.json").then((order) => {
    order = {...order, ...overrides};
    cy.postToApi(`/supervision-api/v1/clients/${clientId}/orders`, order)
      .its("body")
      .then((res) => {
        cy.wrap(res).as(alias);
      });
  });
});

Cypress.Commands.add("withContact", {prevSubject: true}, ({id: clientId}, overrides = {}) => {
  cy.fixture("contact/minimal.json").then((contact) => {
    contact = {...contact, ...overrides};
    cy.postToApi(`/supervision-api/v1/clients/${clientId}/contacts`, contact)
      .its("body")
      .then((res) => {
        cy.wrap({...contact, ...res}).as("contact");
      });
  });
});

Cypress.Commands.add("lodgeReport", (clientId, overrides = {}) => {
  cy.get("@jwtToken").then((jwtToken) => {
    cy.request({
      method: "GET",
      url: `/supervision-api/v1/clients/${clientId}/annual-reports`,
      headers: {
        accept: "application/json",
        authorization: jwtToken,
        "content-type": "application/json",
        "opg-bypass-membrane": 1,
      }
    }).its("body")
      .then((reports) => {
        const latestReportId = reports.filter(r => r.status.handle !== 'PENDING')[0].id;
        cy.fixture("report/minimal.json").then((contact) => {
          contact = {...contact, ...overrides};
          cy.putToApi(`/supervision-api/v1/clients/${clientId}/annual-reports/${latestReportId}/lodge`, contact)
            .its("body")
            .then((res) => {
              cy.wrap(res).as("lodgedReport");
            });
        });
      });
  });
});

Cypress.Commands.add("addWarning", {prevSubject: true}, ({id: clientId}, overrides = {}) => {
  let warning = {
    "warningText": "<p>Warning</p>",
    "warningType": {
      "handle": "Abuse Suspected",
      "label": "Abuse Suspected"
    }
  };
  cy.postToApi(`/supervision-api/v1/clients/${clientId}/warnings`, warning);
});
