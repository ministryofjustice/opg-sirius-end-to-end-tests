describe("Complaints", { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs("LPA Manager");
    cy.createDonor().then(({ id: donorId, uId: donorUid }) => {
      cy.wrap(donorUid).as("donorUid");
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.visit(`/lpa/#/person/${donorId}/${lpaId}`);
      });
    });
  });

  it("should add and edit a complaint", function () {
    cy.waitForStableDOM();

    cy.get(".person-panel-details").contains(this.donorUid);
    cy.get("#AddComplaint").click();

    cy.waitForIframe(".action-widget-content iframe", { selector: "#f-severity" });
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().find("#f-severity").click();
      getBody().find("#f-summary").type("Hey");
      getBody().find("#f-description").type("You know");
      getBody().find("#f-receivedDate").type("2022-04-05");
      getBody().find("button[type=submit]").click();
    });

    cy.contains(".timeline-event", "Complaint").should("contain", "You know");

    cy.contains(".complaint-item", "Minor: Hey")
      .should("contain", "You know")
      .find("h3")
      .click();

    cy.waitForIframe(".action-widget-content iframe", { selector: "#f-resolution" });
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().find("#f-resolution").click();
      getBody().find("#f-resolutionDate").type("2020-01-01");
      getBody().find("#f-investigatingOfficer").type("Test Officer");
      getBody().find("#f-complainantName").type("Test Complainant");
      getBody().find("#f-category-01").click();
      getBody().find("#f-subCategory-01").select("General Query");
      getBody().find("#f-complainantCategory").select("LPA donor");
      getBody().find("#f-origin").select("Phone call");
      getBody().find("#f-resolutionDate").type("2020-01-01");
      getBody().find("button[type=submit]").click();
    });

    cy.contains(".complaint-item", "Minor: Hey")
      .should("contain", "You know")
      .should("contain", "complaint upheld on 01/01/2020");
  });
});
