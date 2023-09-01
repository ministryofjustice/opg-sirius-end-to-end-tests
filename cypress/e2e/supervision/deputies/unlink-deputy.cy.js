beforeEach(() => {
  cy.loginAs("Case Manager");

  cy.createClient()
    .withOrder()
    .withDeputy()

  cy.createClient({}, "client2")
    .withOrder({}, "order2")
    .withDeputy({}, "deputy2")

  cy.get("@deputy").then(({id: deputyId}) => {
    cy.get("@order2").addDeputy(deputyId)
  })

  cy.get("@order2").then(({id: orderId}) => {
    cy.get("@deputy").withErrorStatusOnCase(orderId)
  })

  cy.get("@client2").then(({id}) => {
    cy.visit(`/supervision/#/clients/${id}`);
  });
});

describe(
  "Unlink a deputy from an order",
  { tags: ["@supervision", "@deputy", "@supervision-core", "@smoke-journey"] },
  () => {
    it("Should remove the deputy from the client's deputy list", () => {
      cy.get(".TABS_DEPUTIES").click();
      cy.get("#deputies-table tr.summary-row").should("have.length", 2)

      cy.get("@deputy").then(({salutation, firstname, surname}) => {
        cy.get("tr.summary-row")
          .filter(':contains("' + salutation + ' ' + firstname + ' ' + surname + '")')
          .find("a.unlink-deputy").click()

        cy.get("unlink-deputy-dialog").contains("Unlink deputy").click()
        cy.reload()
        cy.get("#deputies-table tr.summary-row").should("have.length", 1)
      })
    });
  }
);
