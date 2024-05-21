beforeEach(() => {
  cy.loginAs("Allocations User");
  cy.createClient()
    .withOrder()
});

Cypress._.times(10, () => {

  describe(
    "Edit order details successfully and timeline is created",
    { tags: ["@supervision-core", "@order", "@smoke-journey"] },
    () => {
      it("creates a supervised h&w order and edit the details", () => {
        cy.get("@order").then(({ id: orderId }) => {
          cy.get("@client").then(({ id: clientId }) => {
            cy.visit(
              `/supervision/#/clients/${clientId}/orders/${orderId}`
            );
          });
        });
        cy.get('#tab-container').contains('Orders').click();
        cy.get('#begin-change-order-button > span').click();
        cy.contains("button", "Yes, edit order").should("be.enabled").click();
        cy.get('[label="Order title"] > .fieldset > .ng-untouched').type('This is an order title');
        cy.contains('Sole').click();
        const data = '<p>Order notes etc....</p>';
        cy.waitForTinyMCE()
          .enterText(data);
        cy.get('[type="submit"]').click();
        cy.get('#tab-container').contains('Timeline').click();
        cy.get(".timeline-event-title", { timeout: 30000 }).should(
          "contain",
          "Order updated"
        );

        cy.get("timeline-generic-changeset")
          .within(() => {
            cy.contains('Order title set to This is an order title');
            cy.contains('How appointed set to Sole');
            cy.contains('Notes set to Order notes etc....');
          });
      });
    }
  );
});
