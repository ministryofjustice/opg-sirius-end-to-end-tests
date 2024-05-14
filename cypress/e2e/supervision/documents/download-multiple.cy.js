import * as path from "path";

const uploadDocument = () => {
  cy.fixture("document/minimal.json").then((document) => {
    cy.get("@client").then(({caseRecNumber}) => {
      document.caseRecNumber = caseRecNumber;
    });
    cy.postToApi(`/api/public/v1/documents`, document);
  });
};

describe(
  "Downloading multiple files",
  { tags: ["@supervision", "@supervision-regression", "@downloads"] },
  () => {
    before(() => {
      cy.loginAs("Allocations User");
      cy.createClient();

      cy.loginAs("Public API");
      uploadDocument();
      uploadDocument();
    }); /**/

    it("can download multiple files at once", () => {
      cy.loginAs("Allocations User");

      cy.get("@client").then(({id}) => {
        cy.visit(`/supervision/#/clients/${id}`);
      });

      cy.get('#tab-container').contains('Documents').click();
      cy.get(".filter-numbers > .number").should("have.text", 2);
      cy.get("#select-all-documents-checkbox").check({ force: true });
      cy.contains(".button", "Open").click();

      const filename = path.join(
        Cypress.config("downloadsFolder"),
        "download.zip"
      );
      cy.readFile(filename).should("exist");
    });
  }
);
