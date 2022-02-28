before(() => {
  cy.loginAs("LPA Manager");
  cy.createDonor().then((donorId) => {
    cy.createLpa(donorId).then((lpaId) => {
      cy.wrap(donorId).as("donorId");
      cy.wrap(lpaId).as("lpaId");
    });
  });
});

describe("Change LPA status", { tags: ["@lpa", "@smoke-journey"] }, () => {
  it("should change an LPA status", function () {
    cy.visit(`/lpa/#/person/${this.donorId}/${this.lpaId}`);

    cy.get(".case-tile-status").contains("Pending");

    cy.contains("LPA (Create / Edit)");

    cy.contains("Change Status").click();
    cy.get("#status0").click();
    cy.get("#status0").contains("Perfect").click();
    cy.contains("Submit").click();

    cy.contains(".case-tile-status", "Perfect");

    cy.get(".timeline-event").first().contains("h2", "LPA (Create / Edit)");
    cy.get(".timeline-event")
      .first()
      .contains("p", "Status changed from Pending to Perfect");
  });
});
