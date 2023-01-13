import { Visits } from "./visits-common.js";

Cypress.Commands.add('addVisitForClient', (clientId) => {
  let data = Visits.createAddVisitMinimalValues();

  try {
    cy.postToApi(
      `/api/v1/clients/${clientId}/visits`,
      data
    ).its('body')
      .then((res) => {
        cy.wrap(res.visitId).as('visitId');
      });
  } catch (e) {
    throw new Error('Unable to create visit via API: ' + e);
  }
});

Cypress.Commands.add('editVisitForClient', (clientId, visitId) => {
  let data = Visits.createEditVisitReportDue();
  try {
    cy.postToApi(
      `/api/v1/clients/${clientId}/visits/${visitId}`,
      data
    );
  } catch (e) {
    throw new Error('Unable to edit visit via API: ' + e);
  }
});
