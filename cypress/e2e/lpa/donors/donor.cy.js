describe("Create Donor", { tags: ["@lpa", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("Case Manager");
    cy.visit("/lpa/home");
  });

  it("should create a new donor", function () {
    cy.intercept({ method: "GET", url: "/*/v1/assignees/*/tasks*" }).as(
      "tasksRequest"
    );
    cy.wait("@tasksRequest");

    cy.get("uib-tab-heading[id=Timeline]").contains("Timeline").click();
    cy.contains("Create Donor").click();

    cy.frameLoaded(".action-widget-content iframe");
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().find("#f-firstname").type("Spongebob");
      getBody().find("#f-surname").type("Squarepants");
      getBody().find("button[type=submit]").click();
    });

    cy.wait(1000);
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

          cy.get(".timeline .timeline-event", { timeout: 10000 });
          cy.contains(".timeline-event", "Person (Create / Edit)").should(
            "contain",
            "Spongebob Squarepants"
          );
        });
    });
  });
});

describe("Edits a Donor", { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs("Case Manager");
    cy.createDonor().then(({ id, uId }) => {
      cy.wrap(id).as("donorId");
      cy.wrap(uId).as("donorUid");
    });
  });

  it("should change the donor's firstname", function () {
    cy.visit(`/lpa/#/person/${this.donorId}`);
    cy.intercept({ method: "GET", url: "/*/v1/persons/*" }).as("personRequest");

    cy.get(".person-panel-details").contains(this.donorUid);

    cy.contains("Edit Donor").click();
    cy.frameLoaded(".action-widget-content iframe");
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().find("#f-firstname").clear().type("Patrick");
      getBody().find("button[type=submit]").click();
    });

    cy.get(".timeline-event")
      .should("contain", "First name: Bob changed to: Patrick", { timeout: 20000 })
      .should("be.visible");
  });
});