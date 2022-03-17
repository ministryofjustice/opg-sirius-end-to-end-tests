describe("Documents", { tags: ["@lpa", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.intercept({ method: 'GET', url: '/api/v1/persons/*/cases' }).as('casesRequest');
    cy.intercept({ method: 'GET', url: '/api/v1/templates/lpa' }).as('templatesRequest');
    cy.intercept({ method: 'GET', url: '/api/v1/lpas/*/draft-count' }).as('draftRequest');
    cy.intercept({ method: 'POST', url: '/api/v1/lpas/*/documents' }).as('documentsRequest');
    cy.intercept({ method: 'GET', url: '/api/v1/persons/*/events?*' }).as('eventsRequest');

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

    cy.frameLoaded('.tox-edit-area__iframe');
    cy.enter(".tox-edit-area__iframe").then(getBody => {
      getBody().should('contain', 'Dear Sponge');
      getBody().should('contain', 'explanations of any transactions that are not detailed in their financial records');
    });
  });

  it("should publish and compare documents", function() {
    cy.createDraft(this.donorId, this.lpaId);

    cy.visit(`/lpa/#/person/${this.donorId}/${this.lpaId}`);
    cy.wait(["@casesRequest", "@eventsRequest"]);
    cy.wait("@draftRequest");

    cy.get("#RetrieveDraft").click();

    cy.frameLoaded('.tox-edit-area__iframe');
    cy.enter(".tox-edit-area__iframe").then(getBody => {
      getBody().should('contain', 'Dear Sponge');
      getBody().should('contain', 'explanations of any transactions that are not detailed in their financial records');
    });

    cy.contains("Publish Draft").click();
    cy.wait("@documentsRequest");
    cy.wait("@eventsRequest");

    cy.contains(".timeline-event", "Bob Sponge - Letter to attorney - LPA");

    cy.get("button[title='Documents associated to this case']").click();
    cy.get(".document-list tbody tr:first-child").click();

    cy.frameLoaded('.doc-viewer iframe');
    cy.contains("button", "Compare").click();

    cy.get(".document-table tbody tr:first-child td:first-child a").click();
    cy.frameLoaded('.doc-viewer:last-child iframe');
  });
});
