
Cypress._.times(30, () => {
  describe(
    "Guardianship order",
    { tags: ["@guardianship-order", "@order"] },
    () => {

      before(() => {
        cy.loginAs("Allocations User");
        cy.createClient()
          .withOrder("Guardianship");
        cy.get("@client").then(({id}) => {
          cy.visit("/supervision/#/clients/" + id);
        });
      });

      it("does not show reports and finance tabs for guardianship orders", () => {
        cy.wait(1)
        cy.get(".TABS_ORDERS").click();
        cy.get("#order-table")
          .find("tr")
          .then((rows) => {
            expect(rows.length === 1);
          });
        cy.get(".order-header-details-case-type").contains("PFA");
        cy.get(".order-header-details-case-sub-type").contains("Guardianship");
        cy.get(".TABS_REPORTS").should('not.be.visible');
        cy.get(".TABS_FINANCEINFO").should('not.be.visible');
      });
    }
  );
});
