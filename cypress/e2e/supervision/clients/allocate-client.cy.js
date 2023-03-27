beforeEach(() => {
  cy.loginAs("Allocations User");
  cy.createAClient();
  cy.get("@clientId").then((clientId) => cy.createOrderForClient(clientId));
  cy.get("@orderId").then((orderId) => cy.setSupervisionLevel(orderId));
  cy.get("@orderId").then((orderId) => cy.changeOrderStatus(orderId));
});

describe(
  "Allocate a client smoke journey",
  { tags: ["@supervision-core", "@allocate-client", "@smoke-journey"] },
  () => {
    it("allocates a client to casework team when order is active", () => {
      cy.get("@orderId").then((orderId) => {
        cy.get("@clientId").then((clientId) => {
          cy.visit(
            `/supervision/#/clients/${clientId}?order=${orderId}`
          );
        });
      });
      cy.get("#allocate-button").click();
      cy.get(".required")
        .closest(".fieldset")
        .find("Select")
        .select("Lay Team 1 - (Supervision)");
      cy.get('button[class="button primary dialog-button"]').click();
      cy.get(".case-owner-value-in-client-summary").contains("Lay Team 1 - (Supervision) - 0123456789");
      cy.get("#allocate-button")
        .should("be.visible")
        .should("be.disabled");
      cy.get(".TABS_TIMELINELIST").click();
      cy.get(".timeline-event-title", { timeout: 30000 })
        .should("contain", "Client Allocated");
      cy.get(".hook-allocated-teamname").contains("Lay Team 1 - (Supervision)");
      cy.get(".hook-allocated-clientname").contains("Ted Tedson");
    }
  );
});
