describe('Create a task', { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs('LPA Manager');
    cy.createDonor().then(({ id: donorId }) => {
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.visit(`/lpa/#/person/${donorId}/${lpaId}`);
      });
    });
  });

  it('should show the task', () => {
    cy.intercept({ method: 'GET', url: '/*/v1/persons/*' }).as('personRequest');

    cy.wait('@personRequest');

    cy.contains('New Task').click();

    cy.frameLoaded('.action-widget-content iframe');
    cy.enter('.action-widget-content iframe').then(getBody => {
      getBody().find('#f-taskType').select('Change of Address');
      getBody().find('#f-name').type('Donor has moved');
      getBody().find('#f-description').type('New address is somewhere else');
      getBody().find('#f-assignTo-2').check();
      getBody().find('#f-assigneeTeam').select('Complaints Team');
      getBody().find('#f-dueDate').type('9999-01-01');
      getBody().find('button[type=submit]').click();
    });

    cy.wait('@personRequest');

    cy.get('.task-list', { timeout: 10000 });
    cy.contains('.task-list-task', 'Donor has moved')
      .should('contain', 'Change of Address')
      .should('contain', 'Assigned to Complaints Team')
      .should('contain', 'To be completed by 01 January 9999');

    cy.get('.timeline .timeline-event', { timeout: 10000 });
    cy.contains('.timeline-event', 'Change of Address')
      .should('contain', 'now assigned to Complaints Team')
      .should('contain', 'Donor has moved — New address is somewhere else');
  });
});
