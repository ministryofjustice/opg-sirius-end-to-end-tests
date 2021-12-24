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
