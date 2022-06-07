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

describe('Complete a task', { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs('LPA Manager');
    cy.createDonor().then(({ id: donorId }) => {
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.visit(`/lpa/#/person/${donorId}/${lpaId}`);
      });
    });
  });

  it('a task completed timeline event is recorded', () => {
    cy.intercept({ method: "GET", url: "/*/v1/persons/*/events*" }).as("eventsRequest");
    cy.intercept({ method: "PUT", url: "/*/v1/tasks/*" }).as("tasksRequest");

    cy.wait("@eventsRequest");

    cy.get('.task-list .task-actions').first().contains("Complete").click();
    cy.contains('Yes, confirm').click();

    cy.wait("@eventsRequest");
    cy.wait("@tasksRequest");

    cy.get('.timeline-event').first().next().contains('Create physical case file Completed');
  });
});

describe('Reassign a task', { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs('LPA Manager');
    cy.createDonor().then(({ id: donorId }) => {
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.visit(`/lpa/#/person/${donorId}/${lpaId}`);
      });
    });
  });

  it('a task reassign timeline event is recorded', () => {
    cy.intercept({ method: "GET", url: "/*/v1/persons/*/events*" }).as("eventsRequest");
    cy.intercept({ method: 'GET', url: '/*/v1/teams/*' }).as('teamsRequest');

    cy.wait("@eventsRequest");

    cy.get('.task-list .task-actions').first().contains("Allocate").click();
    cy.get('.assigneeType').contains("team").click();
    cy.get('[id=assigneeTeam0').click();
    cy.contains("Card Payment Team").click();
    cy.get('button[type=submit]').contains("Assign task").click();

    cy.wait("@teamsRequest");

    cy.get('.timeline-event')
      .first()
      .contains('Task was assigned to File Creation Team now assigned to Card Payment Team');

    cy.get('.task-list').first().contains("Assigned to Card Payment Team");
  });
});
