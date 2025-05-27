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
  describe(
  "Lodge report",
  { tags: ["@supervision", "@reports", "@lodge-report"] },
  () => {
    it("Successfully lodge a report", () => {
      cy.get('.report-item:first-child .lodge-report-button').should('be.visible')
      cy.get('.report-item:first-child .lodge-report-button').click();
      cy.get('.head > .title').should('contain.text', 'Lodge report');
      cy.get('input[name=digidepsReport]')
        .should('be.visible')
        .and('be.enabled')
        .and('not.be.checked');
      cy.get('#dateReportReceived_day').should('not.be.disabled').type("4")
      cy.get('#dateReportReceived_month').should('not.be.disabled').type("5")
      cy.get('#dateReportReceived_year').should('not.be.disabled').type("2020")
      cy.get('#dateReportLodged_day').should('not.be.disabled').and('be.empty')
      cy.get('#dateReportLodged_month').should('not.be.disabled').and('be.empty')
      cy.get('#dateReportLodged_year').should('not.be.disabled').and('be.empty')
      cy.get('select[name="fIELDLABELSLODGEDSTATUS"]').should('not.be.disabled')
      cy.get('footer .button.primary').should('contain.text', 'Lodge report').and('be.disabled')
      cy.getEditorByLabel("Reason")
        .enterText('<p>A reason to lodge the report</p>');
      cy.get('footer .button.primary').click()
      cy.get('.dialog-header').should('contain.text', 'Are you sure you want to mark report as received?');
      cy.contains('Yes, mark as received').click();
      cy.get('.report-item.received').should('be.visible');
      cy.get('.report-summary-content-details.received').within(() => {
        cy.get('.report-received-date-value').should('contain.text', '4 May 2020')
        cy.get('.report-status-value').should('contain.text', 'received', { matchCase: false})
      })
      cy.contains('Lodging details').click()
      cy.get('report-lodge-view').within(() => {
        cy.get('dt:contains(Date report received) + dd:contains(4 May 2020)').should('be.visible')
        cy.get('dt:contains(Reason) + dd:contains(A reason to lodge the report)').should('be.visible')
      })
    }
  );
});
