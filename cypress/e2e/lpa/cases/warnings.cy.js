describe('Warnings', { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs('LPA Manager');
    cy.createDonor().then(({ id: donorId, uId: donorUid }) => {
      cy.wrap(donorUid).as("donorUid");
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.wrap(`/lpa/#/person/${donorId}/${lpaId}`).as('url');
      });
    });
  });

  beforeEach(function () {
    cy.intercept({ method: 'GET', url: '/*/v1/persons/*/warnings' }).as('warningsRequest');
    cy.intercept({ method: 'DELETE', url: '/*/v1/warnings/*' }).as('deleteRequest');

    cy.loginAs('LPA Manager');
    cy.visit(this.url);
    cy.wait(['@warningsRequest']);
    cy.get(".person-panel-details").contains(this.donorUid);
  });

  it('should create a warning', () => {
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

  it('should remove a warning', () => {
    cy.contains('.warnings .opg-icon', 'CreateWarning').trigger('mouseover');
    cy.contains('.warnings .opg-icon', 'RemoveWarning').click();

    cy.wait('@deleteRequest');

    cy.contains('.warnings', 'No warnings in place');
    cy.contains('.timeline-event', 'Warning removed by atwo manager');
  });
});
