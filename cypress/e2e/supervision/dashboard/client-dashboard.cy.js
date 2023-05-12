beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient();

  cy.get("@client").then(({id}) => {
    cy.visit(`/supervision/#/clients/${id}`);
  });
});

describe(
  "Viewing the client dashboard",
  { tags: ["@supervision", "@supervision-regression", "@client-dashboard"] },
  () => {
    it("loads the client dashboard and navigates to the Edit Client page when the edit button is clicked", () => {
      cy.get("@client").then(({id, firstname, surname}) => {
        cy.visit(`/supervision/#/clients/${id}`);

        cy.contains(".title-person-name", `${firstname} ${surname}`);
        cy.contains("#edit-client-button", "Edit client").click();

        cy.contains(`Edit Client: ${firstname} ${surname}`);
      });
    });
  }
);
