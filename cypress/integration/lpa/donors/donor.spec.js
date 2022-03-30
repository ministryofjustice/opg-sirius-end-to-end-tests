describe("Create Donor", { tags: ["@lpa", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("Case Manager");
    cy.visit('/lpa/home');
  });

  it("should create a new donor", function () {
    cy.intercept({ method: 'GET', url: '/api/v1/assignees/*/tasks*' }).as('tasksRequest');
    cy.wait('@tasksRequest');

    cy.get("uib-tab-heading[id=Timeline]").contains("Timeline").click();
    cy.contains("Create Donor").click();

    cy.get(".action-widget-content").within(() => {
      cy.get("#firstname0").type("Spongebob");
      cy.get("#surname0").type("Squarepants");
      cy.contains("Save and Exit").click();
    });

    cy.contains(/Person (\d+(-|)){3} was created/).click();

    cy.get('.timeline .timeline-event', { timeout: 10000 });
    cy.get(".timeline-event").last().should("contain", "Person (Create / Edit)");
    cy.get(".timeline-event").last().should("contain", "Spongebob Squarepants");
  });
});

describe("Edits a Donor", { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs("Case Manager");
    cy.createDonor().then(({ id }) => {
      cy.wrap(id).as("donorId");
    });
  });

  it("should change the donors firstname", function () {
    cy.visit(`/lpa/#/person/${this.donorId}`);
    cy.intercept({ method: 'GET', url: '/api/v1/persons/*' }).as('personRequest');

    cy.wait('@personRequest');

    cy.contains("Edit Donor").click();
    cy.get(".action-widget-content").within(() => {
      cy.get("#firstname0").clear().type("Patrick");
      cy.contains("Save and Exit").click();
    });

    cy.wait('@personRequest');

    cy.get('.timeline .timeline-event', { timeout: 10000 });
    cy.get(".timeline-event").first().should("contain", "First name: Bob changed to: Patrick");
  });
});
