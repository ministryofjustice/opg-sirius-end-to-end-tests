const suffix = Math.floor(Math.random() * 10000);
const newFirstName = "Test" + suffix;
const newLastName = "Client" + suffix;
const memorablePhrase = "Memorable" + suffix;

const editClient = (isCourtReferenceChanged) => {
  return cy.get("@client").then(({id, firstname}) => {
    cy.intercept({
      method: "PUT",
      url: `/supervision-api/v1/clients/${id}`,
    }).as("editClientCall");
    cy.wait(2000);
    cy.get('input[name="firstName"]').should("have.value", firstname);
    cy.get('input[name="firstName"]').should("not.be.disabled");
    cy.get('input[name="firstName"]').clear();
    cy.get('input[name="firstName"]').type(newFirstName);
    cy.get('input[name="lastName"]').should("not.be.disabled");
    cy.get('input[name="lastName"]').clear();
    cy.get('input[name="lastName"]').type(newLastName);
    cy.get('input[name="memorablePhrase"]').clear();
    cy.get('input[name="memorablePhrase"]').should("not.be.disabled");
    cy.get('input[name="memorablePhrase"]').type(memorablePhrase);
    if (isCourtReferenceChanged) {
      cy.get('input[name="courtReference"]').should("not.be.disabled");
      cy.get('input[name="courtReference"]').clear();
      cy.get('input[name="courtReference"]').type("00000000");
    }
    cy.contains("Save & Exit").click();
    if (isCourtReferenceChanged) {
      cy.wait("@editClientCall").then(({response}) => {
        expect(response.statusCode).to.be.eq(200);
        cy.wrap(response.body.caseRecNumber).as("newCourtReference");
      });
    }
  });
};

beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient();
  cy.get("@client").then(({id, firstname, surname}) => {
    cy.visit(`/supervision/#/clients/${id}/edit`);
    cy.contains(`Edit Client: ${firstname} ${surname}`);
  });
});

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
        editClient(true);
        cy.get("@newCourtReference").then((newCourtReference) => {
          cy.get(".title-person-name").contains(`${newFirstName} ${newLastName}`);
          cy.get(".court-reference-value-in-client-summary").contains(
            newCourtReference
          );

          cy.get(".TABS_CLIENT_SUMMARY").click();
          cy.get(".client-summary-full-name-value").contains(
            `${newFirstName} ${newLastName}`
          );
          cy.get(".client-summary-court-reference-value").contains(
            newCourtReference
          );
          cy.get(".client-summary-memorable-phrase-value").contains(
            memorablePhrase
          );

          cy.get(".TABS_TIMELINELIST").click();

          cy.get(".timeline-event-title", { timeout: 30000 }).should(
            "contain",
            "Client edited"
          );

          cy.get("timeline-generic-changeset")
            .first()
            .within(() => {
              cy.get("@client").then(({ caseRecNumber, firstname, surname }) => {
                cy.contains(`First name changed from ${firstname} to ${newFirstName}`);
                cy.contains(`Last name changed from ${surname} to ${newLastName}`);
                cy.contains(`Memorable phrase set to ${memorablePhrase}`);
                cy.contains(`Court reference changed from ${caseRecNumber} to ${newCourtReference}`);
              });
            });
        });
    }
  );
});
