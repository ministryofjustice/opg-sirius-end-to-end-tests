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

    cy.get('[data-cy="contact-added-event"] > .moj-timeline__header > .moj-timeline__title').should("contain", "Test Contact added as a contact");

    cy.get('[data-cy="contact-added-event"] > .moj-timeline__description').should("contain", "Name: Test Contact")
    cy.get('[data-cy="contact-added-event"] > .moj-timeline__description').should("contain", "Email: test@email.com")
    cy.get('[data-cy="contact-added-event"] > .moj-timeline__description').should("contain", "Telephone: (0121) 071 5088")
  });
});

describe("Edit deputy contact", () => {
  it("Adds a new timeline event to the deputy timeline", () => {
    cy.get("@deputy").then(({ id }) => cy.visit("/supervision/deputies/" + id + "/contacts"));
    cy.get(':nth-child(4) > .govuk-button--secondary').click();

    cy.get("#f-contactName").clear().type("John Smith");
    cy.get("#f-email").clear().type("john.smith@email.com");
    cy.get('[type="submit"]').click();

    cy.get("@deputy").then(({ id }) => cy.visit("/supervision/deputies/" + id + "/timeline"));

    cy.get('[data-cy="contact-edited-event"]').should("exist");

    cy.get('[data-cy="contact-edited-event"] > .moj-timeline__header > .moj-timeline__title').should("contain", "John Smith's details updated");

    cy.get('[data-cy="contact-edited-event"] > .moj-timeline__description').should("contain", "John Smith");
    cy.get('[data-cy="contact-edited-event"] > .moj-timeline__description').should("contain", "john.smith@email.com");
  });
});
    
describe("Delete deputy contact", () => {
  it("Adds a new timeline event to the deputy timeline", () => {
    cy.get("@deputy").then(({ id }) => cy.visit("/supervision/deputies/" + id + "/contacts"));
    cy.get('.govuk-button--warning').click();

    cy.get('.govuk-button').contains('Delete contact').click();

    cy.get("@deputy").then(({ id }) => cy.visit("/supervision/deputies/" + id + "/timeline"));

    cy.get('[data-cy="contact-deleted-event"]').should("exist");

    cy.get('[data-cy="contact-deleted-event"] > .moj-timeline__header > .moj-timeline__title').should("contain", "Test Contact removed as a contact");
  });
});
