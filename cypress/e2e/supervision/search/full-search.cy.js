before(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withOrder();

  cy.get("@orderId").then((orderId) => {
    cy.createADeputyAndAssignToExistingOrder(orderId);
  });
});

describe(
  "Full search",
  {tags: ["@supervision", "@search", "supervision-core"]},
  () => {
    it("finds the order by court reference and can filter full search results by client and deputy", () => {
      cy.visit("/supervision/#/dashboard");
      cy.get('@client').then(({caseRecNumber}) => {
        cy.get(".search-bar__input").type(caseRecNumber);
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


