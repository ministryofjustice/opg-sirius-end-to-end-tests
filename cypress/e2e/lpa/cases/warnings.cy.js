describe("Warnings on a case", { tags: ["@lpa", "@smoke-journey"] }, () => {
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

  it("should create a warning on the case", () => {
    cy.contains("Create Warning").click();

    cy.waitForIframe(".action-widget-content iframe", { selector: "#f-warningType" });
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().find("#f-warningType").select("Fee Issue");
      getBody().find("#f-warningText").type("This is a big problem");
      getBody().find("button[type=submit]").click();
    });

    cy.contains(".warning-item", "Fee Issue").should(
      "contain",
      "This is a big problem"
    );
    cy.contains(".timeline-event", "Fee Issue").should(
      "contain",
      "This is a big problem"
    );
  });

  it("should remove a warning on a case", () => {
    cy.contains("Remove warning").click();
    cy.get(".remove-warning-modal").contains("Fee Issue");
    cy.get(".remove-warning-modal").contains("Applied to");
    cy.get(".remove-warning-modal").contains("This is a big problem");
    cy.get(".remove-warning-modal").contains("Remove warning").click();

    cy.contains(".warnings", "No warnings in place");
    cy.contains(".timeline-event", "Warning removed by atwo manager");
  });
});


describe("Warnings on the donor", { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs("LPA Manager");
    cy.createDonor().then(({ id: donorId, uId: donorUid }) => {
      cy.wrap(donorUid).as("donorUid");
      cy.wrap(`/lpa/#/person/${donorId}`).as("url");
    });
  });

  beforeEach(function () {
    cy.loginAs("LPA Manager");
    cy.visit(this.url);
    cy.waitForStableDOM();
    cy.get(".person-panel-details").contains(this.donorUid);
  });

  it("should create a warning on the donor record", () => {
    cy.contains("Create Warning").click();

    cy.waitForIframe(".action-widget-content iframe", { selector: "#f-warningType" });
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().find("#f-warningType").select("Fee Issue");
      getBody().find("#f-warningText").type("This is a big problem");
      getBody().find("button[type=submit]").click();
    });

    cy.contains(".warning-item", "Fee Issue").should(
      "contain",
      "This is a big problem"
    );
    cy.contains(".timeline-event", "Fee Issue").should(
      "contain",
      "This is a big problem"
    );
  });

  it("should remove a warning on the donor record", () => {
    cy.contains("Remove warning").click();
    cy.get(".remove-warning-modal").contains("Fee Issue");
    cy.get(".remove-warning-modal").contains("This is a big problem");
    cy.contains(".remove-warning-modal", "Applied to:").should('not.exist');
    cy.get(".remove-warning-modal").contains("Remove warning").click();

    cy.contains(".warnings", "No warnings in place");
    cy.contains(".timeline-event", "Warning removed by atwo manager");
  });
});
