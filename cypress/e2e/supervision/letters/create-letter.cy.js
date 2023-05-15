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
    .withOrder();
});

describe(
  "Create letter",
  { tags: ["@supervision", "@supervision-regression", "@letter"] },
  () => {
    it(
      "creates, edits, previews, and publishes a draft",
      () => {
        cy.get("@order").then(({id: orderId}) => {
          cy.get("@client").then(({id: clientId}) => {
            cy.visit(
              `/supervision/#/clients/${clientId}/orders/${orderId}/drafts/create/template`
            );
          });
        });

        cy.contains(".select-template", "Select a template");
        cy.contains("blank: Blank template").click();

        cy.get("draft-select-recipients")
          .find(".section-title")
          .contains("Select recipient/s");

        cy.get(
          "li.selectable-list-item > draft-recipient:nth-child(1) > label:nth-child(1)"
        )
          .as("firstSelectableRecipient")
          .click();

        cy.get("#create-letter-button").click();
        cy.contains("#preview-publish-button", "Preview & publish");
        cy.contains(".document-editor__sub-title", "Edit document...");

        cy.get('iframe[id="editor_ifr"]')
          .its("0.contentDocument")
          .should("exist")
          .its("body")
          .should("not.be.undefined")
          .then(cy.wrap)
          .as("iframeBody");

        getIframeBody().find("section").clear();
        getIframeBody().find("p").type("My test letter content");

        cy.contains(".button", "Save draft").click();
        cy.get("#publish-close-button").click();
        cy.get("#preview-publish-button").click();
        getIframeBody().contains("My test letter content");

        cy.contains(".hook-modal-publish", "Publish").click();
        cy.contains("The draft has been successfully published");
        cy.get("#publish-close-button").click();
      }
    );
  }
);
