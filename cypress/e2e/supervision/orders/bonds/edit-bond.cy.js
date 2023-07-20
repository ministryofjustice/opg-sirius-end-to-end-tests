beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withOrder()
    .withBond();

});

describe(
  "Edit bond",
  () => {
    it("Triggering the validation summary when editing a bond in supervision", () => {
      cy.get("@client").then(({id: clientId}) => {
        cy.visit(
          `/supervision/#/clients/${clientId}`
        );
      });

      cy.get(".TABS_ORDERS").click();
      cy.get("#tab-order-list-in-page-notification").should("contain", "Please wait...");
      cy.get("#tab-order-list-in-page-notification").should("not.contain", "Please wait...");
      cy.get(".edit-bond-button").click();

      cy.get('#requiredBondAmount').clear();
      cy.get('#requiredBondAmount').type("999999999999")
      cy.contains("button", "Save & exit").click();
      cy.get(".validation-summary")
        .and("contain.text", "There is a problem")
        .and("contain.text", "Required bond amount - The input is not less than '10000000000'");

      cy.get('#requiredBondAmount').clear();
      cy.get('#requiredBondAmount').type("1000");
      cy.contains("button", "Save & exit").click();
      cy.get('.TABS_TIMELINELIST').click();
      cy.get('.event-bond-edited > .section-content > .wrapper')
        .should("contain", "Bond edited")
        .should("contain", "Bond amount required changed from ");
    });
  }
);