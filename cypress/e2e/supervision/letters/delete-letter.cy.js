beforeEach(function navigateToClient() {
  cy.loginAs("Allocations User");
  cy.createClient()
    .withOrder()

  cy.get("@order").then(({id: orderId}) => {
    cy.createDraft(orderId)
  });

});

describe(
  "Delete letter",
  {tags: ["@supervision", "@supervision-regression", "@letter"]},
  () => {
    it(
      "deletes a drafted letter",
      () => {
        cy.get("@order").then(({id: orderId}) => {
          cy.get("@client").then(({id: clientId}) => {
            cy.get("@draft").then(({id: draftId}) => {
              cy.visit(
                `supervision/#/clients/${clientId}/orders/${orderId}/drafts/${draftId}`
              );
            });
          });
        });
        cy.get('#delete-draft-button').click();
        cy.get('.dialog-footer > .button').click();
        cy.get('dialog').contains("Draft deleted successfully");
        cy.get('#publish-close-button').click();
        cy.get('#retrieve-drafts-button').should("be.disabled");
      }
    );
  }
);
