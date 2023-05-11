Cypress.Commands.add("createADeputy", (overrides = {}) => {
  cy.fixture("deputy/minimal.json").then((deputy) => {
    deputy = {
      ...deputy,
      firstname: Math.random().toString(36).slice(2),
      surname: Math.random().toString(36).slice(2),
      ...overrides
    };
    cy.postToApi("/api/v1/deputies", deputy)
      .its("body")
      .then((res) => {
        cy.wrap(res).as("deputy");
      });
  });
});

Cypress.Commands.add("createAFirm", (overrides = {}) => {
  cy.fixture("firm/minimal.json").then((firm) => {
    firm = {...firm, ...overrides};
    cy.postToApi("/api/v1/firms", firm)
      .its("body")
      .then((res) => {
        cy.wrap(res.id).as("firmId");
      });
  });
});

Cypress.Commands.add("createADeputyAndAssignToExistingOrder", (orderId, overrides = {}) => {
  cy.fixture("deputy/minimal.json").then((deputy) => {
    deputy = {...deputy, ...overrides};
    cy.postToApi("/api/v1/deputies", deputy)
      .its("body")
      .then((res) => {
        cy.wrap(res).as("deputy")
          .then(({id}) => {
            cy.postToApi(`/api/v1/orders/${orderId}/deputies`, { id })
          });
      })
  });
});
