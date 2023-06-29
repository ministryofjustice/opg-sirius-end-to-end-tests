describe("Warnings", { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs("LPA Manager");
    cy.createDonor().then(({ id: donorId, uId: donorUid }) => {
      cy.wrap(donorUid).as("donorUid");
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.wrap(`/lpa/#/person/${donorId}/${lpaId}`).as("url");
      });
    });
  });

  beforeEach(function () {
    cy.loginAs("LPA Manager");
    cy.visit(this.url);
    cy.waitForStableDOM();
    cy.get(".person-panel-details").contains(this.donorUid);
  });

  // it("should create a warning", () => {
  //   cy.contains("Create Warning").click();
  //
  //   cy.waitForIframe(".action-widget-content iframe", { selector: "#f-warningType" });
  //   cy.enter(".action-widget-content iframe").then((getBody) => {
  //     getBody().find("#f-warningType").select("Fee Issue");
  //     getBody().find("#f-warningText").type("This is a big problem");
  //     getBody().find("button[type=submit]").click();
  //   });
  //
  //   cy.contains(".warning-item", "Fee Issue").should(
  //     "contain",
  //     "This is a big problem"
  //   );
  //   cy.contains(".timeline-event", "Fee Issue").should(
  //     "contain",
  //     "This is a big problem"
  //   );
  // });

  // it("should remove a warning", () => {
  //   cy.contains("Remove warning").click();
  //   cy.contains(".warnings", "No warnings in place");
  //   cy.contains(".timeline-event", "Warning removed by atwo manager");
  // });
});
