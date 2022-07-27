Cypress.Commands.add("createAClient", () => {
  cy.fixture('client/minimal.json').then(client => {
    cy.postToApi('/api/v1/clients', client)
      .its('body')
      .then(res => {
        cy.wrap(res.caseRecNumber).as('clientCourtReference');
        cy.wrap(res.id).as('clientId');
      });
  });
});

Cypress.Commands.add("createOrderForClient", (clientId) => {
  cy.fixture('order/minimal.json').then(order => {
    cy.postToApi(`/supervision-api/v1/clients/${clientId}/orders`, order)
      .its('body')
      .then(res => {
        cy.wrap(res.caseRecNumber).as('courtReference');
        cy.wrap(res.id).as('orderId');
      });
  });
});
