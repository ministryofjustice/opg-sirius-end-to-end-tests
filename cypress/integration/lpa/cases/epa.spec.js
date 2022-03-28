describe("Create EPA", { tags: ["@lpa", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("LPA Manager");
    cy.createDonor().then(({ id }) => {
      cy.wrap(id).as("donorId");
    });
  });

  it("should create an EPA", function () {
    cy.visit(`/lpa/#/person/${this.donorId}`);

    cy.contains("Create EPA Case").click();

    cy.get(".action-widget-content").within(() => {
      cy.get("#epaDonorSignatureDate0").type("21/09/2007");
      cy.get("#epaDonorNoticeGivenDate0").type("21/09/2007", { force: true });

      cy.contains(
        "To your knowledge, has the donor made any other Enduring Powers of Attorney?"
      )
        .closest("fieldset")
        .contains("Yes")
        .click({ force: true });

      cy.contains("Save and Exit").click();
    });

    cy.contains(".case-tile-status", "Pending");

    cy.get(".task-list-task").contains("Create physical case file");
    cy.get(".task-list-task").contains("Allocate case to case worker");

    cy.get(".warnings").contains(
      ".warning-item h3",
      "EPA Case. Do not contact donor"
    );

    cy.url().as("epaUrl");
  });

  it("should add an attorney to the EPA", function () {
    cy.intercept({ method: "GET", url: "/api/v1/persons/*/events*" }).as(
      "eventsRequest"
    );
    cy.visit(this.epaUrl);

    cy.wait("@eventsRequest");
    cy.contains(".case-tile-status", "Pending");

    cy.contains("Edit Case").click();

    cy.get(".action-widget-content").within(() => {
      cy.contains("Case actors").click();
      cy.contains("Add an Attorney").click();

      cy.get(".case-actor")
        .contains("h3", "Attorney")
        .closest(".case-actor")
        .within(() => {
          cy.get("#salutation0").type("Rev");
          cy.get("#firstname0").type("Ozie");
          cy.get("#surname0").type("Omelia");
          cy.contains("Save").click();
        });

      cy.contains("Save and Exit").click();
    });

    cy.wait("@eventsRequest");

    cy.get(".timeline").contains(".timeline-event h2", "Attorney");

    cy.get(".opg-icon").contains("CasePeople").click({ force: true });

    cy.get(".person-info")
      .contains("Attorney")
      .closest("person-list-item")
      .contains("Rev Ozie Omelia");
  });
});
