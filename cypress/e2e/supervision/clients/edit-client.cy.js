const suffix = Math.floor(Math.random() * 10000);
const newFirstName = "Test" + suffix;
const newLastName = "Client" + suffix;
const memorablePhrase = "Memorable" + suffix;

const editClient = (isCourtReferenceChanged) => {
  return cy.get("@client").then(({id, firstname, surname}) => {
    cy.intercept({
      method: "PUT",
      url: `/supervision-api/v1/clients/${id}`,
    }).as("editClientCall");
    cy.reload();
    cy.get('input[name="firstName"]').should('be.visible');
    cy.get('input[name="firstName"]').should("have.value", firstname);
    cy.get('input[name="firstName"]', { timeout: 30000 }).should("not.be.disabled");
    cy.get('input[name="lastName"]').should("have.value", surname);
    cy.get('input[name="lastName"]').should("not.be.disabled");
    cy.get('input[name="memorablePhrase"]', { timeout: 30000 }).should("not.be.disabled");

    cy.get('input[name="firstName"]', { timeout: 30000 }).should("not.be.disabled");
    cy.get('input[name="firstName"]', { timeout: 30000 }).clear();
    cy.get('input[name="firstName"]', { timeout: 30000 }).type(newFirstName);
    cy.get('input[name="lastName"]').clear();
    cy.get('input[name="lastName"]').type(newLastName);
    cy.get('input[name="memorablePhrase"]').clear();
    cy.get('input[name="memorablePhrase"]').type(memorablePhrase);
    cy.contains("Save & Exit").click();
  });
};

describe(
  "Edit an existing client",
  { tags: ["@supervision-core", "@client", "@smoke-journey"] },
  () => {
    it("Edits an existing client",
      {
        retries: {
          runMode: 2,
          openMode: 0,
        },
      }, () => {
          cy.loginAs("Case Manager");
          cy.createClient();
          cy.get("@client").then(({ id, firstname, surname }) => {
            cy.visit(`/supervision/#/clients/${id}/edit`);
            cy.contains(`Edit Client: ${firstname} ${surname}`);
          });
        editClient(true);
        cy.get(".title-person-name").contains(`${newFirstName} ${newLastName}`);

        cy.get('#tab-container').contains('Summary').click();
        cy.get(".client-summary-full-name-value").contains(
          `${newFirstName} ${newLastName}`
        );
        cy.get(".client-summary-memorable-phrase-value").contains(
          memorablePhrase
        );

        cy.get('#tab-container').contains('Timeline').click();

        cy.reload()
        cy.get(".timeline-event-title", { timeout: 30000 }).should(
          "contain",
          "Client edited"
        );

        cy.get("timeline-generic-changeset")
          .first()
          .within(() => {
            cy.get("@client").then(({ firstname, surname }) => {
              cy.contains(`First name changed from ${firstname} to ${newFirstName}`, { timeout: 30000 });
              cy.contains(`Last name changed from ${surname} to ${newLastName}`);
              cy.contains(`Memorable phrase set to ${memorablePhrase}`);
            });
          });
      }
    );
  });

