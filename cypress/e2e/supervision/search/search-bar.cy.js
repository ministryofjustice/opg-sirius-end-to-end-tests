before(() => {
  cy.loginAs("Case Manager");
  cy.createAClient();
  cy.get("@clientId").then((clientId) => cy.createOrderForClient(clientId));
  cy.get("@orderId").then((orderId) => {
    cy.createADeputyAndAssignToExistingOrder(orderId);
  });
});

describe(
  "Search bar",
  {tags: ["@supervision", "@search", "supervision-core"]},
  () => {
    it("finds the deputy by surname", () => {
      cy.visit("/supervision/#/dashboard");
      cy.fixture("deputy/minimal.json").then(({firstname, salutation, surname}) => {
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


