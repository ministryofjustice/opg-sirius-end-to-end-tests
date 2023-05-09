beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createAClient();
  cy.get("@clientId").then((clientId) => cy.createOrderForClient(clientId));
  cy.get("@orderId").then((orderId) => {
    cy.createADeputyAndAssignToExistingOrder(orderId);
  });
});
Cypress._.times(50, () => {
  it("Loads the lay deputy hub", () => {
    cy.get("@clientId").then((clientId) => cy.visit(`/supervision/#/clients/${clientId}`));
    cy.get('.TABS_DEPUTIES').click();
    cy.get('.record').click();
    cy.url().should('include', 'supervision/#/deputy-hub');
    cy.get('.deputy-hub-deputy-name-header-link').should('be.visible');

    cy.get('.tab-container__tabs').should('contain.text', 'Details');
    cy.get('.tab-container__tabs').should('contain.text', 'Clients');
    cy.get('.tab-container__tabs').should('contain.text', 'Tasks');
    cy.get('.tab-container__tabs').should('contain.text', 'Warnings');
    cy.get('.tab-container__tabs').should('contain.text', 'Timeline');
    cy.get('.tab-container__tabs').should('contain.text', 'Documents');

    cy.get('.deputy-sub-theme').should('be.visible');
  });
});

