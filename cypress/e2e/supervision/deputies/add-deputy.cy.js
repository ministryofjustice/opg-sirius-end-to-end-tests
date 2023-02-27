beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createAClient();
  cy.get("@clientId").then((clientId) => cy.createOrderForClient(clientId));
  cy.get("@clientId").then((clientId) => {
    cy.visit(`/supervision/#/clients/${clientId}`);
  });
});

describe(
  "Create deputy for client",
  { tags: ["@supervision", "@deputy", "supervision-core"] },
  () => {
    it("Given I'm a Case Manager on Supervision, I can add a deputy to a clients order using only mandatory fields", () => {
      cy.get("@clientId").then((clientId) => {
        cy.get('.TABS_ORDERS').click();
        cy.get('#add-deputy-button').click();
        cy.url().should('include',"/deputies/add");
        // type in name to search field
        cy.get('.deputy-search__input').type("deputy");
        cy.get('.deputy-search__form > .button').click();
        cy.get('.footer > :nth-child(1) > .button').click();
        cy.get(':nth-child(1) > .radio-button').click();
        cy.get('.deputy-details-form-firstname > .fieldset > .ng-untouched').type("Patrick");
        cy.get('.deputy-details-form-surname > .fieldset > .ng-untouched').type("Star");
        cy.get('.footer > :nth-child(1) > .button').click();
        cy.waitForStableDOM();
        cy.get('.footer > .dotted-link').click();

        cy.get('.TABS_DEPUTIES').click();
        cy.get('tr.summary-row > :nth-child(1) > .dotted-link').click();
        cy.get('.person-name').should('contain.text', "Patrick Star");
        cy.get('.summary-row.open > :nth-child(1)').should('contain.text', "Patrick Star");
        cy.get('.deputy-details-type').should('contain.text', "Lay");
        cy.get('.deputy-relation-type').should('contain.text', "Lay");
      });
    });
  }
);
