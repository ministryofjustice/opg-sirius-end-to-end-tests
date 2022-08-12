describe(
  "LPA administration changes",
  { tags: ["@lpa", "@smoke-journey"] },
  () => {
    beforeEach(() => {
      cy.loginAs("System Admin");
      cy.createDonor().then(({ id: donorId }) => {
        cy.createLpa(donorId).then(({ id: lpaId }) => {
          cy.wrap(donorId).as("donorId");
          cy.wrap(lpaId).as("lpaId");
        });
      });
    });

    it("should change the LPA receipt date", function () {
      cy.visit(`/lpa/#/person/${this.donorId}/${this.lpaId}`);

      cy.intercept({ method: "GET", url: "/*/v1/persons/*/events*" }).as(
        "eventsRequest"
      );
      cy.intercept({ method: "GET", url: "/*/v1/cases/*" }).as("casesRequest");

      cy.get(".case-tile-status").contains("Pending");

      cy.get("uib-tab-heading[id=Administration]")
        .contains("Administration")
        .click();
      cy.contains("Edit Dates").click();

      cy.wait("@casesRequest");

      cy.frameLoaded(".action-widget-content iframe");
      cy.enter(".action-widget-content iframe").then((getBody) => {
        getBody().find("#f-receiptDate").clear().type("2019-04-13");
        getBody().find("button[type=submit]").click();
      });

      cy.wait("@eventsRequest");

      cy.contains(
        ".timeline-event",
        "Receipt date: 02/04/2019 changed to: 13/04/2019"
      );
    });
  }
);

describe("Visit Admin Service", { tags: ["@lpa", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("LPA Manager");
  });

  it("should take user to admin service", function () {
    cy.visit(`/lpa/home`);

    cy.contains("Admin").click();
    assert(cy.contains("Sirius Admin"));
    assert(cy.contains("Personal details"));
    assert(cy.contains("2manager@opgtest.com"));
  });
});
