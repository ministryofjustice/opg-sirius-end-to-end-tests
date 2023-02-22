describe("Create an investigation", { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs("System Admin");
    cy.createDonor().then(({ id: donorId, uId: donorUid }) => {
      cy.wrap(donorUid).as("donorUid");
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.visit(`/lpa/#/person/${donorId}/${lpaId}`);
      });
    });
  });

  it("should create an investigation on the LPA", function () {
    cy.get(".person-panel-details").contains(this.donorUid);

    cy.contains("Add Investigation").click();

    cy.enterWidgetIframe(() => {
      cy.get("#f-title").type("test title");
      cy.get("#f-information").type("some test info");
      cy.get("#f-type").check();
      cy.get("#f-dateReceived").type("2022-04-06");
      cy.get("button[type=submit]").click();
    }).then(() => {
      cy.get(".timeline .timeline-event", { timeout: 30000 });
      cy.contains(".timeline-event", "Investigation")
        .should("contain", "test title")
        .should("contain", "some test info")
        .should("contain", "Aspect")
        .should("contain", "Investigation received on 06/04/2022");
    });
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
    cy.get(".investigation-item").contains("Objections").click();
    cy.wait(2000);

    cy.enterWidgetIframe(() => {
      cy.contains("testing title")
      cy.contains("Aspect")
      cy.contains("10/04/2022")
      cy.get("#f-reason").check();
      cy.get("button[type=submit]").click();
    }).then(() => {
      cy.get(".timeline .timeline-event", { timeout: 30000 });
      cy.contains(".timeline-event", "Hold Period")
        .should("contain", "Investigation placed on hold");
    });
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
    cy.get(".investigation-item").contains("Objections").click();
    cy.wait(2000);

    cy.enterWidgetIframe(() => {
      cy.contains("testing title");
      cy.contains("Aspect");
      cy.contains("10/04/2022");
      cy.contains("Police Investigation");
      cy.get("button[type=submit]").click();
    }).then(() => {
      cy.get(".timeline .timeline-event", { timeout: 30000 });
      cy.contains(".timeline-event", "Hold Period")
        .should("contain", "Investigation taken off hold");
    });
  });
});
