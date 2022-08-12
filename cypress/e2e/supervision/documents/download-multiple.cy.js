import * as path from "path";

const uploadDocument = () => {
  cy.fixture("document/minimal.json").then((document) => {
    cy.get("@clientCourtReference").then((courtRef) => {
      document.caseRecNumber = courtRef;
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
      cy.createAClient();

      cy.loginAs("Public API");
      uploadDocument();
      uploadDocument();
    }); /**/

    it("can download multiple files at once", () => {
      cy.loginAs("Allocations User");

      cy.get("@clientId").then((clientId) => {
        cy.visit(`/supervision/#/clients/${clientId}`);
      });

      cy.get(".TABS_DOCUMENTS").click();
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
