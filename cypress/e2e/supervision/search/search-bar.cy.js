before(() => {
  cy.loginAs("Case Manager");
  cy.createAClient();
  cy.get("@clientId").then((clientId) => cy.createOrderForClient(clientId));
  cy.get("@orderId").then((orderId) => {
    cy.createADeputyAndAssignToExistingOrder(orderId);
  });
});

const searchUntilFound = (searchTerm, remaining = 3) => {
  return cy.then(() => {
    cy.get(".search-bar__input").clear();
    cy.get(".search-bar__results").should('not.exist');
    cy.get(".search-bar__input").type(searchTerm);
    cy.get(".search-bar__results").then((results) => {
      if (results.text().includes("No results could be found") && remaining > 0) {
        return searchUntilFound(searchTerm, remaining--);
      }
      expect(results.text()).to.not.contain("No results could be found");
    });

    describe(
      "Search bar",
      {tags: ["@supervision", "@client", "@smoke-journey"]},
      () => {
        it("Search for client", () => {
          cy.visit("/supervision/#/dashboard");
          cy.get('@clientCourtReference').then(courtRef => {
            searchUntilFound(courtRef);
          })
          cy.get(".search-bar__result-link").contains("Ted Tedson").click();
          cy.get('@clientCourtReference').then((clientCourtRef) => {
            cy.get(
              'div[class="client-summary__cell client-summary__cell--value court-reference-value-in-client-summary"]'
            ).should("be.visible", clientCourtRef);
          })
        });

        it("finds the deputy by surname", () => {
            cy.visit("/supervision/#/dashboard");
            cy.fixture("deputy/minimal.json").then(({firstname, salutation, surname}) => {
              searchUntilFound(surname);

              cy.get('.search-bar__results').within(() => {
                cy.contains(`${salutation} ${firstname} ${surname} [Deputy]`)
                  .click();
              });

              cy.get('.banner__deputy-wrap--name').contains(`${salutation} ${firstname} ${surname}`, {matchCase: false});
            })
          }
        );
      })
  })
}
