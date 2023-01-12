import { Visits } from './visits';

Cypress.Commands.add('addVisitForClient', (clientId) => {
  try {
    cy.postToApi(
      `/api/v1/clients/${clientId}/visits`,
      Visits.createAddVisitMinimalValues()
    ).its('body')
      .then((res) => {
        cy.wrap(res.visitId).as('visitId');
      });
  } catch (e) {
    throw new Error('Unable to create visit via API: ' + e);
  }
});

Cypress.Commands.add('editVisitForClient', (clientId, visitId) => {
  try {
    cy.postToApi(
      `/api/v1/clients/${clientId}/visits/${visitId}`,
      Visits.createEditVisitReportDue()
    );
  } catch (e) {
    throw new Error('Unable to edit visit via API: ' + e);
  }
});
