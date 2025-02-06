beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient();
});

  describe(
    "Successfully record client death confirmation",
    { tags: ["@supervision-core", "@client", "@client-record-death-confirmation", "@smoke-journey"] },
    () => {
      const dateOfDeath = "16/03/2023";
      const dateDeathCetificateReceived = "16/03/2023";
      const dateNotified = "16/03/2023";
      const notifiedBy = "Deputy";
      const howNotified = "Email";
      const dateOfDeathIncorrect = "Test date";

      Cypress._.times(25, () => {

        it(
        "Records a client's death confirmation successfully when populating all fields",
          {
            retries: {
              runMode: 2,
              openMode: 0,
            },
          }, () => {
          cy.get("@client").then(({ id }) => {
            cy.visit(`/supervision/#/clients/${id}/record-death`);
          });
          cy.get('.TABS_DOCUMENTS').click();
          cy.waitForStableDOM();
          cy.get("#record-death").as("record-death-panel");
          cy.get("@record-death-panel").within(() => {
            cy.contains("Proof of death received")
              .closest(".fieldset")
              .contains("Yes")
              .click();
            cy.get('input[name="dateOfDeath"]').type(dateOfDeath);
            cy.get('input[name="dateDeathCertificateReceived"]').type(dateDeathCetificateReceived);
            cy.get('input[name="dateNotified"]').type(dateNotified);
            cy.get('[name="notifiedBy"]').select(notifiedBy);
            cy.contains("How was the OPG notified?")
              .closest(".fieldset")
              .contains(howNotified)
              .click();
            cy.waitForTinyMCE()
              .enterText('<p>Gurps</p>');
          });

          cy.contains("Confirm client is deceased").click();
          cy.contains("The client is deceased").click();
          cy.get('.client-priority-info').contains('Client deceased');
          cy.get('#tab-container').contains('Timeline').click();
          cy.get(".timeline-event-title", { timeout: 3000 })
            .should("contain", "Death")
            .should("contain", "Client status");
          cy.get('.event-death-record > .section-content > .wrapper')
            .should("contain", "The death of the client has been confirmed")
            .should("contain", "Date of death " + dateOfDeath)
            .should("contain", "Certificate received " + dateDeathCetificateReceived)
            .should("contain", "Notified by " + notifiedBy + " on " + dateNotified + " by " + howNotified)
          cy.get('.client-status-current').contains('Death confirmed');
        }
      );
    });
      it(
        "Displays a validation error when confirming a client's death with an invalid date of death",
        () => {
          cy.get("@client").then(({ id }) => {
            cy.visit(`/supervision/#/clients/${id}/record-death`);
          });
          cy.get("#record-death").as("record-death-panel");
          cy.waitForStableDOM();
          cy.get("@record-death-panel").within(() => {
            cy.contains("Proof of death received")
              .closest(".fieldset")
              .contains("Yes")
              .click();
            cy.get('input[name="dateOfDeath"]').clear();
            cy.get('input[name="dateOfDeath"]').type(dateOfDeathIncorrect);
            cy.get('input[name="dateDeathCertificateReceived"]').clear();
            cy.get('input[name="dateDeathCertificateReceived"]').type(dateDeathCetificateReceived);
            cy.get('input[name="dateNotified"]').clear();
            cy.get('input[name="dateNotified"]').type(dateNotified);
            cy.get('[name="notifiedBy"]').select(notifiedBy);
            cy.contains("How was the OPG notified?")
              .closest(".fieldset")
              .contains(howNotified)
              .click();
          });
          cy.contains("Confirm client is deceased").click();
          cy.contains("The client is deceased").click();
          cy.get('.validation-summary').contains('Date of death - This must be a real date');
        }
      );
    }
  );
