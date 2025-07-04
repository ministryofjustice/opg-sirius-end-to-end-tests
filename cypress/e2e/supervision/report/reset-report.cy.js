beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withOrder()
    .withSupervisionLevel()
  cy.get("@order").then(({id: orderId}) => {
    cy.createADeputyAndAssignToExistingOrder(orderId)
    cy.makeOrderActive(orderId)
    cy.get("@client").then(({id: clientId}) => {
      cy.lodgeReport(clientId)
        .then(() => {
          cy.visit(
            `/supervision/#/clients/${clientId}?order=${orderId}`
          );
        });
    });
  });
  cy.get('#tab-container').contains('Reports').click();
});

describe(
  "Reset report",
  {tags: ["@supervision", "@reports", "@reset-report"]},
  () => {
    it("Successfully reset a report", () => {
        cy.get('.report-summary-container').first().contains('.report-status', 'received',  { matchCase: false});

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

        cy.get('.lodge-report-button').first().click();

        cy.get('#dateReportReceived_day').should('be.empty');
        cy.get('#dateReportReceived_month').should('be.empty');
        cy.get('#dateReportReceived_year').should('be.empty');
      }
    );
  });
