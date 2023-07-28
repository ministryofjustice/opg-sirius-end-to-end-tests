beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withOrder()
    .withDeputy()
    .withDeputyContact()
});

describe("Create deputy contact for deputy", () => {
  it("Adds a new timeline event to the deputy timeline", () => {
    cy.get("@deputy").then(({ id }) => cy.visit("/supervision/deputies/" + id + "/timeline"));

    cy.get('[data-cy="contact-added-event"]').should("exist");

    cy.get('[data-cy="contact-added-event"] > .moj-timeline__header > .moj-timeline__title').should("contain", "added as a contact");

    cy.get('[data-cy="contact-added-event"] > .moj-timeline__description').should("contain", "Name: ")
    cy.get('[data-cy="contact-added-event"] > .moj-timeline__description').should("contain", "Email: ")
    cy.get('[data-cy="contact-added-event"] > .moj-timeline__description').should("contain", "Telephone: ")
  });
});


