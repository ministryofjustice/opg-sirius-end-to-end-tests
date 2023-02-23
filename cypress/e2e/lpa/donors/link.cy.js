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
    cy.visit(`/lpa/#/person/${this.primaryDonorId}`);
    cy.waitForStableDOM();

    cy.contains("Workflow").click();
    cy.contains("Link Record").click();

    cy.waitForIframe(".action-widget-content iframe", { selector: "#f-uid" });
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().find("#f-uid").type(`${this.secondaryDonorUid}{enter}`);
    });

    cy.waitForIframe(".action-widget-content iframe", { selector: "button", content: "Link records" });
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody()
        .find(`input[name="primary-id"][value="${this.primaryDonorId}"]`)
        .click();
      getBody().contains("button", "Link records").click();
    });

    cy.contains(".timeline .timeline-event h2", "Person (Create / Edit)");
    cy.contains(".timeline-event", "Primary record was linked to child record");
  });
});
