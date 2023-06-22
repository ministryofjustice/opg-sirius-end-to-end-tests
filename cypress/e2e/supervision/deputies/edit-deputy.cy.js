import randomText from "../../../support/random-text";

beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withOrder()
    .withDeputy()

  cy.get("@client").then(({id}) => {
    cy.visit(`/supervision/#/clients/${id}`);
  });
});

describe(
  "Edit deputy for client",
  { tags: ["@supervision", "@deputy", "supervision-core", "@smoke-journey"] },
  () => {
    it("Editing deputy details via the deputy hub", () => {
      cy.get(".TABS_DEPUTIES").click();
      cy.get("#deputies-table").contains("Deputy record").should("be.visible").click();
      cy.get('#edit-deputy-button').click();
      cy.get('#deputy-hub-view-deputy-edit-deputy-details').click();
      cy.get('[label="Date of birth"]').type("25");
      cy.get('.footer > :nth-child(1) > .button').click()
      cy.get('.validation-summary').should("be.visible")
        .and("contain.text", "There is a problem")
        .and("contain.text", "Date of birth - This must be a real date")
        .and("contain.text", "Date of birth - This must be on or after 01/01/1880");
      cy.get('.fieldset > .ng-dirty').clear();
      cy.get('[label="Date of birth"]').type("25/02/2000");
      cy.get('.footer > :nth-child(1) > .button').click()
      cy.get('.in-page-banner').contains('has been updated');
      cy.get('.deputy-details-date-of-birth').contains("25/02/2000");
    });
  }
);
