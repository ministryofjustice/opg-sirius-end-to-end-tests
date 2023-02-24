describe("Timeline", { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs("LPA Manager");
    cy.createDonor().then(({ id: donorId }) => {
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.wrap(donorId).as("donorId");
        cy.wrap(lpaId).as("lpaId");
      });
    });
  });

  it("should filter events", function () {
    cy.visit(`/lpa/#/person/${this.donorId}/${this.lpaId}`);
    cy.waitForStableDOM();

    cy.intercept({ method: "GET", url: "/*/v1/persons/*/events*" }).as(
      "eventsRequest"
    );
    cy.get(".timeline-facets").contains("Task").click();

    cy.wait("@eventsRequest");

    cy.get(".timeline .timeline-event h2").each((h2) => {
      if (!(h2 instanceof HTMLHeadingElement)) return;

      cy.wrap(h2).contains("Task");
    });
  });
});
