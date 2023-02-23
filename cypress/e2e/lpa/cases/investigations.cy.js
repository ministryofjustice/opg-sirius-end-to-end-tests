describe("Create an investigation", { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs("System Admin");
    cy.createDonor().then(({ id: donorId, uId: donorUid }) => {
      cy.wrap(donorUid).as("donorUid");
      cy.createLpa(donorId).then(({ id: lpaId, uId: lpaUid }) => {
        cy.wrap(lpaUid).as("lpaUid");
        cy.visit(`/lpa/#/person/${donorId}/${lpaId}`);
      });
    });
  });

  it("should create an investigation on the LPA", function () {
    cy.get(".person-panel-details").contains(this.donorUid);
    cy.get(".case-tile-container .case").contains(this.lpaUid);

    cy.waitForStableDOM();
    cy.contains("Add Investigation").click();

    cy.waitForIframe(".action-widget-content iframe", { selector: "#f-title" });
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().find("#f-title").type("test title");
      getBody().find("#f-information").type("some test info");
      getBody().find("#f-type").check();
      getBody().find("#f-dateReceived").type("2022-04-06");
      getBody().find("button[type=submit]").click();
    });

    cy.get(".timeline .timeline-event", { timeout: 10000 });
    cy.contains(".timeline-event", "Investigation")
      .should("contain", "test title")
      .should("contain", "some test info")
      .should("contain", "Aspect")
      .should("contain", "Investigation received on 06/04/2022");
  });
});

describe("Put investigation on hold", { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs("System Admin");
    cy.createDonor().then(({ id: donorId }) => {
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.visit(`/lpa/#/person/${donorId}/${lpaId}`);
        cy.createInvestigation(lpaId);
      });
    });
  });

  it("should put an investigation on hold", function () {
    cy.waitForStableDOM();
    cy.get(".investigation-item").contains("Objections").click();

    cy.waitForIframe(".action-widget-content iframe", { content: "testing title" });
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().contains("testing title")
      getBody().contains("Aspect")
      getBody().contains("10/04/2022")
      getBody().find("#f-reason").check();
      getBody().find("button[type=submit]").click();
    });

    cy.get(".timeline .timeline-event", { timeout: 10000 });
    cy.contains(".timeline-event", "Hold Period")
      .should("contain", "Investigation placed on hold");
  });
});

describe("Take investigation off hold", { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs("System Admin");
    cy.createDonor().then(({ id: donorId }) => {
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.visit(`/lpa/#/person/${donorId}/${lpaId}`);
        cy.createInvestigation(lpaId).then(({ id: investigationId }) => {
          cy.putInvestigationOnHold(investigationId);
        });
      });
    });
  });

  it("should take an investigation off hold", function () {
    cy.waitForStableDOM();
    cy.get(".investigation-item").contains("Objections").click();

    cy.waitForIframe(".action-widget-content iframe", { content: "testing title" });
    cy.enter(".action-widget-content iframe").then((getBody) => {
      getBody().contains("testing title")
      getBody().contains("Aspect")
      getBody().contains("10/04/2022")
      getBody().contains("Police Investigation")
      getBody().find("button[type=submit]").click();
    });

    cy.get(".timeline .timeline-event", { timeout: 10000 });
    cy.contains(".timeline-event", "Hold Period")
      .should("contain", "Investigation taken off hold");
  });
});
