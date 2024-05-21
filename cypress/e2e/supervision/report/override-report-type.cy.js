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
  cy.get('#tab-container').contains('Reports').click();
});

Cypress._.times(10, () => {

  describe(
    "Override report type",
    { tags: ["@supervision", "@reports", "@override-report-type"] },
    () => {
      it("Successfully override a report type", {
        retries: {
          runMode: 2,
          openMode: 0,
        }
      }, () => {
        cy.get('.report-summary-action-panel > .lodge-report-container-parent', { timeout: 10000 }).should('contain.text', 'Lodge report');
        cy.get('report-summary .report-type').should('not.contain.text', 'OPG102');
        cy.waitUntil(() =>
          cy.get('.lodge-report-container').should('contain.text', 'Lodge report')
         );
        cy.waitUntil(() =>
          cy.get('.override-report-type-link', { timeout: 10000 }).first().should('exist')
        );
        cy.waitUntil(() => 
          cy.get('.override-report-type-link', { timeout: 10000 }).first().as('actionLink')
        );
        cy.get('@actionLink').should('be.visible');
        cy.get('@actionLink').should('contain.text', 'Request OPG102 report');
        cy.get('@actionLink').click();
        cy.get('.head > .title').should('contain.text', 'Request an OPG102 report');
        cy.get('footer .button.primary')
          .should('contain.text', 'Save & exit')
          .and('be.disabled')
        cy.waitForTinyMCE()
          .enterText('<p>A reason to override the report type</p>');
        cy.get('footer .button.primary').click()
        cy.get('.dialog-header').should('contain.text', 'Override report type');
        cy.get('.hook-modal-confirm').click()
        cy.get('#tab-container').contains('Reports').click();
        cy.get('@actionLink').should('be.visible').and('contain.text', 'Cancel OPG102 request')
        cy.get('report-summary .report-type').should('contain.text', 'OPG102')
      });
    });
});
