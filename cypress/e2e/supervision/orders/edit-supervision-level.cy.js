beforeEach(() => {
  cy.loginAs("Allocations User");
  cy.createClient()
    .withOrder()
});

describe(
  "Edit order supervision level",
  {tags: ["@supervision-core", "@order", "@smoke-journey"]},
  () => {
    it("creates a timeline event when supervision level is changed", () => {
      cy.get("@order").then(({id: orderId}) => {
        cy.get("@client").then(({id: clientId}) => {
          cy.visit(
            `/supervision/#/clients/${clientId}?order=${orderId}`
          );
        });
      });
      cy.get(".TABS_ORDERS").click();

      cy.get(".edit-supervision-level")
        .should("contain.text", "Edit supervision level")
        .click()
      cy.get("#set-supervision-level .section-title")
        .should("be.visible")
        .and("contain.text", "Set supervision level")
      cy.get("#supervisionLevel label:contains('Minimal')").click()
      cy.get("#assetLevel label:contains('Unknown')").click()
      cy.get("button:contains('Save & exit')").click()

      cy.get(".edit-supervision-level")
        .should("contain.text", "Edit supervision level")
        .click()
      cy.get("#set-supervision-level button.title-edit:contains('Change')").click()
      cy.get("#set-supervision-level .section-title")
        .should("be.visible")
        .and("contain.text", "Changing supervision level")
      cy.get("#supervisionLevel label:contains('General')").click()
      cy.get("#supervision-level-applies-from-date input").type("02/08/2023")
      cy.waitForTinyMCE()
        .enterText("<p>I'm a note</p>");
      cy.get("button:contains('Save & exit')").click()

      cy.get(".TABS_TIMELINELIST").click();
      cy.get("timeline-template-loader:nth-of-type(1) .timeline-event-title")
        .should("contain.text", "Supervision level")

      cy.get("timeline-template-loader:nth-of-type(1)")
        .should("exist")
        .within(() => {
          cy.get(".timeline-event-title").should("contain.text", "Supervision level")
          cy.contains("Supervision level set to General")
          cy.contains("Assets are Unknown")
          cy.contains("Date applies from 02/08/2023")
          cy.contains("I'm a note")
        })

      cy.get("timeline-template-loader:nth-of-type(2)")
        .within(() => {
          cy.get(".timeline-event-title").should("contain.text", "Supervision level")
          cy.contains("Supervision level set to Minimal")
          cy.contains("Assets are Unknown")
        })
    });
  }
);
