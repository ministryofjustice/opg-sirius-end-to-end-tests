describe('Remove a warning', { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs('LPA Manager');
    cy.createDonor().then(({ id: donorId }) => {
      cy.createEpa(donorId).then(({ id: lpaId }) => {
        cy.visit(`/lpa/#/person/${donorId}/${lpaId}`);
      });
    });
  });

  it('should remove the warning', () => {
    cy.intercept({ method: 'GET', url: '/*/v1/persons/*' }).as('personRequest');
    cy.intercept({ method: 'GET', url: '/*/v1/persons/*/warnings' }).as('warningsRequest');
    cy.intercept({ method: 'DELETE', url: '/*/v1/warnings/*' }).as('deleteRequest');

    cy.wait(['@personRequest', '@warningsRequest']);

    cy.contains('.warnings .opg-icon', 'CreateWarning').trigger('mouseover');
    cy.contains('.warnings .opg-icon', 'RemoveWarning').click();

    cy.wait('@deleteRequest');

    cy.contains('.warnings', 'No warnings in place');
    cy.contains('.timeline-event', 'Warning removed by atwo manager');
  });
});
