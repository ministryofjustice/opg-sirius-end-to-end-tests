beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withOrder();
  cy.get("@order").then(({id}) => {
    cy.createADeputyAndAssignToExistingOrder(id);
  });
});
it("Loads the lay deputy hub", () => {
  cy.get("@client").then(({id}) => cy.visit(`/supervision/#/clients/${id}`));
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


