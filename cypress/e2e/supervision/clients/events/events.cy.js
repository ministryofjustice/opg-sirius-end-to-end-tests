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
      cy.get('.footer .button').click();
      cy.get('#tab-container').contains('Timeline').click();
      cy.get('.event-note > .section-content > .wrapper')
        .should("contain", "event has been recorded")
        .should("contain", "Event date");
    });
  }
);
