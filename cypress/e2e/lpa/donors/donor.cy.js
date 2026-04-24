describe("Create Donor", { tags: ["@lpa", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("Case Manager");
    cy.visit("/lpa/home");
    cy.waitForStableDOM();
  });

  it("should create a new donor", function () {
    cy.get("uib-tab-heading[id=Timeline]").contains("Timeline").click();
    cy.contains("Create Donor").click();

    cy.waitForIframe(".action-widget-content iframe", { selector: "#f-firstname" });
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().find("#f-firstname").type("Spongebob");
      getBody().find("#f-surname").type("Squarepants");
      getBody().find("button[type=submit]").click();
    });

    cy.waitForIframe(".action-widget-content iframe", { content: "View donor" });
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().contains(/Person (\d+(-|)){3} was created/);

      getBody()
        .contains("a", "View donor")
        .invoke("attr", "href")
        .then((donorLinkUrl) => {
          cy.visit(
            donorLinkUrl.replace(
              /https?:\/\/localhost:8080/,
              Cypress.config("baseUrl")
            )
          );

          // cy.get(".timeline .timeline-event", { timeout: 10000 });
          // cy.contains(".timeline-event", "Person (Create / Edit)").should(
          //   "contain",
          //   "Spongebob Squarepants"
          // );
        });
    });
  });
});
