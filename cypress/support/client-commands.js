Cypress.Commands.add("createAClient", () => {
  cy.fixture("client/minimal.json").then((client) => {
    cy.postToApi("/api/v1/clients", client)
      .its("body")
      .then((res) => {
        cy.wrap(res).as("client");
      });
  });
});

Cypress.Commands.add("createOrderForClient", (clientId, overrides = {}) => {
  cy.fixture("order/minimal.json").then((order) => {
    order = {...order, ...overrides};
    cy.postToApi(`/supervision-api/v1/clients/${clientId}/orders`, order)
      .its("body")
      .then((res) => {
        cy.wrap(res.caseRecNumber).as("courtReference");
        cy.wrap(res.id).as("orderId");
      });
  });
});

Cypress.Commands.add("assignSOPNumberToClient", (clientCourtReference) => {
  let sopNumber = Date.now().toString(),
    data = "Customer Account  Number,MOJ - Casrec Ref\r\n" + sopNumber + ",OPG_" + clientCourtReference;
  cy.postToApi(`/supervision-api/v1/finance/reports/sop`, btoa(data)).its("body");
  cy.wrap(sopNumber).as("sopNumber");
});
