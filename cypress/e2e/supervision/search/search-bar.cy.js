beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createAClient();
  cy.get("@clientId").then((clientId) => cy.createOrderForClient(clientId));
  cy.get("@orderId").then((orderId) => {
    cy.createADeputyAndAssignToExistingOrder(orderId);
  });
});

describe(
  "Search bar",
  {tags: ["@supervision", "@client", "@smoke-journey"]},
  () => {
    it("Search for client", () => {
      cy.visit("/supervision/#/dashboard");
      cy.get('@clientCourtReference').then(courtRef => {
        cy.waitForSearchService(courtRef, ["Client"]).then(() => {
          cy.get(".search-bar__input").clear();
          cy.get(".search-bar__input").type(courtRef);
          cy.get(".search-bar__result-link").contains("Ted Tedson").click();
          cy.get('@clientCourtReference').then((clientCourtRef) => {
            cy.get(
              'div[class="client-summary__cell client-summary__cell--value court-reference-value-in-client-summary"]'
            ).should("be.visible", clientCourtRef);
          })
        })
      })
    });

    it("finds the deputy by surname", () => {
        cy.visit("/supervision/#/dashboard");
        cy.fixture("deputy/minimal.json").then(({firstname, salutation, surname}) => {
          cy.waitForSearchService(surname, ["Deputy"]).then(() => {
            cy.get(".search-bar__input").clear();
            cy.get(".search-bar__input").type(surname);

            cy.get('.search-bar__results').within(() => {
              cy.contains(`${salutation} ${firstname} ${surname} [Deputy]`)
                .click();
            });

            cy.get('.banner__deputy-wrap--name').contains(`${salutation} ${firstname} ${surname}`, {matchCase: false});
          })
        });
      }
    );
  });
