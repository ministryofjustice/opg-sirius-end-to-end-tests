describe("Create a relationship", { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs("LPA Manager");
    cy.createDonor().then(({ id: donorId, uId: donorUid }) => {
      cy.createDonor().then(({ uId: otherDonorUid }) => {
        cy.createLpa(donorId).then(({ id: lpaId }) => {
          cy.waitUntil(
            () =>
              cy
                .postToApi("/api/v1/search/persons", {
                  personTypes: ["Donor"],
                  term: otherDonorUid,
                })
                .then((resp) => resp.body.total.count === 1),
            { timeout: 10000, interval: 500 }
          );

          cy.visit(`/lpa/#/person/${donorId}/${lpaId}`);
          cy.wrap(donorUid).as("donorUid");
          cy.wrap(otherDonorUid).as("otherDonorUid");
        });
      });
    });
  });

  it("should show the relationship", function () {
    cy.waitForStableDOM();

    cy.get(".person-panel-details").contains(this.donorUid);
    cy.get("#Workflow").click();
    cy.contains("Create Relationship").click();

    cy.waitForIframe(".action-widget-content iframe", { selector: '#f-search' });
    cy.enter(".action-widget-content iframe").then((getBody) => {
      cy.get("@otherDonorUid").then((uid) => {
        getBody().find("#f-search").type(uid);
        getBody().find(".autocomplete__menu").contains("Bob Sponge").click();
        getBody().find("#f-reason").type("Sponge");
        getBody().find("button[type=submit]").click();
      });
    });

    cy.contains(
      ".case-summary",
      "This donor has a link with Bob Sponge (Sponge)"
    );
  });
});
