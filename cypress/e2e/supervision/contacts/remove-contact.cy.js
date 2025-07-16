beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient().withContact();
  cy.get("@client").then(({ id }) => {
    cy.visit(`/supervision/#/clients/${id}`);
  });
  cy.get('#tab-container').contains('Contacts').click();
});

describe(
  "Remove contact",
  { tags: ["@supervision-core", "@contact", "@smoke-journey"] },
  () => {
    it("can not be deleted due to having a document associated to them", () => {
      cy.loginAs("Allocations User");
      cy.get("@client").then(({id}) => {
        cy.visit(`/supervision/#/clients/${id}`);
      });
      cy.get("@client").withOrder();
      cy.get("@order").then(({id: orderId}) => {
        cy.get("@client").then(({id: clientId}) => {
          cy.visit(
            `/supervision/#/clients/${clientId}/orders/${orderId}/drafts/create/template`
          );
        });
      });
      cy.contains(".select-template", "Select a template");
      cy.contains("blank: Blank template").click();
      cy.get(".selectable-list-select-recipients-list > :nth-child(2)").click();
      cy.get("#create-letter-button").click();
      cy.enter('#editor_ifr').then(getBody => {
        getBody().find('section').clear()
        getBody().find("p").type("This is a letter that I have created.");
      });

      cy.contains(".button", "Save draft").click();
      cy.get("#publish-close-button").click();
      cy.get("#preview-publish-button").click();
      cy.get(".footer > .button").click();
      cy.get("#publish-close-button").click();
      cy.get('#tab-container').contains('Contacts').click();
      cy.get(".delete").click();
      cy.get(".dialog-footer > .button")
        .should("be.visible", {timeout: 30000}).click();

      cy.get(
        "tab-contact-list .in-page-error-banner"
      )
        .should("be.visible")
        .and(
          "contain.text",
          "This contact cannot be deleted."
        );
    });

    it("can be deleted", () => {
      cy.get('#tab-container').contains('Contacts').click();
      cy.get(".delete").click();
      cy.get(".dialog-footer > .button").click();
      cy.get(
        "tab-contact-list > .hook-tab-content > :nth-child(1) > .in-page-banner > .content > h2"
      )
        .should("be.visible")
        .and("contain.text", "Mr Ian Contacts has now been deleted");
    });
  }
);
