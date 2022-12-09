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

