import randomText from "./random-text";

Cypress.Commands.add("createADeputy", (overrides = {}) => {
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
        cy.wrap(res).as("deputy");
      });
  });
});

Cypress.Commands.add("createAFirm", (overrides = {}) => {
  cy.fixture("firm/minimal.json").then((firm) => {
    firm = {...firm, ...overrides};
    cy.postToApi("/api/v1/firms", firm)
      .its("body")
      .then((res) => {
        cy.wrap(res.id).as("firmId");
      });
  });
});

Cypress.Commands.add("createADeputyAndAssignToExistingOrder", (orderId, overrides = {}) => {
  cy.fixture("deputy/minimal.json").then((deputy) => {
    deputy = {...deputy, ...overrides};
    cy.postToApi("/api/v1/deputies", deputy)
      .its("body")
      .then((res) => {
        cy.wrap(res).as("deputy")
          .then(({id}) => {
            cy.postToApi(`/api/v1/orders/${orderId}/deputies`, { id })
          });
      })
  });
});

Cypress.Commands.add("withErrorStatusOnCase", {prevSubject: true}, (deputy, orderId, overrides = {}) => {
  let body = {
    "statusOnCase": {
      "handle": "OPEN",
      "label": "Open"
    },
    "statusOnCaseOverride": {
      "handle": "ERROR",
      "label": "Error"
    },
    "statusChangeDate": "26/03/2023",
    "statusNotes": "",
    "deputyType": {
      "handle": "LAY",
      "label": "Lay"
    },
    "relationshipToClient": "",
    "relationshipOther": "",
    "mainCorrespondent": false,
    "feePayer": false
  }
  body = {...body, ...overrides};
  cy.putToApi(`/supervision-api/v1/orders/${orderId}/deputies/${deputy.id}`, body);
  cy.get("@deputy");
});

Cypress.Commands.add("withDeputyContact", {prevSubject: true}, (deputy, overrides = {}) => {
  cy.fixture("deputy-contact/minimal.json").then((deputyContact) => {
    deputyContact = {...deputyContact, ...overrides};
    cy.postToApi(`/api/v1/deputies/${deputy.id}/contacts`, deputyContact);
  });
});
