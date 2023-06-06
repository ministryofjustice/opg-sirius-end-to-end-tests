beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withOrder()
    .withSupervisionLevel()
    .withOrderStatus();

  cy.get("@order").then(({id: orderId}) => {
    cy.get("@client").then(({id: clientId}) => {
      cy.lodgeReport(clientId, {
        dateReportReceived: "01/01/2022",
        lodgedStatus: {"handle": "REFERRED_FOR_REVIEW", "label": "Referred for review"},
      })
        .then(() => {
          cy.visit(
            `/supervision/#/clients/${clientId}?order=${orderId}`
          );
        });
    });
  });
  cy.get('.TABS_REPORTS').click();
});

describe(
  "Review report",
  {tags: ["@supervision", "@reports", "@reset-report"]},
  () => {
    it("Successfully reset a report", () => {
        cy.get('.report-summary-container').first().contains('.report-status', 'lodged');
        cy.get('.review-report-link').first().click();

        cy.get("#reviewDecision")
          .contains("No further action required")
          .click();
        cy.waitForTinyMCE()
          .enterText('<p>Report reviewed</p>');


        cy.get('input[name="dateReportReviewed_day"]').clear();
        cy.get('input[name="dateReportReviewed_month"]').clear();
        cy.get('input[name="dateReportReviewed_year"]').clear();

        cy.contains('[type="submit"]', 'Yes, submit review').should('not.be.disabled').click();

        cy.get('.report-date-details').first().contains('.report-review-status-value', 'Reviewed');
      }
    );
  })
;
