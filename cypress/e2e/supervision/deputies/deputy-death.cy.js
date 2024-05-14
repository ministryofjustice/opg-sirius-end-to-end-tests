describe(
  "Deputy Death Notification & Confirmation",
  { tags: ["@supervision", "@deputy", "@supervision-core", "@deputy-hub", "@deputy-record-death-notification", "@deputy-record-death-confirmation"] },
  () => {
    beforeEach(() => {
      cy.loginAs("Case Manager");
      cy.createClient()
        .withOrder()
        .withDeputy()

      cy.get("@client").then(({ id }) => {
        cy.visit(`/supervision/#/clients/${id}`);
      });
    });

      it("records a death notification for a deputy and confirms it", () => {
        cy.get('#tab-container').contains('Deputies').click();
        cy.reload()
        cy.get("#deputies-table").contains("Deputy record").should("be.visible");
        cy.get("#deputies-table").contains("Deputy record").click();
        cy.get(".actions-menu").contains("Record death").should("be.enabled").click();

        let today = new Date().toLocaleString("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" });

        cy.contains("button", "Confirm death notification").as("confirm-button").should("be.disabled");
        cy.get('input[name="dateNotified"]').type(today);
        cy.get('select[name="notifiedBy"]').select(1);
        cy.get('radio-button[name="notificationMethod"]').contains("Email").click();

        cy.get("@confirm-button").should("be.enabled").click();
        cy.contains(".hook-modal-confirm", "Deputy death notified").click();

        cy.contains('.banner', "Deputy's Death Notified");

        cy.get('#tab-container').contains('Timeline').click();
        cy.contains(".timeline-event-title", "Death", { timeout: 30000 })
          .parents(".wrapper")
          .within(() => {
            cy.contains("The death of the deputy has been notified");
            cy.contains(`Notified by Deputy on ${today} by Email`);
          });
        cy.get(".timeline-event-title")
          .contains("Order details")
          .parents(".wrapper")
          .within(() => {
            cy.contains("Status on case changed from Open to Deceased");
          });

        cy.get(".actions-menu").contains("Confirm death").should("be.enabled").click();
        cy.get('radio-button[name="proofOfDeathReceived"]').contains("Yes").click();
        cy.get('input[name="dateOfDeath"]').type(today);
        cy.get('input[name="dateDeathCertificateReceived"]').type(today);

        cy.contains("button", "Confirm deputy is deceased").should("be.enabled").click();
        cy.contains(".hook-modal-confirm", "The deputy is deceased").click();

        cy.contains('.banner', "Deputy is Deceased");

        cy.get('#tab-container').contains('Timeline').click();
        cy.contains(".timeline-event-title", "Death", { timeout: 30000 })
          .parents(".wrapper")
          .within(() => {
            cy.contains("The death of the deputy has been confirmed");
            cy.contains(`Notified by Deputy on ${today} by Email`);
            cy.contains(`Date of death ${today}`);
            cy.contains(`Certificate received ${today}`);
            cy.contains(`Notified by Deputy on ${today} by Email`);
          });
      });
    }
  );
