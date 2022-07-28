describe('Complaints', { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs('LPA Manager');
    cy.createDonor().then(({ id: donorId }) => {
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.visit(`/lpa/#/person/${donorId}/${lpaId}`);
      });
    });
  });

  it('should add and edit a complaint', () => {
    cy.intercept({ method: 'GET', url: '/*/v1/persons/*' }).as('personRequest');
    cy.intercept({ method: 'GET', url: '/*/v1/lpas/*/complaints' }).as('complaintsRequest');

    cy.wait(['@complaintsRequest', '@personRequest']);

    cy.get('#AddComplaint').click();

    cy.frameLoaded('.action-widget-content iframe');
    cy.enter('.action-widget-content iframe').then(getBody => {
      getBody().find('#f-severity').click();
      getBody().find('#f-summary').type('Hey');
      getBody().find('#f-description').type('You know');
      getBody().find('button[type=submit]').click();
    });

    cy.wait('@complaintsRequest');
    cy.contains('.timeline-event', 'Complaint').should('contain', 'You know');

    cy.contains('.complaint-item', 'Minor: Hey')
      .should('contain', 'You know')
      .find('h3').click();

    cy.wait(3000);

    cy.frameLoaded('.action-widget-content iframe');
    cy.enter('.action-widget-content iframe').then(getBody => {
      getBody().find('#f-resolution').click();
      getBody().find('#f-resolutionDate').type('2020-01-01');
      getBody().find('button[type=submit]').click();
    });

    cy.wait('@complaintsRequest');
    cy.contains('.complaint-item', 'Minor: Hey')
      .should('contain', 'You know')
      .should('contain', 'complaint upheld on 01/01/2020');
  });
});
