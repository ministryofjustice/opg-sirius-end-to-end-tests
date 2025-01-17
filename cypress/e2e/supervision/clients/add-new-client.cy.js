import randomText from "../../../support/random-text";

beforeEach(() => {
  cy.loginAs("Case Manager");
});

describe(
  "Add Client page",
  {tags: ["@supervision", "@client", "@smoke-journey"]},
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

      const firsName = randomText();
      const surname = randomText();
      cy.get('input[name="courtReference"]').type("00000000");
      cy.get('input[name="firstName"]').type(firsName);
      cy.get('input[name="lastName"]').type(surname);
      cy.get('input[name="addressLine1"]').type("1 A Street");
      cy.get('input[name="town"]').type("Townsville");
      cy.get('input[name="postcode"]').type("PS1 2CD");

      cy.contains("Save & exit").click();

      cy.get('span[class="title-person-name"]', {timeout: 30000})
        .should("be.visible")
        .contains(`${firsName} ${surname}`);
      cy.get(
        'div[class="client-summary__cell client-summary__cell--value court-reference-value-in-client-summary"]'
      ).should("not.have.value", "00000000");
    });
  }
);
