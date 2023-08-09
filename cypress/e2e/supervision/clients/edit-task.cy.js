beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withOrder();

  cy.get("@client").then(({id}) => {
    cy.visit(`/supervision/#/clients/${id}`);
  });
});

describe(
  "Editing tasks",
  { tags: ["@supervision", "@supervision-regression", "@client-dashboard"] },
  () => {
    it("Reassigning and changing due date tasks in supervision", () => {
      cy.get('.TABS_CLIENT_TASKS > .tab-container__tab-with-count > span').should('contain.text', 1);
      cy.get('.TABS_CLIENT_TASKS').click();
      cy.wait(500);
      cy.get('.update-task-button').should("be.enabled").click();
      cy.contains("Assign to")
        .closest(".fieldset")
        .find("select")
        .select("2")
        .contains("Other team");
      cy.contains("Select team")
        .closest(".fieldset")
        .find("select")
        .select("25")
        .contains("Allocations - (Supervision)");
      cy.contains("Due Date")
        .closest(".fieldset")
        .find("input")
        .clear();
      cy.contains("Due Date")
        .closest(".fieldset")
        .find("input")
        .type("30/08/2020");
      cy.get('.footer > :nth-child(1) > .button').click();
      cy.get('div.panel > :nth-child(3) > .in-page-banner').contains('Task updated successfully');
    });
  });

