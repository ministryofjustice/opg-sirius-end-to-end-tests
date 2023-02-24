describe("Documents", { tags: ["@lpa", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("LPA Manager");
    cy.createDonor().then(({ id: donorId }) => {
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.wrap(donorId).as("donorId");
        cy.wrap(lpaId).as("lpaId");
      });
    });
  });

  it("should create a draft with an insert", function () {
    cy.visit(`/lpa/#/person/${this.donorId}/${this.lpaId}`);
    cy.waitForStableDOM();

    cy.get("#CreateDocument").click();

    cy.waitForIframe(".action-widget-content iframe", { selector: "#f-templateId" });
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().find("#f-templateId").type("IT-AT-LPA");
      getBody().find(".autocomplete__menu").contains("IT-AT-LPA: Letter to attorney - LPA").click();
      getBody().find("button[type=submit]").click();
    });

    cy.waitForIframe(".action-widget-content iframe", { content: "Select document inserts" });
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().contains("Select document inserts");
      getBody().find( "#f-IT-11-all").click();
      getBody().contains("button", "Continue").click();
    });

    cy.waitForIframe(".action-widget-content iframe", { content: "Select a recipient" });
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().contains("Select a recipient");
      getBody().contains("label", "Bob Sponge");
      getBody().find( "[data-module='recipient-checkbox']").click();
      getBody().contains("button", "Create draft document").click();
    });

    cy.waitForIframe(".action-widget-content iframe", { content: "explanations of any transactions" });
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().contains("textarea", "Dear Sponge");
      getBody().contains("textarea", "explanations of any transactions that are not detailed in their financial records");
    });
  });
});
