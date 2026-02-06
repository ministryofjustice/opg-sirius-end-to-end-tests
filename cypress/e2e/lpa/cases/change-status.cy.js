before(() => {
  cy.loginAs("LPA Manager");
  cy.createDonor().then(({ id: donorId }) => {
    cy.createLpa(donorId).then(({ id: lpaId }) => {
      cy.wrap(donorId).as("donorId");
      cy.wrap(lpaId).as("lpaId");
    });
  });
});

describe("Change LPA status", { tags: ["@lpa", "@smoke-journey"] }, () => {
  it("should change an LPA status", function () {
    cy.visit(`/lpa/#/person/${this.donorId}/${this.lpaId}`);
    cy.waitForStableDOM();

    cy.get(".case-tile-status").contains("Pending");

    // cy.contains("LPA (Create / Edit)");

    cy.contains("Change Status").click();
    cy.waitForIframe(".action-widget-content iframe", { selector: '#f-status' });
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().find("#f-status").select("Perfect");
      getBody().contains("button", "Submit").click();
    });

    cy.contains(".case-tile-status", "Perfect");

    // cy.get(".timeline-event").first().contains("h2", "LPA (Create / Edit)");
    // cy.get(".timeline-event").first().contains("p", "Status changed from Pending to Perfect");
  });
});
