const suffix = Math.floor(Math.random() * 10000);
const firstName = "Test" + suffix;
const lastName = "Client" + suffix;
const memorablePhrase = "Memorable" + suffix;

const editClient = (isCourtReferenceChanged) => {
  return cy.get("@clientId").then((clientId) => {
    cy.intercept({
      method: "GET",
      url: `/supervision-api/v1/clients/${clientId}`,
    }).as("getClientCall");
    cy.get('input[name="firstName"]').should("have.value", "Ted");
    cy.get('input[name="firstName"]').clear();
    cy.get('input[name="firstName"]').should("not.be.disabled").type(firstName);
    cy.get('input[name="lastName"]').clear();
    cy.get('input[name="lastName"]').should("not.be.disabled").type(lastName);
    cy.get('input[name="memorablePhrase"]').clear();
    cy.get('input[name="memorablePhrase"]').should("not.be.disabled").type(memorablePhrase);
    if (isCourtReferenceChanged) {
      cy.get('input[name="courtReference"]').clear();
      cy.get('input[name="courtReference"]').should("not.be.disabled").type("00000000");
    }
    cy.contains("Save & Exit").click();
    cy.wait("@getClientCall").then(({response}) => {
      expect(response.statusCode).to.be.eq( 200)
      cy.wrap(response.body.caseRecNumber).as('newCourtReference');
    });
  });
}

beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createAClient();
  cy.get("@clientId").then((clientId) => {
    cy.visit(`/supervision/#/clients/${clientId}/edit`);
  });
  cy.contains("Edit Client: Ted Tedson");
});

describe(
  "Edit a client",
  { tags: ["@supervision", "@client", "@smoke-journey"] },
  () => {
    it(
      "Given I'm a Case Manager on Supervision and on the client dashboard page" +
      "Then the Client Dashboard page loads as expected",
      () => {
        editClient(false)
        cy.get(".title-person-name").contains(`${firstName} ${lastName}`);
        cy.get(".TABS_CLIENT_SUMMARY").click();
        cy.get(".client-summary-full-name-value").contains(`${firstName} ${lastName}`);
        cy.get(".client-summary-memorable-phrase-value").contains(memorablePhrase);
      }
    );
  }
);

describe(
  "Edit an existing client smoke journey test",
  { tags: ["@supervision-core", "@client", "@smoke-journey"] },
  () => {
    it(
      "Edits an existing client",
      () => {
        editClient(true)
        cy.get('@newCourtReference').then((newCourtReference) => {
          cy.get(".title-person-name").contains(`${firstName} ${lastName}`);
          cy.get(".court-reference-value-in-client-summary").contains(newCourtReference);

          cy.get(".TABS_CLIENT_SUMMARY").click();
          cy.get(".client-summary-full-name-value").contains(`${firstName} ${lastName}`);
          cy.get(".client-summary-court-reference-value").contains(newCourtReference);
          cy.get(".client-summary-memorable-phrase-value").contains(memorablePhrase);

          cy.get(".TABS_TIMELINELIST").click();

          cy.get(".timeline-event-title", { timeout: 30000 })
            .should("contain", "Client edited");

          cy.get("timeline-generic-changeset").first().within(() => {
            cy.contains('First name changed from Ted to ' + `${firstName}`);
            cy.contains('Last name changed from Tedson to ' + `${lastName}`);
            cy.contains('Memorable phrase set to ' + `${memorablePhrase}`);
            cy.get('@clientCourtReference').then((courtreference) => {
              cy.contains('Court reference changed from ' + courtreference + ' to ' + newCourtReference);
            });
          });
        });
      }
    );
  }
);
