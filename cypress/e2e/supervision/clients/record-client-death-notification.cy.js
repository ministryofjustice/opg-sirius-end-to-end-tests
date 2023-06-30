beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient();
});

describe(
  "Successfully record client death notification",
  { tags: ["@supervision-core", "@client", "@client-record-death-notification", "@smoke-journey"] },
  () => {
    const dateNotified = "16/03/2023";
    const notifiedBy = "Deputy";
    const howNotified = "Email";
    it(
      "Successfully recording client death notification when populating all fields",
      () => {
        cy.get("@client").then(({id}) => {
          cy.visit(`/supervision/#/clients/${id}/record-death`);
        });

        cy.get("#record-death").as("record-death-panel");
        cy.get("@record-death-panel").within(() => {
          cy.get('input[name="dateNotified"]').clear();
          cy.get('input[name="dateNotified"]').type(dateNotified);
          cy.get('[name="notifiedBy"]').select(notifiedBy);
          cy.contains("How was the OPG notified?")
            .closest(".fieldset")
            .contains(howNotified)
            .click();
          cy.waitForTinyMCE()
            .enterText('<p>Client has been notified dead</p>');
        });

        cy.contains("Confirm death notification").click();
        cy.contains("Client death notified").click();
        cy.get('.client-priority-info').contains('Client notified deceased');
        cy.get(".TABS_TIMELINELIST").click();
        cy.get('.event-death-record > .section-content > .wrapper', { timeout: 3000 })
          .should("contain", "Death")
          .should("contain", "The death of the client has been notified")
          .should("contain", "Notified by " + notifiedBy + " on " + dateNotified + " by " + howNotified)
      }
    );
  }
);
