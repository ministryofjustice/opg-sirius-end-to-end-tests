// describe('Complaints', { tags: ["@lpa", "@smoke-journey"] }, () => {
//   before(() => {
//     cy.loginAs('LPA Manager');
//     cy.createDonor().then(({ id: donorId }) => {
//       cy.createLpa(donorId).then(({ id: lpaId }) => {
//         cy.visit(`/lpa/#/person/${donorId}/${lpaId}`);
//       });
//     });
//   });

//   it('should add and edit a complaint', () => {
//     cy.intercept({ method: 'GET', url: '/*/v1/persons/*' }).as('personRequest');
//     cy.intercept({ method: 'GET', url: '/*/v1/lpas/*/complaints' }).as('complaintsRequest');

//     cy.wait(['@complaintsRequest', '@personRequest']);

//     cy.get('#AddComplaint').click();
//     cy.contains('label', 'Minor').click();
//     cy.get('#summary0').type('Hey');
//     cy.get('#description0').type('You know');
//     cy.get('#SaveAndExit').click();

//     cy.wait('@complaintsRequest');
//     cy.contains('.timeline-event', 'Complaint').should('contain', 'You know');

//     cy.contains('.complaint-item', 'Minor: Hey')
//       .should('contain', 'You know')
//       .find('h3').click();

//     cy.contains('label', 'complaint upheld').click();
//     cy.get('#resolutionDate0').type('01/01/2020');

//     cy.get('#SaveAndExit').click({ force: true });

//     cy.contains('.complaint-item', 'Minor: Hey')
//       .should('contain', 'You know')
//       .should('contain', 'complaint upheld on 01/01/2020');
//   });
// });
