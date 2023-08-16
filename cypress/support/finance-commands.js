Cypress.Commands.add("withInvoice", {prevSubject: true}, ({id: clientId}, overrides = {}) => {
  cy.fixture("invoice/minimal.json").then((invoice) => {
    invoice = {...invoice, ...overrides};
    cy.postToApi(`/supervision-api/v1/finance/${clientId}/manual-invoice`, invoice)
      .its("body")
      .then((res) => {
        cy.wrap(res.id).as("invoiceId");
      });
  });
});

Cypress.Commands.add("createCredit", (clientId, invoiceId, overrides = {}) => {
  const credit = {
    "type": "CREDIT MEMO",
    "amount": "195",
    "notes": "Credit invoice notes",
  }

  cy.postToApi(`/supervision-api/v1/finance/${clientId}/invoice/${invoiceId}/ledger-entries`, credit)
    .its("body")
});

// /finance/118/invoice/9/ledger-entries
