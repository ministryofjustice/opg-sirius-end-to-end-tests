// beforeEach(() => {
//   cy.loginAs("Case Manager");
//   cy.createClient()
//     .withOrder()
//     .withBond();
// });
//
// describe(
//   "Dispense bond",
//   () => {
//     it("successfully dispenses a bond on an order", {
//       retries: {
//         runMode: 2,
//         openMode: 0,
//       },
//     }, () => {
//       cy.get("@client").then(({ id: clientId }) => {
//         cy.visit(
//           `/supervision/#/clients/${clientId}`
//         );
//       });
//
//       cy.get('#tab-container').contains('Orders').click();
//
//     cy.get(".edit-bond-button").click();
//     cy.contains("button", "Dispense with the bond").click();
//
//       cy.get("dispense-bond-dialog").contains("button", "Dispense with the bond").click();
//
//       const today = new Date();
//
//       cy.get('input[name="bondDispenseDischargedDate_day"]').type(1);
//       cy.get('input[name="bondDispenseDischargedDate_month"]').type((today.getMonth() + 1).toString());
//       // future date to display the validation box
//       cy.get('input[name="bondDispenseDischargedDate_year"]').type((today.getFullYear() + 1).toString());
//
//       cy.get('.fieldset > fieldset').contains("Court instructions").click();
//
//       cy.contains("button", "Save & dispense with the bond").click();
//
//       cy.get(".validation-summary").contains(`cannot be in the future`);
//
//       cy.get('input[name="bondDispenseDischargedDate_year"]').clear()
//       cy.get('input[name="bondDispenseDischargedDate_year"]').type(today.getFullYear().toString());
//
//       cy.contains("button", "Save & dispense with the bond").click();
//
//       cy.contains("bond-details-view", "Bond: dispensed");
//     });
//   }
// );
