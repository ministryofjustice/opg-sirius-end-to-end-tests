import randomText from "./random-text";

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

Cypress.Commands.add("makeOrderActive", (orderId, overrides = {}) => {
  let orderStatusBody = {
    "orderStatus": {
      "handle": "ACTIVE",
      "label": "Active"
    },
    "statusDate": "23/03/2023",
    "statusNotes": ""
  }
  orderStatusBody = {...orderStatusBody, ...overrides};
  cy.putToApi(`/supervision-api/v1/orders/${orderId}/status`, orderStatusBody);
  cy.get('@order');
});

Cypress.Commands.add("withDeputy", {prevSubject: true}, (order, overrides = {}, alias = "deputy") => {
  cy.fixture("deputy/minimal.json").then((deputy) => {
    deputy = {
      ...deputy,
      firstname: randomText(),
      surname: randomText(),
      ...overrides
    };
    cy.postToApi("/api/v1/deputies", deputy)
      .its("body")
      .then((res) => {
        cy.wrap(res).as(alias)
          .then(({id}) => {
            cy.postToApi(`/api/v1/orders/${order.id}/deputies`, {id})
          });
      })
  });
  cy.get("@"+alias)
});

Cypress.Commands.add("addDeputy", {prevSubject: true}, (order, deputyId, overrides = {}) => {
  cy.postToApi(`/api/v1/orders/${order.id}/deputies`, {id: deputyId})
});

Cypress.Commands.add("withOrderExpiryDate", {prevSubject: true}, (order, overrides = {}) => {
  let orderBody = {
    orderExpiryDate: "12/07/2023",
    caseSubtype: order.caseSubtype,
    caseRecNumber: order.caseRecNumber,
    orderDate: order.orderDate,
    title: order.title,
    bondReferenceNumber: order.bondReferenceNumber,
    bondValue: order.bondValue,
    orderSubtype: order.orderSubtype,
    orderIssueDate: order.orderIssueDate
  }
  orderBody = {...orderBody, ...overrides};
  cy.putToApi(`/supervision-api/v1/orders/${order.id}`, orderBody)
  cy.get('@order');
});

Cypress.Commands.add("closeOrder", {prevSubject: true}, ({id: orderId}, closureType, overrides = {}) => {
  cy.fixture(`order/closures/${closureType}.json`).then((body) => {
    cy.putToApi(`/supervision-api/v1/orders/${orderId}/status`, { ...body, ...overrides });
  })
});

Cypress.Commands.add("withBond", {prevSubject: true}, (order, overrides = {}) => {
  cy.fixture("order/bond/minimal.json").then((bond) => {
    bond = {
      ...bond,
      referenceNumber: randomText(),
      ...overrides
    };
    cy.postToApi(`/supervision-api/v1/orders/${order.id}/bonds`, bond);

  });
  cy.get("@order")
});

Cypress.Commands.add("withTask", {prevSubject: true}, ({id: orderId}, overrides = {}) => {
  let task = {
    "caseId": `${orderId}`,
    "type": "CWRD",
    "name": "Optional Task Name",
    "description": "Mandatory description",
    "dueDate": "29/03/2025",
    "assigneeId": 3
  }
  cy.postToApi(`/supervision-api/v1/tasks`, task);
});
