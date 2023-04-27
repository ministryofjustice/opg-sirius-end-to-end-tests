before(() => {
  cy.loginAs("Case Manager");
  cy.createAClient();
});

const searchUntilClientFound = (maxAttempts, attempt = 1) => {
  return cy.then(() => {
    cy.get('@clientCourtReference').then((clientCourtRef) => {
      cy.get(".search-bar__input").clear();
      cy.get(".search-bar__results").should('not.exist');
      cy.get(".search-bar__input").type(clientCourtRef);
      cy.get(".search-bar__results").then((results) => {
        if (results.text().includes("No results could be found") && attempt < maxAttempts) {
          return searchUntilClientFound(maxAttempts, attempt + 1);
        }
        expect(results.text()).to.not.contain("No results could be found");
      });
    })
  });
}

describe(
  "Search for a client",
  { tags: ["@supervision", "@client", "@smoke-journey"] },
  () => {
    it("Searches for client and uses the search dropdown to navigate to them", () => {
      cy.visit("/supervision/#/dashboard");
      searchUntilClientFound(3);
      cy.get(".search-bar__result-link").contains("Ted Tedson").click();
      cy.get('@clientCourtReference').then((clientCourtRef) => {
        cy.get(
          'div[class="client-summary__cell client-summary__cell--value court-reference-value-in-client-summary"]'
        ).should("be.visible", clientCourtRef);
      })
    });
  }
);
