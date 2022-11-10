Cypress.Commands.add("createDonor", () =>
  cy
    .fixture("donor/minimal.json")
    .then((donor) => cy.postToApi("/api/v1/donors", donor, true).its("body"))
);

Cypress.Commands.add("createLpa", (donorId) =>
  cy
    .fixture("lpa/minimal.json")
    .then((lpa) =>
      cy.postToApi(`/api/v1/donors/${donorId}/lpas`, lpa).its("body")
    )
);

Cypress.Commands.add("createInvestigation", (lpaId) =>
  cy
    .fixture("investigation/create-investigation.json")
    .then((investigation) =>
      cy.postToApi(`/api/v1/lpas/${lpaId}/investigations`, investigation).its("body")
    )
);

Cypress.Commands.add("putInvestigationOnHold", (investigationId) =>
  cy
    .fixture("investigation/put-investigation-on-hold.json")
    .then((reason) =>
      cy.postToApi(`/api/v1/investigations/${investigationId}/hold-periods`, reason).its("body")
    )
);
