describe("Link donors", { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs("LPA Manager");
    cy.createDonor().then(({ id }) => {
      cy.wrap(id).as("primaryDonorId");
    });
    cy.createDonor().then(({ uId }) => {
      cy.wrap(uId).as("secondaryDonorUid");
    });
  });

  it("should link 2 donors", function () {
    cy.intercept({
      method: "GET",
      url: `/*/v1/persons/${this.primaryDonorId}`,
    }).as("donorRequest");

    cy.intercept({ method: "GET", url: `/*/v1/persons/*/events*` }).as(
      "eventsRequest"
    );

    cy.visit(`/lpa/#/person/${this.primaryDonorId}`);

    cy.wait("@donorRequest");
    cy.wait("@eventsRequest");

    cy.contains("Workflow").click();
    cy.contains("Link Record").click();

    cy.get(".action-widget-content").within(() => {
      cy.get("#personUid").type(`${this.secondaryDonorUid}{enter}`);

      cy.contains("Make the active person primary").click();

      cy.contains("button", "Link").click();
    });

    cy.wait("@eventsRequest");

    cy.get(".timeline").contains(
      ".timeline-event h2",
      "Person (Create / Edit)"
    );

    cy.get(".timeline").contains(
      ".timeline-event p",
      "Primary record was linked to child record"
    );
  });
});
