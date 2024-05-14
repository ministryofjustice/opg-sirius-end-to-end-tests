beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withOrder();
});

describe(
  "Add bond",
  () => {
    it("Add a bond in supervision", () => {
      cy.get("@client").then(({id: clientId}) => {
        cy.visit(
          `/supervision/#/clients/${clientId}`
        );
      });

      cy.get('#tab-container').contains('Orders').click();
      cy.get('.add-bond-button').click();
      cy.get('#securityBond').contains('Yes').click()

      cy.get('#requiredBondAmount').type("1000");
      cy.get('#bondAmountTaken').type("200");
      cy.get("#bondProviderId").select("1");
      cy.get('[label="Reference number"]').type("12345");

      cy.contains("button", "Save & exit").click();
      cy.get('#tab-container').contains('Timeline').click();
      cy.get('.event-bond-added > .section-content > .wrapper')
        .should("contain", "Bond added")
        .should("contain", "Bond amount required set to ")
        .should("contain", "Bond amount taken ")
        .should("contain", "Bond provider set to ")
        .should("contain", "Bond reference number set to ");
    });
  }
);
