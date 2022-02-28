Cypress.Commands.add("createDonor", () =>
  cy.fixture("donor/minimal.json").then((donor) =>
    cy
      .postToApi("/api/v1/donors", donor)
      .its("body")
      .then((res) => res.id)
  )
);

Cypress.Commands.add("createLpa", (donorId) =>
  cy.fixture("lpa/minimal.json").then((lpa) =>
    cy
      .postToApi(`/api/v1/donors/${donorId}/lpas`, lpa)
      .its("body")
      .then((res) => res.id)
  )
);
