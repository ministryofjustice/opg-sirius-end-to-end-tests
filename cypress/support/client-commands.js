import randomText from "./random-text";

Cypress.Commands.add("createClient", (overrides = {}) => {
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
        cy.wrap(res).as("client");
      });
  });
});

Cypress.Commands.add("withOrder", {prevSubject: true}, ({id: clientId}, overrides = {}) => {
  cy.fixture("order/minimal.json").then((order) => {
    order = {...order, ...overrides};
    cy.postToApi(`/supervision-api/v1/clients/${clientId}/orders`, order)
      .its("body")
      .then((res) => {
        cy.wrap(res).as("order");
      });
  });
});

Cypress.Commands.add("assignSOPNumberToClient", (clientCourtReference) => {
  let sopNumber = Date.now().toString(),
    data = "Customer Account  Number,MOJ - Casrec Ref\r\n" + sopNumber + ",OPG_" + clientCourtReference;
  cy.postToApi(`/supervision-api/v1/finance/reports/sop`, btoa(data)).its("body");
  cy.wrap(sopNumber).as("sopNumber");
});
