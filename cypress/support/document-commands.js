Cypress.Commands.add("uploadDocument", () => {
  cy.fixture("document/minimal.json").then((document) => {
    cy.get("@clientCourtReference").then((courtRef) => {
      document.caseRecNumber = courtRef;
    });
    cy.postToApi(`/api/public/v1/documents`, document);
  });
});
