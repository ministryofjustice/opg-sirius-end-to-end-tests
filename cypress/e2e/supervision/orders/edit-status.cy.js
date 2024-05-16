beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient();
});


describe(
  "Edit order status successfully and timeline is created",
  {tags: ["@supervision-core", "@order-status"]},
  () => {
    it("successfully edits the order status for a supervised order and creates a timeline event", () => {
      cy.get("@client").withOrder()
        .withSupervisionLevel()
        .withActiveOrderStatus();

      cy.get("@order").then(({ id: orderId }) => {
        cy.get("@client").then(({ id: clientId }) => {
          cy.visit(
            `/supervision/#/clients/${clientId}`
          );

          cy.contains('Order status:').contains("Active");

          cy.visit(
            `/supervision/#/clients/${clientId}/orders/${orderId}/status`
          );

          cy.getDatePickerInputByLabel("Status date").clear();
          cy.get("button[type='submit']").should('be.disabled');
          cy.getDatePickerInputByLabel("Status date").type("01/01/2023");

          cy.get('[name="fIELDLABELSORDERSTATUS"][data-core-value=CLOSED]').check({ force: true }).should('be.checked')


          cy.get("select[name='fIELDLABELSORDERCLOSUREREASON']")
            .select("Client deceased");

          cy.getDatePickerInputByLabel("Status date").clear();
          cy.getDatePickerInputByLabel("Status date").type("01/01/2023");

          cy.get("button[type='submit']").click();

          cy.get('#tab-container').contains('Orders').click();

          cy.get(".closed-order-badge").should("exist");
          cy.get(".add-bond-button").should("not.exist");

          cy.contains('Order status:').contains("Closed");

          cy.get('#tab-container').contains('Timeline').click();

          cy.get(".timeline-event-title", {timeout: 30000}).should(
            "contain",
            "Order status changed"
          );

          cy.get('timeline-order-status-changed .event-order-status').children()
            .should("contain", "Order status")
            .should("contain", "OPEN")
            .should("contain", "CLOSED")
            .should("contain", "01/01/2023");

          cy.get('.event-order-closure-reason')
            .should("contain", "CLIENT DECEASED");
        });
      });
    });

    it("successfully edits the order status for a non-supervised order and creates a timeline event", () => {
      cy.get("@client").withOrder({"orderSubtype": {
          "handle": "TENANCY",
          "label": "Tenancy"
        }});

      cy.get("@order").then(({ id: orderId }) => {
        cy.get("@client").then(({ id: clientId }) => {
          cy.visit(
            `/supervision/#/clients/${clientId}/orders/${orderId}/status`
          );

          cy.get('#fIELDLABELSORDERSTATUS fieldset > :nth-child(3) > label').click();

          cy.getDatePickerInputByLabel("Status date").clear();
          cy.getDatePickerInputByLabel("Status date").type("01/01/2023");

          cy.get("button[type='submit']").click();

          cy.get('#tab-container').contains('Orders').click();

          cy.get('.duplicate-order-badge').should("exist");
          cy.get(".add-bond-button").should("not.exist");

          cy.contains('Order status:').contains("Duplicate");

          cy.get('#tab-container').contains('Timeline').click();

          cy.get(".timeline-event-title", {timeout: 30000}).should(
            "contain",
            "Order status changed"
          );

          cy.get('timeline-order-status-changed .event-order-status').children()
            .should("contain", "Order status")
            .should("contain", "OPEN")
            .should("contain", "DUPLICATE")
            .should("contain", "01/01/2023");
        });
      });
    });
  });
