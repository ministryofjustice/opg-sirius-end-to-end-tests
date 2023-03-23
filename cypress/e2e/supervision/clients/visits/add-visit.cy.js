beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createAClient();
  cy.get("@clientId").then((clientId) => cy.createOrderForClient(clientId));
});

describe(
  "Add visit",
  { tags: ["@supervision-core", "@visit", "@smoke-journey"] },
  () => {
    it("can add a new visit", () => {
      cy.get("@orderId").then((orderId) => {
        cy.get("@clientId").then((clientId) => {
          cy.visit(
            `/supervision/#/clients/${clientId}/visits/add?order=${orderId}`
          );
        });
      });
      cy.get("#add-visit").as("add-visit-panel");
      cy.get("@add-visit-panel").within(() => {
        cy.contains("Visit type")
          .closest(".fieldset")
          .contains("Supervision")
          .click();
        cy.contains("Visit subtype")
          .closest(".fieldset")
          .find("Select")
          .select("Pro Visit");
        cy.contains("Visit urgency")
          .closest(".fieldset")
          .contains("Standard")
          .click();
      });
      cy.contains("Save & exit").click();
      cy.get(".TABS_VISITS button").click();
      cy.contains("Supervision - Pro Visit - Standard");
      cy.get(".TABS_TIMELINELIST").click();
      cy.get(".timeline-event-title", { timeout: 30000 })
        .should("contain", "Visit added");
      cy.get('.changeset-visittype').contains("Supervision");
      cy.get('.changeset-visitsubtype').contains("Pro Visit");
      cy.get('.changeset-visiturgency').contains("Standard")

    }
  );
});
