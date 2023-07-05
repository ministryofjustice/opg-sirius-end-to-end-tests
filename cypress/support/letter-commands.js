Cypress.Commands.add("createDraft", (id) => {
  cy.fixture("letter/draft.json").then((draftLetter) => {
    cy.get("@client").then(({id}) => {
      draftLetter.correspondents[0].id = id;
    });
    cy.postToApi(`supervision-api/v1/correspondence/orders/${id}/drafts`, draftLetter)
      .its("body")
      .then((res) => cy.wrap(res[0]).as("draft"));
  });
});

Cypress.Commands.add("createContent", (id) => {
  cy.fixture("letter/content.json").then((contentLetter) => {
    cy.get("@draft").then(({id: draftId}) => {
      cy.putToApi(`supervision-api/v1/correspondence/orders/${id}/drafts/${draftId}/content`, contentLetter);
    });
  });
});

Cypress.Commands.add("createLetter", (id) => {
  cy.fixture("letter/minimal.json").then((letter) => {
    cy.get("@draft").then(({id: draftId}) => {
      cy.get("@client").then(({id, salutation, firstname, surname}) => {
        letter.correspondent.id = id;
        letter.correspondent.salutation = salutation;
        letter.correspondent.firstname = firstname;
        letter.correspondent.surname = surname;
      });
      cy.postToApi(`supervision-api/v1/correspondence/orders/${id}/drafts/${draftId}/publish`, letter);
    });
  });
});
