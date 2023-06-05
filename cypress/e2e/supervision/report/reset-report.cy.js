beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withOrder()
    .withSupervisionLevel()
    .withOrderStatus();

  cy.get("@order").then(({id: orderId}) => {
    cy.get("@client").then(({id: clientId}) => {
      cy.visit(
        `/supervision/#/clients/${clientId}?order=${orderId}`
      );
    });
  });
  cy.get('.TABS_REPORTS').click();
});

describe(
  "Reset report",
  {tags: ["@supervision", "@reports", "@reset-report"]},
  () => {
    it("Successfully reset a report", () => {
        cy.get('.lodge-report-button').first().click();
        cy.get('input[name="dateReportReceived_day"]').type('01');
        cy.get('input[name="dateReportReceived_month"]').type('01');
        cy.get('input[name="dateReportReceived_year"]').type('2023');
        cy.waitForTinyMCE()
          .enterText('<p>Lodging</p>');

        cy.contains('[type="submit"]', 'Lodge report').should('not.be.disabled').click();
        cy.contains('button', 'Yes, mark as received').click();

        cy.get('.report-summary-container').first().contains('.report-status', 'received');

        cy.get('.lodge-report-button').first().click();

        // button should be disabled until all fields are empty
        cy.contains('[type="submit"]', 'Lodge report').should('be.disabled');
        cy.get('input[name="dateReportReceived_day"]').clear();
        cy.contains('[type="submit"]', 'Lodge report').should('be.disabled');
        cy.get('input[name="dateReportReceived_month"]').clear();
        cy.contains('[type="submit"]', 'Lodge report').should('be.disabled');
        cy.get('input[name="dateReportReceived_year"]').clear();

        // button is enabled and renamed to reset report
        cy.contains('[type="submit"]', 'Reset report').should('not.be.disabled').click();

        cy.get('.report-summary-container').first().contains('.report-status', 'non-compliant');
      }
    );
  })
;
