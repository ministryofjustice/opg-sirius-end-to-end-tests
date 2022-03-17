Cypress.Commands.add("createDonor", () =>
  cy
    .fixture("donor/minimal.json")
    .then((donor) => cy.postToApi("/api/v1/donors", donor).its("body"))
);

Cypress.Commands.add("createLpa", (donorId) =>
  cy
    .fixture("lpa/minimal.json")
    .then((lpa) =>
      cy.postToApi(`/api/v1/donors/${donorId}/lpas`, lpa).its("body")
    )
);

Cypress.Commands.add("createDraft", (donorId, lpaId) =>
  cy.postToApi(
    `/api/v1/lpas/${lpaId}/documents/draft`,
    `{"templateId": "IT-AT-LPA", "inserts": ["IT-11"], "correspondentId": ${donorId}}`,
  ).its("body")
);
