beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createAClient();
  cy.get("@clientId").then((clientId) => {
    cy.addVisitForClient(clientId)
  });
});

describe(
  "Edit client visit",
  { tags: ["@supervision", "client", "@smoke-journey", "supervision-notes"] },
  () => {
    it("Given I'm a Case Manager on Supervision, I edit an existing visit", () => {
      cy.get("@clientId").then((clientId) => {
          cy.visit(`/supervision/#/clients/${clientId}`)
        }
      );

      cy.get(".TABS_VISITS button").click();

      cy.contains("Supervision - Pro Visit - Standard");
      cy.get("#actions-column-action-buttons").click();

      cy.contains("EDIT VISIT");
      cy.get("input[data-core-value='VPT-CLIENT']").click();
      cy.get("button[type='submit']").click();

      cy.get("visit-list-item-view").then(() => {
        cy.contains("Who to visit: Client")
      });
    }
  );
});
