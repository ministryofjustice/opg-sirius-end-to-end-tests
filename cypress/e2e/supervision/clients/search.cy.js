  beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createAClient();
});

  Cypress._.times(40, () => {

describe(
  "Search for a client",
  { tags: ["@supervision", "@client", "@smoke-journey"] },
  () => {

      it("Search for client that does not exist and create a new one", () => {
        cy.visit("/supervision/#/dashboard");
        cy.get('@clientCourtReference').then((clientCourtRef) => {
          cy.get(".search-bar__input").type(clientCourtRef);
        })
        cy.contains('Ted Tedson').click();
        cy.get('@clientCourtReference').then((clientCourtRef) => {
          cy.get(
            'div[class="client-summary__cell client-summary__cell--value court-reference-value-in-client-summary"]'
          ).should("be.visible", clientCourtRef);
        })
      });
    });
  }
);
