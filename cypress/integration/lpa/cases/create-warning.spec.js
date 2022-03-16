describe('Create a warning', { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs('LPA Manager');
    cy.createDonor().then(({ id: donorId }) => {
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.visit(`/lpa/#/person/${donorId}/${lpaId}`);
      });
    });
  });

  it('should show the warning and a timeline event', () => {
    cy.intercept({ method: 'GET', url: '/api/v1/persons/*' }).as('personRequest');
    cy.intercept({ method: 'GET', url: '/api/v1/persons/*/warnings' }).as('warningsRequest');

    cy.wait(['@personRequest', '@warningsRequest']);

    cy.contains('Create Warning').click();

    cy.frameLoaded('.action-widget-content iframe');
    cy.enter('.action-widget-content iframe').then(getBody => {
      getBody().find('#f-warningType').select('Fee Issue');
      getBody().find('#f-warningText').type('This is a big problem');
      getBody().find('button[type=submit]').click();
    });

    cy.wait('@warningsRequest');

    cy.contains('.warning-item', 'Fee Issue').should('contain', 'This is a big problem');
    cy.contains('.timeline-event', 'Fee Issue').should('contain', 'This is a big problem');
  });
});
