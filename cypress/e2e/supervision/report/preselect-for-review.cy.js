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
  "Preselect report for review",
  { tags: ["@supervision", "@reports", "@preselect-report-for-review"] },
  () => {
    it("Successfully preselect a report for review", () => {
      cy.contains('View pending report')
      cy.wait(1000) // sad times :(
      cy.contains('View pending report').click()
      cy.get('.preselect-report-for-review-link')
        .should('be.visible')
        .and('contain.text', 'Preselect for review')
        .click()
      cy.get('.head > .title').should('contain.text', 'Preselect for staff review');
      cy.get('radio-button-group[name=preselectReportForReview] .checked').should('contain.text', 'No')
      cy.get('radio-button-group[name=preselectReportForReview] label:contains(Yes)').click()
      cy.get('footer .button.primary').should('contain.text', 'Save & exit').and('be.disabled')
      cy.waitForTinyMCE()
        .enterText('<p>A reason to preselect for staff review</p>');
      cy.get('footer .button.primary').click()
      cy.contains('Report review status updated, redirecting...')

      cy.get("@order").then(({id: orderId}) => {
        cy.get("@client").then(({id: clientId}) => {
          cy.visit(`/supervision/#/clients/${clientId}?order=${orderId}`);
          cy.get(".TABS_REPORTS").click();
          cy.wait(1000) // :`(
          cy.contains('View pending report').click()
          cy.get('.preselect-report-for-review-link')
            .should('be.visible')
            .and('contain.text', 'Change review status')
          cy.get('.report-summary-content-details.pending').within(() => {
            cy.get('.report-review-status-value').should('contain.text', 'Staff: preselected')
          })
        });
      });
    }
  );
});
