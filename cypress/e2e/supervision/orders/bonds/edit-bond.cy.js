beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withOrder()
    .withBond();

});

describe(
  "Edit bond",
  {
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
  () => {
    it("Triggering the validation summary when editing a bond in supervision", () => {
      cy.get("@client").then(({ id: clientId }) => {
        cy.visit(
          `/supervision/#/clients/${clientId}`
        );
      });

      cy.get('#tab-container').contains('Orders').click();
      cy.get(".edit-bond-button").click();
      cy.reload()
      cy.get('#requiredBondAmount', { timeout: 60000 }).should('be.visible');
      cy.get('#requiredBondAmount').clear();
      cy.get('#requiredBondAmount').type("999999999999")
      cy.contains("button", "Save & exit").click();
      cy.get(".validation-summary")
        .and("contain.text", "There is a problem")
        .and("contain.text", "Required bond amount - The input is not less than '10000000000'");

      cy.get('#requiredBondAmount').clear();
      cy.get('#requiredBondAmount').type("1000");
      cy.contains("button", "Save & exit").click();
      cy.get('#tab-container').contains('Timeline').click();
      cy.get('.event-bond-edited > .section-content > .wrapper')
        .should("contain", "Bond edited")
        .should("contain", "Bond amount required changed from ");
    });
  }
);



