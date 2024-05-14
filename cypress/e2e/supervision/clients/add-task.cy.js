beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withOrder();

  cy.get("@client").then(({id}) => {
    cy.visit(`/supervision/#/clients/${id}`);
  });
});

describe(
  "Creating self assigned task in supervision",
  { tags: ["@supervision", "@supervision-regression", "@client-dashboard"] },
  () => {
    it("new task is created after a validation error", () => {
      cy.get('#add-task-button').click()
      cy.contains("Task type")
        .closest(".fieldset")
        .find("select")
        .select("1")
        .contains("Casework - Complaint review");
      cy.contains("Assign to")
        .closest(".fieldset")
        .find("select")
        .select("0")
        .contains("Myself");
      cy.contains("Due Date")
        .closest(".fieldset")
        .find("input")
        .type("08/08/2020");
      const data = new Array(1000).join( 'A' )
      cy.waitForTinyMCE()
        .enterText('<p>'+data+'</p>');
      cy.get('button').contains('Save & exit').click();
      cy.get('.validation-summary')
        .and("contain.text", "There is a problem")
        .and("contain.text", "Notes - The input is more than 1000 characters long");
      cy.waitForTinyMCE()
        .enterText('<p>Working now</p>');
      cy.get('button').contains('Save & exit').click();
      cy.get('#tab-container').contains('Tasks').should('contain.text', 2);
      cy.get('#tab-container').contains('Tasks').click();
      cy.get('#client-tasks-list').should('be.visible');
    });
  });
