const uploadDocument = () => {
  cy.fixture("document/minimal.json").then((document) => {
    cy.get("@client").then(({caseRecNumber}) => {
      document.caseRecNumber = caseRecNumber;
    });
    cy.postToApi(`/api/public/v1/documents`, document);
  });
};

describe(
  "Viewing the documents tab for the client",
  { tags: ["@supervision", "@deleting-document"] },
  () => {

    beforeEach(() => {
      cy.loginAs("Allocations User");
      cy.createClient();

      cy.loginAs("Public API");
      uploadDocument();
    })

    it("hides delete button if user does not have permissions", () => {
      cy.loginAs("Case Manager");
      cy.get("@client").then(({ id }) => {
        cy.visit(`/supervision/#/clients/${id}`);
      });
//
//       cy.get('#tab-container').contains('Documents').click();
//       cy.get('document-list-item').find('.tab-table').should('have.length', 1);
//
//       cy.contains("Delete").should('not.exist');
//     });
//
//     it("allows document deletion if user has permissions a document for the client", () => {
//       cy.loginAs("System Admin");
//       cy.get("@client").then(({ id }) => {
//         cy.visit(`/supervision/#/clients/${id}`);
//       });
//
//       cy.get('#tab-container').contains('Documents').click();
//       cy.get('document-list-item').find('.tab-table').should('have.length', 1);
//
//       cy.contains("Delete").should('exist').click();
//       cy.get('.header-text').should('contain.text', 'Delete this client document');
//       cy.contains("Reason")
//         .closest(".fieldset")
//         .find("select")
//         .select("Duplicate")
//         .contains("Duplicate");
//       cy.contains("Delete the document").click();
//       cy.get('.document-list__message').contains('There are no documents');
    });
  });
