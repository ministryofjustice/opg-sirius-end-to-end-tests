beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createAClient();
});

describe(
  "Successfully record client death notification",
  { tags: ["@supervision-core", "@client", "@client-record-death-confirmation", "@smoke-journey"] },
  () => {
    const dateOfDeath = "16/03/2023";
    const dateDeathCetificateReceived = "16/03/2023";
    const dateNotified = "16/03/2023";
    const notifiedBy = "Deputy";
    const howNotified = "Email";
    const dateOfDeathIncorrect = "Test date";
    it(
      "Records a client's death confirmation successfully when populating all fields",
      () => {
        cy.get("@clientId").then((clientId) => {
          cy.visit(`/supervision/#/clients/${clientId}/record-death`);
        });

        cy.get("#record-death").as("record-death-panel");
        cy.get("@record-death-panel").within(() => {
          cy.contains("Proof of death received")
            .closest(".fieldset")
            .contains("Yes")
            .click();
          cy.get('input[name="dateOfDeath"]').clear().type(dateOfDeath);
          cy.get('input[name="dateDeathCertificateReceived"]').clear().type(dateDeathCetificateReceived);
          cy.get('input[name="dateNotified"]').clear().type(dateNotified);
          cy.get('[name="notifiedBy"]').select(notifiedBy);
          cy.contains("How was the OPG notified?")
            .closest(".fieldset")
            .contains(howNotified)
            .click();
          cy.window()
            .its("tinyMCE")
            .its("activeEditor")
            .its("initialized", {timeout: 2000});
          cy.window().then((win) => {
            const pastedata =
              '<p class="MsoNormal" style="margin: 0cm 0cm 11.25pt; font-size: 12pt; font-family: Calibri, sans-serif; text-align: justify; background: white;"><span style="font-size: 10.5pt; font-family: &quot;Open Sans&quot;, sans-serif;">Gurps</span></p>';
            let editor = win.tinymce.activeEditor;
            editor.dom.createRng();
            editor.execCommand("mceInsertClipboardContent", false, {
              content: pastedata,
            });
          });
        });
        cy.contains("Confirm client is deceased").click();
        cy.contains("The client is deceased").click();
        cy.get('.client-priority-info').contains('Client deceased');
        cy.get(".TABS_TIMELINELIST").click();
        cy.get(".timeline-event-title", { timeout: 30000 })
          .should("contain", "Death")
          .should("contain", "Client status");
        cy.get('p.meta').contains('The death of the client has been confirmed')
        cy.get('.death-record-type').contains('confirmed');
        cy.get('.date-of-death').contains(dateOfDeath);
        cy.get('.date-death-certificate-received').contains(dateDeathCetificateReceived);
        cy.get('.notified-by').contains(notifiedBy);
        cy.get('.date-notified').contains(dateNotified);
        cy.get('.notification-method').contains(howNotified);
        cy.get('.death-record-notes').contains('Gurps');
        cy.get('.client-status-current').contains('Death confirmed');
      }
    );
    it(
      "Displays a validation error when confirming a client's death with an invalid date of death",
      () => {
        cy.get("@clientId").then((clientId) => {
          cy.visit(`/supervision/#/clients/${clientId}/record-death`);
        });
        cy.get("#record-death").as("record-death-panel");
        cy.get("@record-death-panel").within(() => {
          cy.contains("Proof of death received")
            .closest(".fieldset")
            .contains("Yes")
            .click();
          cy.get('input[name="dateOfDeath"]').clear().type(dateOfDeathIncorrect);
          cy.get('input[name="dateDeathCertificateReceived"]').clear().type(dateDeathCetificateReceived);
          cy.get('input[name="dateNotified"]').clear().type(dateNotified);
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
