beforeEach(() => {
  cy.loginAs("Case Manager");
});

describe(
  "Add Client page",
  { tags: ["@supervision", "@client", "@smoke-journey"] },
  () => {
    it("Search for client that does not exist and create a new one", () => {
      cy.visit("/supervision/#/clients/search-for-client");

      cy.get("main")
        .find('input[placeholder="Search by Order Number, SIRIUS ID or Name"]')
        .type("DoNotFindMe");
      cy.get('button[class="button client-search__search-button"]').should("be.visible");
      cy.get('button[class="button client-search__search-button"]').click();
      cy.contains("No results could be found");

      cy.contains("Create a new client").click();

      cy.fixture("client/minimal.json").then((client) => {
        cy.get('input[name="courtReference"]').type(client.caseRecNumber);
        cy.get('input[name="firstName"]').type(client.firstname);
        cy.get('input[name="lastName"]').type(client.surname);

        cy.contains("Save & exit").click();

        cy.get('span[class="title-person-name"]', { timeout: 30000 })
          .should("be.visible")
          .contains(`${client.firstname} ${client.surname}`);
        cy.get(
          'div[class="client-summary__cell client-summary__cell--value court-reference-value-in-client-summary"]'
        ).should("not.have.value", "00000000");
      });
    });

    it("Search for a client that exists and navigate to them", () => {
      cy.createAClient();
      cy.get("@clientCourtReference").then(courtRef => {
        cy.visit("/supervision/#/clients/search-for-client");

        cy.get("main")
          .find('input[placeholder="Search by Order Number, SIRIUS ID or Name"]')
          .type(courtRef);
        cy.get('button[class="button client-search__search-button"]').should("be.visible");
        cy.get('button[class="button client-search__search-button"]').click();

        cy.get('.search-results__list').children().should('have.length', 1)
          .contains('Ted Tedson')
          .click();

        cy.get(
          'div[class="client-summary__cell client-summary__cell--value court-reference-value-in-client-summary"]'
          ).should("be.visible", courtRef);
      })
    });
  }
);
