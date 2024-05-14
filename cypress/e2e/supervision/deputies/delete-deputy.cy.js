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
    it("Should remove the deputy from the client's deputy list and deputy search", () => {
      cy.get('#tab-container').contains('Deputies').click();
      cy.get("#deputies-table tr.summary-row").should("have.length", 2)

      cy.get("@deputy").then(({salutation, firstname, surname}) => {
        cy.get("tr.summary-row")
          .filter(':contains("' + salutation + ' ' + firstname + ' ' + surname + '")')
          .find("a.deputy-record").click()

        cy.get("#delete-deputy-button").click()
        cy.get("delete-deputy-dialog button").contains("Delete Deputy").click()
        cy.url().should("not.contain", "deputy-hub")

        cy.get("@client").then(({id}) => {
          cy.visit(`/supervision/#/clients/${id}`);
          cy.get('#tab-container').contains('Deputies').click();
          cy.get("#deputies-table tr.summary-row").should("have.length", 1)

          cy.get('#add-deputy-button').should("be.visible").click();
          cy.get(".deputy-search__input").type(firstname + " " + surname);
          cy.get(".deputy-search__form > .button").click();
          cy.get(".deputy-search__found").should("be.visible")
            .and("contain.text", "No results could be found")
        });
      })
    });
  }
);
