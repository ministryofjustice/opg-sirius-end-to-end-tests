describe("Create a task", { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs("LPA Manager");
    cy.createDonor().then(({ id: donorId }) => {
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.visit(`/lpa/#/person/${donorId}/${lpaId}`);
      });
    });
  });

  it("should show the task", () => {
    cy.intercept({ method: "GET", url: "/*/v1/persons/*/cases" }).as(
      "casesRequest"
    );

    cy.get(".case-tile-status").contains("Pending");

    cy.waitForStableDOM();
    cy.contains("New Task").click();

    cy.waitForIframe(".action-widget-content iframe", { selector: "#f-taskType" });
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().find("#f-taskType").select("Change of Address");
      getBody().find("#f-name").type("Donor has moved");
      getBody().find("#f-description").type("New address is somewhere else");
      getBody().find("#f-assignTo-2").check();
      getBody().find("#f-assigneeTeam").select("Complaints Team");
      getBody().find("#f-dueDate").type("9999-01-01");
      getBody().find("button[type=submit]").click();
    });

    cy.wait("@casesRequest");

    cy.get(".task-list", { timeout: 10000 });
    cy.contains(".task-list-task", "Donor has moved")
      .should("contain", "Change of Address")
      .should("contain", "Assigned to Complaints Team")
      .should("contain", "To be completed by 01 January 9999");

    cy.get(".timeline .timeline-event", { timeout: 10000 });
    cy.contains(".timeline-event", "Change of Address")
      .should("contain", "now assigned to Complaints Team")
      .should("contain", "Donor has moved — New address is somewhere else");
  });
});

describe("Complete a task", { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs("LPA Manager");
    cy.createDonor().then(({ id: donorId }) => {
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.visit(`/lpa/#/person/${donorId}/${lpaId}`);
        cy.waitForStableDOM();
      });
    });
  });

  it("a task completed timeline event is recorded", () => {
    cy.get(".task-list").scrollIntoView();
    cy.get(".task-list").contains("Complete Create physical case file").as("taskButton");
    cy.get("@taskButton").click();
    cy.contains("Yes, confirm").as("confirmButton");
    cy.get("@confirmButton").click();
    cy.contains(".timeline-event", "Create physical case file Completed");
  });
});

describe("Reassign a task", { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs("LPA Manager");
    cy.createDonor().then(({ id: donorId }) => {
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.visit(`/lpa/#/person/${donorId}/${lpaId}`);
        cy.waitForStableDOM();
      });
    });
  });

  it("a task reassign timeline event is recorded", () => {
    cy.get(".task-list").scrollIntoView().then(() => {
      cy.contains(
        ".task-actions .icon-button",
        "Allocate Create physical case file"
      ).as("allocateButton");
      cy.get("@allocateButton").click();
    });

    cy.waitForIframe(".action-widget-content iframe", { content: "Create physical case file" });
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().should("contain", "Create physical case file");
      getBody().contains("label", "Team").parent().find("input").check();
      getBody().find("#f-assigneeTeam").select("Card Payment Team");
      getBody().find("button[type=submit]").click();
    });

    cy.contains(
      ".timeline-event",
      "Task was assigned to File Creation Team now assigned to Card Payment Team"
    );
    cy.contains(".task-list", "Assigned to Card Payment Team");
  });
});
