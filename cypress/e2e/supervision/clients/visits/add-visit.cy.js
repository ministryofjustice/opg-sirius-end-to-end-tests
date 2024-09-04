beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withOrder();
});

describe(
  "Add visit",
  { tags: ["@supervision-core", "@visit", "@smoke-journey"] },
  () => {
    it("can add a new visit", () => {
      cy.get("@order").then(({id: orderId}) => {
        cy.get("@client").then(({id: clientId}) => {
          cy.visit(
            `/supervision/#/clients/${clientId}/visits/add?order=${orderId}`
          );
        });
      });
      // cy.get("#add-visit").as("add-visit-panel");
      // cy.get("@add-visit-panel").within(() => {
      //   cy.contains("Visit type")
      //     .closest(".fieldset")
      //     .contains("Supervision")
      //     .click();
      //   cy.contains("Visit subtype")
      //     .closest(".fieldset")
      //     .find("Select")
      //     .select("Pro Visit");
      //   cy.contains("Visit urgency")
      //     .closest(".fieldset")
      //     .contains("Standard")
      //     .click();
      //   cy.contains("Who to visit")
      //     .closest(".fieldset")
      //     .contains("Client")
      //     .click();
      // });
      // cy.contains("Save & exit").click();
      // cy.get('#tab-container').contains('Visits').click();
      // cy.get(".hook-visits-tab .hook-tab-item")
      //   .should("contain.text", "Supervision - Pro Visit - Standard");
      // cy.get('#tab-container').contains('Timeline').click();
      // cy.get(".timeline-event-title", { timeout: 30000 })
      //   .should("contain", "Visit added");
      // cy.get('.changeset-visittype').contains("Supervision");
      // cy.get('.changeset-visitsubtype').contains("Pro Visit");
      // cy.get('.changeset-visiturgency').contains("Standard");

    }
  );
});
