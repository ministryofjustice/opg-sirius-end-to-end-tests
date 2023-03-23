Cypress.Commands.add('addVisitForClient', (clientId, overrides = {}) => {
  cy.fixture("visit/minimal.json").then((visit) => {
    visit = {...visit, ...overrides};
    cy.postToApi(`/api/v1/clients/${clientId}/visits`, visit)
      .its("body")
      .then((res) => {
        cy.wrap(res.id).as("visitId");
      });
  });
});

Cypress.Commands.add('editVisitForClient', (visitId, clientId, overrides = {}) => {
  cy.putToApi(`/supervision-api/v1/clients/${clientId}/visits/${visitId}`, overrides);
});
