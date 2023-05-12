Cypress.Commands.add("uploadDocument", () => {
  cy.fixture("document/minimal.json").then((document) => {
    cy.get("@client").then(({caseRecNumber}) => {
      document.caseRecNumber = caseRecNumber;
    });
    cy.postToApi(`/api/public/v1/documents`, document);
  });
});
