beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient();
});

describe(
  "Add Client page - existing client",
  {tags: ["@supervision", "@client", "@smoke-journey"]},
  () => {
    it("Search for a client that exists and navigate to them", () => {
        cy.get('@client').then(({caseRecNumber, firstname, surname}) => {
          cy.waitForSearchService(caseRecNumber, ["Client"]).then(() => {
            cy.visit("/supervision/#/clients/search-for-client");
            cy.get("main")
              .find('input[placeholder="Search by Order Number, SIRIUS ID or Name"]')
              .clear()
              .type(caseRecNumber);
            cy.get('button[class="button client-search__search-button"]').should("be.visible");
            cy.get('button[class="button client-search__search-button"]').click();

            cy.get('.search-results__term').should('be.visible')

            cy.get('.search-results__list').children().should('have.length', 1)
              .contains(`${firstname} ${surname}`)
              .click();

            cy.get(
              'div[class="client-summary__cell client-summary__cell--value court-reference-value-in-client-summary"]'
            ).should("be.visible", caseRecNumber);
          });
        });
      }
    )
  }
);
