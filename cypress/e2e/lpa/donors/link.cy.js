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

    cy.frameLoaded(".action-widget-content iframe");
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().find("#f-uid").type(`${this.secondaryDonorUid}{enter}`);
    });

    cy.wait(3000);
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody()
        .find(`input[name="primary-id"][value="${this.primaryDonorId}"]`)
        .click();
      getBody().contains("button", "Link records").click();
    });

    cy.wait("@eventsRequest");

    cy.get(".timeline").contains(
      ".timeline-event h2",
      "Person (Create / Edit)"
    );

    cy.contains(".timeline-event", "Primary record was linked to child record");
  });
});
