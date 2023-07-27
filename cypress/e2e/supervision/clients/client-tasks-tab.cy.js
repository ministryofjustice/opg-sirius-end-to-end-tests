beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withOrder()
    .withTask();

  cy.get("@client").then(({id}) => {
    cy.visit(`/supervision/#/clients/${id}`);
  });
});

describe(
  "Viewing the client tasks page",
  { tags: ["@supervision", "@supervision-regression", "@client-dashboard"] },
  () => {
    it("shows client tasks as expected and updates them when tasks completed", () => {
      cy.get('.TABS_CLIENT_TASKS > .tab-container__tab-with-count > span').should('contain.text', 2);
      cy.get('.TABS_CLIENT_TASKS').click();
      cy.get('#client-tasks-list').should('be.visible');
      cy.get('.task-columns > :nth-child(1)').should('contain.text', 'Type');
      cy.get('.task-columns > :nth-child(2)').should('contain.text', 'Task due date');
      cy.get('.task-columns > :nth-child(3)').should('contain.text', 'Assigned to');
      cy.get('.task-columns > :nth-child(4)').should('contain.text', 'Order');

      cy.get(':nth-child(3) > .task-name').should('contain.text', 'Casework - Reply due');
      cy.get(':nth-child(3) > :nth-child(2) > .due-date').should('contain.text', '29/03/2025');
      cy.get(':nth-child(3) > .assigned-to').should('contain.text', 'Attorneyship Investigation Team');
      cy.get('.mark').should('contain.text', 'Complete');
      cy.get('.update-task-button').should('contain.text', 'Update Task');

      cy.get('.details-row > td').should('not.be.visible');
      cy.get('.dotted-link').should('contain.text', 'View notes');
      cy.get('.dotted-link').first().click();
      cy.get('.details-row > td').should('be.visible');
      cy.get('.details-row > td').should('contain.text', 'A client has been created');

      cy.get('.order-number').should('contain.text', 'PFA');

      cy.get('.mark').first().click();
      cy.get('.head > .title').should('contain.text', 'Complete task');
      cy.get('.footer > :nth-child(1) > .button').should('contain.text', 'Complete the task')
      cy.get('.footer > :nth-child(1) > .button').click();

      cy.get('.TABS_CLIENT_TASKS').click();
      cy.reload();
      cy.get('.TABS_CLIENT_TASKS > .tab-container__tab-with-count > span').should('contain.text', 1);
      cy.get('.task-name').should('contain.not.text', 'Order - Allocate to team');
    });
  });

