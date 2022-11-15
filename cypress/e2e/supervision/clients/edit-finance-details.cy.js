before(function setupClient() {
  cy.loginAs("Allocations User");
  cy.createAClient();
  cy.loginAs("Finance Reporting User");
  cy.get("@clientCourtReference").then((clientCourtReference) => {
    cy.assignSOPNumberToClient(clientCourtReference)
  });
  cy.loginAs("Finance Manager");
});

beforeEach(function navigateToClient() {
  cy.get("@clientId").then((clientId) => {
    cy.visit(`/supervision/#/clients/${clientId}`);
  });
});

describe(
  "Given I'm a Finance Manager on Supervision updating finance personal details" +
  "Then the finance personal details are updated as expected",
  { tags: ["@supervision", "@supervision-regression", "@finance"] },
  () => {
    it(
      "Finance person details can be updated",
      () => {
        cy.get(".TABS_FINANCEINFO").click();
        cy.get(".finance-summary-payment-method").contains("Demanded");

        cy.get("@sopNumber").then((sopNumber) => {
          cy.get(".finance-summary-finance-billing-reference").contains(sopNumber);
        });

        cy.get("@clientId").then((clientId) => {
          cy.visit(`/supervision/#/clients/${clientId}/finance/edit`);
        });

        cy.contains(".title.section-title", "Edit Finance Person");

        let newSopNumber = Date.now().toString() + '0';
        cy.get('input[name="financeBillingReference"]').clear().type(newSopNumber);
        cy.contains("Direct Debit").click();

        cy.contains("Save & exit").click().then(() => {
          cy.get('.finance-summary-payment-method', { timeout: 30000 })
            .should("contain", "Direct Debit");
          cy.get('.finance-summary-finance-billing-reference', { timeout: 30000 })
            .should("contain", newSopNumber);

          cy.get(".TABS_TIMELINELIST").click();

          cy.get(".timeline-event-title", { timeout: 30000 })
            .should("contain", "Finance personal details updated");
        });
      }
    );
  }
);
