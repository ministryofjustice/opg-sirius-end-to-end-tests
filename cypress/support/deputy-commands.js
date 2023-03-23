Cypress.Commands.add("createADeputy", (overrides = {}) => {
  cy.fixture("deputy/minimal.json").then((deputy) => {
    deputy = {...deputy, ...overrides};
    cy.postToApi("/api/v1/deputies", deputy)
      .its("body")
      .then((res) => {
        cy.wrap(res.id).as("deputyId");
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

Cypress.Commands.add("createADeputyAndAssignToExistingOrder", (orderId) => {
  cy.fixture("deputy/minimal.json").then((deputy) => {
    cy.postToApi("/api/v1/deputies", deputy)
      .its("body")
      .then((res) => {
        cy.wrap(res.id).as("deputyId")
          .then((deputyId) => {
            let data = { id: deputyId };
            cy.postToApi(`/api/v1/orders/${orderId}/deputies`, data)
          });
      })
  });
});

Cypress.Commands.add("searchForADeputyToReachAddADeputyPage", () => {
  cy.get('#add-deputy-button').click();
  // type in name to search field
  cy.get('.deputy-search__input').type("deputy");
  cy.get('.deputy-search__form > .button').click();
  cy.contains('Add a new deputy').click();
});
