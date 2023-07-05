const getIframeBody = () => {
  return cy
    .get('iframe[id="editor_ifr"]', { timeout: 30000 })
    .its("0.contentDocument")
    .should("exist")
    .its("body")
    .should("not.be.undefined")
    .then(cy.wrap);
};

beforeEach(function navigateToClient() {
  cy.loginAs("Allocations User");
  cy.createClient()
    .withOrder()

  cy.get("@order").then(({id: orderId}) => {
    cy.createDraft(orderId)
  });

});

describe(
  "Edit letter",
  {tags: ["@supervision", "@supervision-regression", "@letter"]},
  () => {
    it(
      "editing and retrieving a letter",
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
        getIframeBody().find("section").clear();
        getIframeBody().find("p").type("My test letter content");
        cy.get('#save-draft-and-exit-button').click();
        cy.get('#publish-close-button').click();
        cy.get('#retrieve-drafts-button').click();
      }
    );
  }
);
