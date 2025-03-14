describe(
  "Viewing a document in the documents tab for the client",
  { tags: ["@supervision", "@deleting-document"] },
  () => {

    beforeEach(() => {
      cy.loginAs("Allocations User");
      cy.createClient();
      cy.loginAs("Public API");
      cy.uploadDocument();
    })

    it("allows document to be viewed with PDF viewer", () => {
      cy.loginAs("System Admin");
      cy.get("@client").then(({ id }) => {
        cy.visit(`/supervision/#/clients/${id}`);
      });

      cy.get('#tab-container').contains('Documents').click();
      cy.get('document-list-item').find('.tab-table').should('have.length', 1);
      cy.get('.multi-document-viewer').contains("TEST.pdf").click();

      cy.get('.document-viewer__iframe').should('be.visible');
      cy.iframe('.document-viewer__iframe').find('.endOfContent').should('exist');
      cy.iframe('.document-viewer__iframe').contains("TEST");
    });
  });
