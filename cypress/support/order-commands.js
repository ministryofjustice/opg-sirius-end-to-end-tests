Cypress.Commands.add("withSupervisionLevel", {prevSubject: true}, (order, overrides = {}) => {
  let supervisionLevelBody = {
    "appliesFrom": "23/03/2023",
    "newAssetLevel": "LOW",
    "newLevel": "GENERAL",
    "notes": ""
  }
  supervisionLevelBody = {...supervisionLevelBody, ...overrides};
  cy.postToApi(`/supervision-api/v1/orders/${order.id}/supervision-level`, supervisionLevelBody);
  cy.get('@order');
});

Cypress.Commands.add("withOrderStatus", {prevSubject: true}, (order, overrides = {}) => {
  let orderStatusBody = {
    "orderStatus": {
      "handle": "ACTIVE",
      "label": "Active"
    },
    "statusDate": "23/03/2023",
    "statusNotes": ""
  }
  orderStatusBody = {...orderStatusBody, ...overrides};
  cy.putToApi(`/supervision-api/v1/orders/${order.id}/status`, orderStatusBody);
  cy.get('@order');
});
