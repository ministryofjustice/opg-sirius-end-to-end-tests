beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withOrder()
    .withSupervisionLevel()
    .withActiveOrderStatus()
  cy.get("@order").then(({id: orderId}) => {
    cy.get("@client").then(({id: clientId}) => {
      cy.visit(`/supervision/#/clients/${clientId}?order=${orderId}`);
    });
  });
  cy.get(".TABS_REPORTS").click();
});
  describe(
  "Override report type",
  { tags: ["@supervision", "@reports", "@override-report-type"] },
  () => {
    it("Successfully override a report type", () => {
      cy.get('report-summary .report-type').should('not.contain.text', 'OPG102')
      cy.get('.override-report-type-link').first().as('actionLink')
      cy.get('@actionLink').should('be.visible').and('contain.text', 'Request OPG102 report')
        .click();
      cy.get('.head > .title').should('contain.text', 'Request an OPG102 report');
      cy.get('footer .button.primary')
        .should('contain.text', 'Save & exit')
        .and('be.disabled')
      cy.waitForTinyMCE()
        .enterText('<p>A reason to override the report type</p>');
      cy.get('footer .button.primary').click()
      cy.get('.dialog-header').should('contain.text', 'Override report type');
      cy.get('.hook-modal-confirm').click()
      cy.get(".TABS_REPORTS").click();
      cy.get('@actionLink').should('be.visible').and('contain.text', 'Cancel OPG102 request')
      cy.get('report-summary .report-type').should('contain.text', 'OPG102')
    }
  );
});
