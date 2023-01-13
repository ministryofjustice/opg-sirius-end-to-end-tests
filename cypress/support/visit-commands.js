Cypress.Commands.add('addVisitForClient', (clientId) => {
  let data = {
    visitType: { handle: 'VT-SUP', label: 'Supervision' },
    visitSubType: { handle: 'VST-PRO', label: 'Pro Visit' },
    visitUrgency: { handle: 'VU-STAN', label: 'Standard' },
    visitDueDate: null
  };

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
