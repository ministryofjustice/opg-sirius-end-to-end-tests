import * as path from "path";
describe(
  "Successfully replacing a document in supervision",
  { tags: ["@supervision", "@replace-document"] },
  () => {
    before(() => {
      cy.loginAs("Allocations User");
      cy.createClient();
    });

    it("can replace a document on an event", () => {
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

      cy.get('.TABS_DOCUMENTS').click();
      cy.get('.summary-row > :nth-child(2)').should('contain.text', 'niceFile.txt');
      cy.get('.summary-row > :nth-child(2)').should('contain.text', 'Call');
      cy.get('.summary-row > :nth-child(2)').should('contain.text', 'Outbound');
      cy.get('.summary-row > :nth-child(5)').should('contain.text', 'Replace');
      cy.get('span > .button').click();

      cy.get('.replace-document-title').should('be.visible');
      cy.get('text-field.disabled > .fieldset > label').should('contain.text', 'File being replaced');

      cy.waitForTinyMCE()
        .enterText('A good reason to change the document.');

      cy.get('[name="fIELDLABELSREPLACEDOCUMENTFILE"]').selectFile('cypress/fixtures/document/replacedFile.txt');
      cy.get("input[name=fIELDLABELSDOCUMENTNAME]").should("be.visible").type("A".repeat(256))
      cy.contains("Save & exit").click();

      cy.get(".validation-summary").should("be.visible")
        .and("contain.text", "There is a problem")
        .and("contain.text", "Document name - The input is more than 255 characters long")
      cy.get("input[name=fIELDLABELSDOCUMENTNAME]").clear()
      cy.contains("Save & exit").click();

      cy.get('.TABS_DOCUMENTS').click();
      cy.get('.summary-row > :nth-child(2)').should('contain.text', 'replacedFile.txt');
      cy.get('.summary-row > :nth-child(2)').should('contain.text', 'Call');
      cy.get('.summary-row > :nth-child(2)').should('contain.text', 'Outbound');
      cy.get('.summary-row > :nth-child(2)').should('not.contain.text', 'niceFile.txt');
      cy.get('.summary-row > :nth-child(3)').should('contain.text', 'Replaced date');

      cy.get('.TABS_TIMELINELIST').click();
      cy.get('.event-replaced-document-file > .section-content > .wrapper > .title > h2').should('contain.text', 'Document replaced');
      cy.get('.event-replaced-document-file > .section-content').should('contain.text', 'A document has been replaced');
      cy.get('.event-replaced-document-file > .section-content').should('contain.text', 'replacedFile.txt');
      cy.get('.event-replaced-document-file > .section-content').should('contain.text', 'A good reason to change the document');
    });
  });
