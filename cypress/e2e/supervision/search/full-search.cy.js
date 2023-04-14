before(() => {
  cy.loginAs("Case Manager");
  cy.createAClient();
  cy.get("@clientId").then((clientId) => cy.createOrderForClient(clientId));
  cy.get("@orderId").then((orderId) => {
    cy.createADeputyAndAssignToExistingOrder(orderId);
  });
});

describe(
  "Checking deputy can be found by case number filtering",
  {tags: ["@supervision", "@search", "supervision-core"]},
  () => {
    it("Given I'm a Case Manager on Supervision and a client has been created, with a deputy on the order I can search for both", () => {
      cy.visit("/supervision/#/dashboard");
      cy.get('@courtReference').then((orderId) => {
        cy.get(".search-bar__input").type(orderId);
      })
      cy.get('.search-bar__show-all').should('contain.text', 'Show All')
      cy.get('.search-bar__show-all').click()
      cy.get(':nth-child(1) > .search-filters__label > .search-filters__label-text').should('contain.text', 'Client (1)')
      cy.get(':nth-child(2) > .search-filters__label > .search-filters__label-text').should('contain.text', 'Deputy (1)')
      cy.get(':nth-child(3) > .search-filters__label > .search-filters__label-text').should('contain.text', 'Donor (0)')
      cy.get(':nth-child(1) > .search-filters__label > .search-filters__input').click()
      cy.get('.search-results__result > :nth-child(1) > :nth-child(1)').should('contain.text', '[Client]')
      cy.get(':nth-child(1) > .search-filters__label > .search-filters__input').click()
      cy.get(':nth-child(2) > .search-filters__label > .search-filters__input').click()
      cy.get('.search-results__result > :nth-child(1) > .search-results__detail').should('contain.text', '[Deputy]')
    });
  }
);


