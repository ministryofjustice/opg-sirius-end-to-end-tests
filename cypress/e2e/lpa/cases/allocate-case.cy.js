describe("Allocate case", { tags: ["@lpa", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("LPA Manager");
    cy.createDonor().then(({ id: donorId }) => {
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.visit(`/lpa/#/person/${donorId}/${lpaId}`);
      });
    });
  });

  it("should allocate the LPA", function () {
    cy.waitForStableDOM();

    cy.get(".case-tile-status").contains("Pending");

    cy.get("#Workflow").click();
    cy.contains("Allocate Case").click();

    cy.waitForIframe(".action-widget-content iframe", { selector: '#f-assignTo-2' });
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().find("#f-assignTo-2").check();
      getBody().find("#f-assigneeTeam").select("Complaints Team");
      getBody().find("button[type=submit]").click();
    });

    cy.contains(
      ".timeline .timeline-event",
      "Case was assigned to !Manager Team now assigned to Complaints Team"
    );
  });
});
