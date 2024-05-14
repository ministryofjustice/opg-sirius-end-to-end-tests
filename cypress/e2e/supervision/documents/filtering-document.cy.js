describe(
  "Viewing the documents tab for the client",
  { tags: ["@supervision", "@replace-document"] },
  () => {
    it("filtering the documents tab for the client", () => {
      cy.loginAs("Allocations User");
      cy.createClient();
      cy.loginAs("Case Manager");
      cy.get("@client").then(({ id }) => {
        cy.visit(`/supervision/#/clients/${id}`);
      });
      cy.get('[id="create-event-button"]').click();

      cy.get('[name="fIELDLABELSNOTEFILE"]').selectFile('cypress/fixtures/document/niceFile.txt');
      cy.get('[name="fIELDLABELSNOTETYPE"]').should('be.visible');
      cy.get('[name="fIELDLABELSNOTETYPE"]').select('Call', { force: true });
      cy.get("input[type=radio][data-core-value=OUTGOING]").check({ force: true }).should('be.checked')
      cy.contains("Save & exit").click();

      cy.get('[id="create-event-button"]').click();

      cy.get('[name="fIELDLABELSNOTEFILE"]').selectFile('cypress/fixtures/document/niceFile.txt');
      cy.get('[name="fIELDLABELSNOTETYPE"]').should('be.visible');
      cy.get('[name="fIELDLABELSNOTETYPE"]').select('Order', { force: true });
      cy.get("input[type=radio][data-core-value=OUTGOING]").check({ force: true }).should('be.checked')
      cy.contains("Save & exit").click();


      cy.get('#tab-container').contains('Documents').click();
      cy.get('document-list-item').find('.tab-table').should('have.length', 2);

      cy.get('.filter-check-button').contains('Order').click();
      cy.get('.button').contains('Apply').click();
      cy.get('document-list-item').find('.tab-table').should('have.length', 1);
    });
  });
