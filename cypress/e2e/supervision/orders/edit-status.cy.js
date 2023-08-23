beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient();
});

describe(
  "Edit order status successfully and timeline is created",
  {tags: ["@supervision-core", "@order-status"]},
  () => {
    it("successfully edits the order status for a supervised order and creates a timeline event", () => {
      cy.get("@client").withOrder();

      cy.get("@order").then(({ id: orderId }) => {
        cy.get("@client").then(({ id: clientId }) => {
          cy.visit(
            `/supervision/#/clients/${clientId}/orders/${orderId}/status`
          );
          cy.get(".TABS_ORDERS").click();

          cy.get("#order-status-date .date-input").clear();
          cy.get("button[type='submit']").should('be.disabled');
          cy.get("#order-status-date .date-input").type("01/01/2023");

          const data = new Array(1000).join( 'A' )

          let notesEditor = cy.waitForTinyMCE();
          notesEditor.enterText('<p>' + data + '</p>');

          cy.get("button[type='submit']").click();

          cy.get('.validation-summary > .content').contains('Status notes - The input is more than 280 characters long');

          cy.get("select[name='fIELDLABELSORDERSTATUS']")
            .select("Closed");

          cy.get("select[name='fIELDLABELSORDERCLOSUREREASON']")
            .select("Client deceased");

          cy.get("#order-status-date .date-input").clear().type("01/01/2023");
          notesEditor.enterText("");

          cy.get("button[type='submit']").click();

          cy.get(".closed-order-badge").should("exist");
          cy.get(".add-bond-button").should("not.exist");

          cy.get('.order-tiles__tile-tasks-active').contains("Closed");

          cy.get('.TABS_TIMELINELIST').click();

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
          cy.get(".TABS_ORDERS").click();

          cy.get('#fIELDLABELSORDERSTATUS fieldset > :nth-child(3) > label').click();

          cy.get("#order-status-date .date-input").clear().type("01/01/2023");

          cy.get("button[type='submit']").click();

          cy.get('.duplicate-order-badge').should("exist");
          cy.get(".add-bond-button").should("not.exist");

          cy.get('.order-tiles__tile-tasks-active').contains("Duplicate");

          cy.get('.TABS_TIMELINELIST').click();

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

    it("successfully edits the order status to open for a supervised order", () => {
      cy.get("@client").withOrder();

      cy.get("@order").then(({ id: orderId }) => {
        cy.get("@client").then(({ id: clientId }) => {
          cy.visit(
            `/supervision/#/clients/${clientId}/orders/${orderId}/status`
          );
          cy.get(".TABS_ORDERS").click();

          cy.get("select[name='fIELDLABELSORDERSTATUS']")
            .select("Open");

          cy.get("#order-status-date .date-input").clear().type("01/01/2023");

          cy.get("button[type='submit']").click();

          cy.get(".add-bond-button").should("not.exist");

          cy.get('.order-tiles__tile-tasks-active').contains("Open");
        });
      });
    });
  });
