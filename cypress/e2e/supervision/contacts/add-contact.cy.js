beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient();
  cy.get("@client").then(({id}) => {
    cy.visit(
      `/supervision/#/clients/${id}`
    );
  });
  cy.get('#tab-container').contains('Contacts').click();
  cy.get("#no-contacts-message").should("contain.text", "There are no contacts")
  cy.get("#add-contact-button").click();
  cy.get(".add-contact-title").should("be.visible").should("contain.text", "Create a new contact")
  cy.get("footer button[type=submit]:contains('Create contact')").as("createContactButton")
  cy.get("@createContactButton").should("be.visible").should("be.disabled")
});

describe(
  "Add contact",
  { tags: ["@supervision-core", "@contact", "@smoke-journey"] },
  () => {
    it("can add a non organisation contact", () => {
      cy.get("input[type=radio][name=isOrganisation][value=false]").parent().click()
      cy.get("@createContactButton").should("be.disabled")
      cy.get("input[name=firstName]").should("be.visible").type("FirstName")
      cy.get("@createContactButton").should("be.disabled")
      cy.get("input[name=lastName]").should("be.visible").type("A".repeat(256))
      cy.get("@createContactButton").should("be.enabled").click()
      cy.get(".validation-summary").should("be.visible")
        .and("contain.text", "There is a problem")
        .and("contain.text", "Last name - The input is more than 255 characters long")
      cy.get("input[name=lastName]").clear()
      cy.get("input[name=lastName]").type("LastName")
      cy.get("@createContactButton").should("be.enabled").click()
      cy.get("#contacts-list #contact-table .contact-name").should("exist")
        .and("be.visible")
        .and("contain.text", "FirstName LastName")
    });

    it("can add an organisation contact", () => {
      cy.get("input[type=radio][name=isOrganisation][value=true]").parent().click()
      cy.get("@createContactButton").should("be.disabled")
      cy.get("input[name=correspondenceName]").should("be.visible").type("CorrespondenceName")
      cy.get("@createContactButton").should("be.disabled")
      cy.get("input[name=companyName]").should("be.visible").type("A".repeat(256))
      cy.get("@createContactButton").should("be.enabled").click()
      cy.get(".validation-summary").should("be.visible")
        .and("contain.text", "There is a problem")
        .and("contain.text", "Company name - The input is more than 255 characters long")
      cy.get("input[name=companyName]").clear()
      cy.get("input[name=companyName]").type("CompanyName")
      cy.get("@createContactButton").should("be.enabled").click()
      cy.get("#contacts-list #contact-table .contact-name").should("exist")
        .and("be.visible")
        .and("contain.text", "CorrespondenceName")
    });
  }
);
