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
      cy.intercept('GET', '**/orders').as('getOrders');
    });
  });
  cy.get('#tab-container').contains('Reports').click();
});

describe(
  "Override report type",
  { tags: ["@supervision", "@reports", "@override-report-type"] },
  () => {
    it("Successfully override a report type", () => {
      cy.get('#tab-container').contains('Reports').click();
      cy.wait('@getOrders');
      cy.get('report-summary .report-type').should('not.contain.text', 'OPG102');
      cy.get('.lodge-report-container', { timeout: 10000 }).should('contain.text', 'Lodge report');
      cy.waitForStableDOM();
      cy.contains('Request OPG102').should('be.visible');
      cy.contains('Request OPG102').click();
      cy.get('.head > .title').should('contain.text', 'Request an OPG102 report');
      cy.get('footer .button.primary')
        .should('contain.text', 'Save & exit')
        .and('be.disabled')
      cy.getEditorByLabel("Explain why you’re asking the deputy to complete an OPG102 report")
        .enterText('<p>A reason to override the report type</p>');
      cy.get('footer .button.primary').click()
      cy.get('.dialog-header').should('contain.text', 'Override report type');
      cy.intercept('PUT', '**/override-report-type').as('overrideReportType');
      cy.get('.hook-modal-confirm').click()
      cy.wait('@overrideReportType');
      cy.reload();
      cy.get('#tab-container').contains('Reports').click();
      cy.waitForStableDOM();
      cy.contains('Cancel OPG102', {timeout: 10000}).should('be.visible');
      cy.get('report-summary .report-type').should('contain.text', 'OPG102')
    });
  });
