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
  "Deputy Death Notification & Confirmation",
  { tags: ["@supervision", "@deputy", "@supervision-core", "@deputy-hub", "@deputy-record-death-notification", "@deputy-record-death-confirmation"] },
  () => {
    it("records a death notification for a deputy and confirms it", () => {
      cy.get(".TABS_DEPUTIES").click();
      cy.get("#deputies-table").contains("Deputy record").should("be.visible").click();
      cy.get(".actions-menu").contains("Record death").should("be.enabled").click();

      let today = new Date().toLocaleString([], {day: "2-digit", month: "2-digit", year: "numeric"});

      cy.contains("button", "Confirm death notification").as("confirm-button").should("be.disabled");
      cy.get('input[name="dateNotified"]').type(today);
      cy.get('select[name="notifiedBy"]').select(1);
      cy.get('radio-button[name="notificationMethod"]').contains("Email").click();
      cy.get("@confirm-button").should("be.enabled").click();
      cy.contains(".hook-modal-confirm", "Deputy death notified").click();

      cy.contains('.banner', "Deputy's Death Notified");

      cy.get(".actions-menu").contains("Confirm death").should("be.enabled").click();
      cy.get('radio-button[name="proofOfDeathReceived"]').contains("Yes").click();
      cy.get('input[name="dateOfDeath"]').type(today);
      cy.get('input[name="dateDeathCertificateReceived"]').type(today);

      cy.contains("button", "Confirm deputy is deceased").should("be.enabled").click();
      cy.contains(".hook-modal-confirm", "The deputy is deceased").click();

      cy.contains('.banner', "Deputy is Deceased");
    });
  }
);
