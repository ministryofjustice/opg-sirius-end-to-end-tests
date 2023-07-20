beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient();

  cy.get("@client").then(({id}) => {
    cy.visit(`/supervision/#/clients/${id}`);
  });
});
describe(
  "Viewing the client tasks page",
  { tags: ["@supervision", "@supervision-regression", "@client-dashboard"] },
  () => {
    it("shows client tasks as expected and updates them when tasks completed", () => {
      cy.contains('Tasks').click();
      cy.get('.TABS_CLIENT_TASKS > .tab-container__tab-with-count > span').should('contain.text', 1);
      cy.get('#client-tasks-list').should('be.visible');
      cy.get('.task-columns > :nth-child(1)').should('contain.text', 'Type');
      cy.get('.task-columns > :nth-child(2)').should('contain.text', 'Task due date');
      cy.get('.task-columns > :nth-child(3)').should('contain.text', 'Assigned to');
      cy.get('.task-columns > :nth-child(4)').should('contain.text', 'Order');

      cy.get('.task-name').should('contain.text', 'Order - Allocate to team');
      cy.get('.action-row > :nth-child(2)').should('contain.text', '04/08/2023');
      cy.get('.action-row > :nth-child(3)').should('contain.text', 'Case Owner');
      cy.get('.action-row > :nth-child(5)').should('contain.text', 'Complete');
      cy.get('.action-row > :nth-child(5)').should('contain.text', 'Update Task');

      cy.get('.details-row > td').should('not.be.visible');
      cy.get('.dotted-link').should('contain.text', 'View notes');
      cy.get('.dotted-link').click();
      cy.get('.details-row > td').should('be.visible');
      cy.get('.details-row > td').should('contain.text', 'A client has been created');

      cy.get('.mark').click();
      cy.get('.smart__action').should('contain.text', 'Complete');
      cy.contains('Complete the task').click();

      cy.contains('Tasks').click();
      cy.get('.TABS_CLIENT_TASKS > .tab-container__tab-with-count > span').should('contain.text', 0);
      cy.get('.task-list__message').should('contain.text', 'There are no live tasks');
    });
  });
