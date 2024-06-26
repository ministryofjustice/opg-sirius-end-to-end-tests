before(function setupClient() {
  cy.loginAs("Allocations User");
  cy.createClient();
  cy.loginAs("Finance Reporting User");
  cy.get("@client").then(({caseRecNumber}) => {
    cy.assignSOPNumberToClient(caseRecNumber)
  });
  cy.loginAs("Finance Manager");
});

beforeEach(function navigateToClient() {
  cy.get("@client").then(({id}) => {
    cy.visit(`/supervision/#/clients/${id}`);
  });
});

describe(
  "Given I'm a Finance Manager on Supervision updating finance personal details" +
  "Then the finance personal details are updated as expected",
  { tags: ["@supervision", "@supervision-regression", "@finance", "@finance-tab"] },
  () => {
    it(
      "Finance person details can be updated",
      () => {
        cy.get('#tab-container').contains('Finance').click();
        cy.get(".finance-summary-payment-method").contains("Demanded");

        cy.get("@sopNumber").then((sopNumber) => {
          cy.get(".finance-summary-finance-billing-reference").contains(sopNumber);
        });

        cy.get("@client").then(({id}) => {
          cy.visit(`/supervision/#/clients/${id}/finance/edit`);
        });

        cy.contains(".title.section-title", "Edit Finance Person");

        let newSopNumber = Date.now().toString() + '0';
        cy.get("label:contains('SOP Number') + input").clear();
        cy.get("label:contains('SOP Number') + input").type(newSopNumber);
        cy.contains("Direct Debit").click();

        cy.contains("Save & exit").click().then(() => {
          cy.get('.finance-summary-payment-method', { timeout: 30000 })
            .should("contain", "Direct Debit");
          cy.get('.finance-summary-finance-billing-reference', { timeout: 30000 })
            .should("contain", newSopNumber);

          cy.get('#tab-container').contains('Timeline').click();

          cy.get(".timeline-event-title", { timeout: 30000 })
            .should("contain", "Finance personal details updated");
        });
      }
    );
  }
);
