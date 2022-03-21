describe("Documents", { tags: ["@lpa", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.intercept({ method: "GET", url: "/api/v1/persons/*/cases" }).as("casesRequest");
    cy.intercept({ method: "GET", url: "/api/v1/templates/lpa" }).as("templatesRequest");
    cy.intercept({ method: "GET", url: "/api/v1/lpas/*/draft-count" }).as("draftCountRequest");
    cy.intercept({ method: "POST", url: "/api/v1/lpas/*/documents" }).as("documentsRequest");
    cy.intercept({ method: "GET", url: "/api/v1/lpas/*/documents" }).as("getDocumentRequest");
    cy.intercept({ method: "POST", url: "/api/v1/lpas/*/documents/draft" }).as("draftRequest");
    cy.intercept({ method: "GET", url: "/api/v1/persons/*/events?*" }).as("eventsRequest");
    cy.intercept({ method: "GET", url: "/api/v1/persons/*/documents?*" }).as("documentsListRequest");
    cy.intercept({ method: "HEAD", url: "/api/v1/documents/*/download" }).as("documentDownloadRequest");
    cy.intercept({ method: "GET", url: "/api/v1/documents/*" }).as("documentGetRequest");

    cy.loginAs("LPA Manager");
    cy.createDonor().then(({ id: donorId }) => {
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.wrap(donorId).as("donorId");
        cy.wrap(lpaId).as("lpaId");
      });
    });
  });

  it("should create a draft with an insert", function() {
    cy.visit(`/lpa/#/person/${this.donorId}/${this.lpaId}`);
    cy.wait("@casesRequest");

    cy.get("#CreateDocument").click();
    cy.wait("@templatesRequest");

    cy.get(".typeahead").type("LPA");
    cy.contains("IT-AT-LPA").click();
    cy.contains("IT-11").click();
    cy.contains("label", "Bob Sponge").children("input").check();
    cy.contains("Generate").click();
    cy.wait("@draftRequest");

    cy.frameLoaded(".tox-edit-area__iframe");
    cy.enter(".tox-edit-area__iframe").then(getBody => {
      getBody().should("contain", "Dear Sponge");
      getBody().should("contain", "explanations of any transactions that are not detailed in their financial records");
    });
  });
});
