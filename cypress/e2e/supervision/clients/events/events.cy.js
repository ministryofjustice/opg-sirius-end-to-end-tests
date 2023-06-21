beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient();
  cy.get("@client").then(({id}) => {
    cy.visit(`/supervision/#/clients/${id}`);
  });
});

describe(
  "Events",
  {
    tags: ["@supervision-core", "@client-risk", "@smoke-journey"],
  },
  () => {
    it("Successfully create a client event in Supervision", () => {
      cy.get('#create-event-button').click();
      cy.get('*[id^="FIELDLABELSN_"]').first().select(1);
      cy.get('.footer > :nth-child(1) > .button').click();
      cy.get('.TABS_TIMELINELIST').click();
      cy.get('.event-note > .section-content > .wrapper')
        .should("contain", "event has been recorded")
        .should("contain", "Event date");
    });

    it("Error create a client event in Supervision", () => {
      cy.get('#create-event-button').click();
      cy.get('*[id^="FIELDLABELSN_"]').first().select(1);
      cy.get('.fieldset > .ng-untouched').type("A".repeat(256));
      cy.get('.footer > :nth-child(1) > .button').click();
      cy.get('.validation-summary').contains("Subject - The input is more than 255 characters long");
    });
  }
);
