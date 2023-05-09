beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createAClient();

  cy.get("@client").then(({id}) => {
    cy.visit(`/supervision/#/clients/${{id}}`);
  });
});

describe(
  "Viewing the client dashboard",
  { tags: ["@supervision", "@supervision-regression", "@client-dashboard"] },
  () => {
    it("should load the client dashboard", () => {
      cy.contains(".title-person-name", "Ted Tedson");
    });

    it("should navigate to the Edit Client page when the edit button is clicked", () => {
      cy.contains("#edit-client-button", "Edit client").click();
      cy.contains("Edit Client: Ted Tedson");
    });
  }
);
