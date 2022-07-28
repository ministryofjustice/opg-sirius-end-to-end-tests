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
          cy.visit(donorLinkUrl);

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
    cy.createDonor().then(({ id }) => {
      cy.wrap(id).as("donorId");
    });
  });

  it("should change the donors firstname", function () {
    cy.visit(`/lpa/#/person/${this.donorId}`);
    cy.intercept({ method: "GET", url: "/*/v1/persons/*" }).as("personRequest");

    cy.wait("@personRequest");

    cy.contains("Edit Donor").click();
    cy.get(".action-widget-content").within(() => {
      cy.get("#firstname0").clear().type("Patrick");
      cy.contains("Save and Exit").click();
    });

    cy.wait("@personRequest");

    cy.get(".timeline-event")
      .contains("First name: Bob changed to: Patrick", { timeout: 20000 })
      .should("be.visible");
  });
});
