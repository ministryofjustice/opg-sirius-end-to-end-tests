describe("Create Donor", { tags: ["@lpa", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("Case Manager");
    cy.visit('/lpa/home');
  });

  it("should create a new donor", function () {
    cy.get("uib-tab-heading[id=Timeline]").contains("Timeline").click();
    cy.contains("Create Donor").click();

    cy.get(".action-widget-content").within(() => {
      cy.get("#firstname0").type("Spongebob");
      cy.get("#surname0").type("Squarepants");
      cy.contains("Save and Exit").click();
    });

    cy.contains(/Person (\d+(-|)){3} was created/).click();
    cy.get(".timeline-event").last().should("contain", "Spongebob Squarepants");
    cy.get(".timeline-event").last().should("contain", "Person (Create / Edit)");
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
    cy.contains("Edit Donor").click();

    cy.get(".action-widget-content").within(() => {
      cy.get("#firstname0").clear().type("Patrick");
      cy.contains("Save and Exit").click();
    });

    cy.get(".timeline-event").first().should("contain", "First name: Bob changed to: Patrick");
  });
});
