beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withOrder()
    .withSupervisionLevel()
  cy.get("@order").then(({id: orderId}) => {
    cy.createADeputyAndAssignToExistingOrder(orderId)
    cy.makeOrderActive(orderId)
    cy.get("@client").then(({id: clientId}) => {
      cy.visit(`/supervision/#/clients/${clientId}?order=${orderId}`);
    });
  });
  cy.get('#tab-container').contains('Reports').click();
});
  describe(
    "Abandon report",
    { tags: ["@supervision", "@reports", "@abandon-report"] },
    () => {
      it("Successfully abandon a report", () => {
          cy.get('.abandon-report-link').should('be.visible');
          cy.get('.abandon-report-link').first().click();
          cy.get('.head > .title').should('contain.text', 'Abandon report');
          cy.get('#abandoned-date').should('contain.text', 'Abandoned date');
          cy.get('.smart__action').should('contain.text', 'Reason');
        cy.getDatePickerInputByLabel("Abandoned date").type("01/01/2023");
          cy.getEditorByLabel("Reason")
            .enterText('<p>A reason to abandon the report</p>');
          cy.get('.footer > :nth-child(1) > .button').should('contain.text', 'Abandon report').click();
          cy.get('.header-text > span').should('contain.text', 'Are you sure you want to abandon the report');
          cy.contains('abandon report').click();
          cy.get('.report-item.abandoned').should('be.visible');
          cy.contains('Details').click()
          cy.get('.report-abandoned-details > :nth-child(1)').should('contain.text', 'Abandoned date');
          cy.get('.report-abandoned-details > :nth-child(2)').should('contain.text', 'A reason to abandon the report');
        }
    );
});
