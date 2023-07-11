beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withOrder()
    .withBond();
});

describe(
  "Dispense bond",
  () => {
    it("successfully dispenses a bond on an order", () => {
      cy.get("@client").then(({id: clientId}) => {
        cy.visit(
          `/supervision/#/clients/${clientId}`
        );
      });

      cy.get(".TABS_ORDERS").click();

      // action buttons for orders are not actually clickable until the orders are fully loaded so
      // we need to wait for the notification to disappear
      cy.get("#tab-order-list-in-page-notification").should("contain", "Please wait...");
      cy.get("#tab-order-list-in-page-notification").should("not.contain", "Please wait...");

      cy.get(".edit-bond-button").click();
      cy.contains("button", "Dispense with the bond").click();

      cy.get("dispense-bond-dialog").contains("button", "Dispense with the bond").click();

      const today = new Date();

      cy.get('input[name="bondDispenseDischargedDate_day"]').type(today.getDate().toString());
      cy.get('input[name="bondDispenseDischargedDate_month"]').type((today.getMonth() + 1).toString());
      // future date to display the validation box
      cy.get('input[name="bondDispenseDischargedDate_year"]').type((today.getFullYear() + 1).toString());

      cy.get('[label="Dispensed reason"]').contains("Court instructions").click();

      cy.contains("button", "Save & dispense with the bond").click();

      cy.get(".validation-summary").contains(`cannot be in the future`);

      cy.get('input[name="bondDispenseDischargedDate_year"]').clear()
      cy.get('input[name="bondDispenseDischargedDate_year"]').type(today.getFullYear().toString());

      cy.contains("button", "Save & dispense with the bond").click();

      cy.contains("bond-details-view", "Bond: dispensed");
    });
  }
);
