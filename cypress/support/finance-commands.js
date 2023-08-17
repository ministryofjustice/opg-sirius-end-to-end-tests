Cypress.Commands.add("withInvoice", {prevSubject: true}, (client = {}) => {
  cy.get('@client')
    .withOrder()
    .withSupervisionLevel()
    .withActiveOrderStatus()

  cy.request({
    url: `/supervision-api/v1/finance/${client.id}/invoices`,
    headers: {
      accept: "application/json",
      "opg-bypass-membrane": 1,
    },
  })
    .its("body")
    .then((invoices) => {
      cy.wrap(invoices[0]).as("invoice");
    });
});

Cypress.Commands.add("withCreditMemo", {prevSubject: true}, (invoice = {}) => {
  cy.get("@client").then(({id}) => {
    let invoiceAdjustmentBody = {
      amount: "20",
      notes: "<p>Writing of part of the invoice something</p>",
      type: "CREDIT MEMO"
    }
    cy.postToApi(`/supervision-api/v1/finance/${id}/invoice/${invoice.id}/ledger-entries`, invoiceAdjustmentBody)
      .its("body")
      .then((creditMemo) => {
        cy.wrap(creditMemo).as("creditMemo");
      });
  });
});
