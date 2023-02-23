describe("Create an event", { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs("LPA Manager");
    cy.createDonor().then(({ id: donorId, uId: donorUid }) => {
      cy.wrap(donorUid).as("donorUid");
      cy.createLpa(donorId).then(({ id: lpaId, uId: lpaUid }) => {
        cy.wrap(lpaUid).as("lpaUid");
        cy.visit(`/lpa/#/person/${donorId}/${lpaId}`);
        cy.waitForStableDOM();
      });
    });
  });

  it("should show the event", function () {
    cy.get(".person-panel-details").contains(this.donorUid);
    cy.get(".case-tile-container .case").contains(this.lpaUid);

    cy.contains("New Event").click();

    cy.frameLoaded(".action-widget-content iframe");
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().find("#f-type").select("Application returned");
      getBody().find("#f-name").type("Sent back");
      getBody().find("#f-description").type("For good reasons");
      getBody().find("button[type=submit]").click();
    });

    cy.get(".timeline .timeline-event", { timeout: 10000 });
    cy.contains(".timeline-event", "Application returned")
      .should("contain", "Sent back")
      .should("contain", "For good reasons");
  });
});
