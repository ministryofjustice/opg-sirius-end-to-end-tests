Cypress.Commands.add("createClient", (overrides = {}) => {
  cy.fixture("client/minimal.json").then((client) => {
    client = {
      ...client,
      firstname: Math.random().toString(36).slice(2),
      surname: Math.random().toString(36).slice(2),
      ...overrides
    };
    cy.postToApi("/api/v1/clients", client)
      .its("body")
      .then((res) => {
        cy.wrap(res).as("client");
      });
  });
});

Cypress.Commands.add("withOrder", {prevSubject: true}, (client, overrides = {}) => {
  cy.fixture("order/minimal.json").then((order) => {
    console.log(client.firstname);
    order = {...order, ...overrides};
    cy.postToApi(`/supervision-api/v1/clients/${client.id}/orders`, order)
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
