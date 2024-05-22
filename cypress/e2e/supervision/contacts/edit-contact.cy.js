beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withContact();
  cy.get("@client").then(({id}) => {
    cy.visit(
      `/supervision/#/clients/${id}`
    );
  });
  cy.get('#tab-container').contains('Contacts').click();
});

describe(
  "Edit contact",
  {tags: ["@supervision-core", "@contact", "@smoke-journey"]},
  () => {
    it("can edit a non organisation contact", () => {
      cy.get(".contacts-list").contains("Edit").click();
      cy.get("footer").contains("button", "Save & update contact").as("editContactButton");

      cy.get("input[name=firstName]").type("A".repeat(256));
      cy.get("@editContactButton").click();
      cy.get(".validation-summary")
        .and("contain.text", "There is a problem")
        .and("contain.text", "First name - The input is more than 255 characters long");

      cy.get("input[name=firstName]").clear();
      cy.get("input[name=firstName]").type("Edited");
      cy.get("@editContactButton").click();

      cy.get("@contact").then(({surname}) => {
        cy.get("#contacts-list #contact-table .contact-name").contains(`Edited ${surname}`);
      });
    });
  }
);
