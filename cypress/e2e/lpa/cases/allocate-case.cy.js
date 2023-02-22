describe("Allocate case", { tags: ["@lpa", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("LPA Manager");
    cy.createDonor().then(({ id: donorId }) => {
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.visit(`/lpa/#/person/${donorId}/${lpaId}`);
        cy.waitForStableDOM();
      });
    });
  });

  it("should allocate the LPA", function () {
    cy.intercept({ method: "GET", url: "/*/v1/persons/*/events*" }).as(
      "eventsRequest"
    );

    cy.get(".case-tile-status").contains("Pending");

    cy.get("#Workflow").click();
    cy.contains("Allocate Case").click();

    cy.frameLoaded(".action-widget-content iframe");
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().find("#f-assignTo-2").check();
      getBody().find("#f-assigneeTeam").select("Complaints Team");
      getBody().find("button[type=submit]").click();
    });

    cy.wait("@eventsRequest");

    cy.get(".timeline .timeline-event", { timeout: 10000 });
    cy.contains(
      ".timeline-event",
      "Case was assigned to !Manager Team now assigned to Complaints Team"
    );
  });
});
