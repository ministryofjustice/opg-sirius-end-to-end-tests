beforeEach(() => {
  cy.loginAs("System Admin");
  cy.createClient()
    .withOrder()
    .withDeputy()

  cy.get("@order").then(({id: orderId}) => {
    cy.get("@order")
      .withDeputy()
      .withErrorStatusOnCase(orderId)
  })

  cy.get("@client").then(({id}) => {
    cy.visit(`/supervision/#/clients/${id}`);
  });
});

describe(
  "Delete a deputy",
  { tags: ["@supervision", "@deputy", "@supervision-core", "@smoke-journey"] },
  () => {
    it("Should remove the deputy from the client's deputy list", () => {
      cy.get(".TABS_DEPUTIES").click();
      cy.get("#deputies-table tr.summary-row").should("have.length", 2)
      cy.get("tr.summary-row .deputy-status-on-case").contains("Error")
        .parent(".summary-row").find("a.deputy-record").click()
      cy.get("#delete-deputy-button").click()
      cy.get("delete-deputy-dialog button").contains("Delete Deputy").click()
      cy.url().should("not.contain", "deputy-hub")
      cy.get("@client").then(({id}) => {
        cy.visit(`/supervision/#/clients/${id}`);
        cy.get(".TABS_DEPUTIES").click();
        cy.get("#deputies-table tr.summary-row").should("have.length", 1)
      });
    });
  }
);
