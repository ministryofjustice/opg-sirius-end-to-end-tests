import path from "path";

beforeEach(() => {
  cy.loginAs("Allocations User");
  cy.createAClient();
  cy.loginAs("Public API");
  cy.uploadDocument();
});

describe(
  "Open document successfully",
  { tags: ["@supervision-core", "@documents", "@open-document", "@smoke-journey"] },
  () => {
    it("opens a document successfully", () => {
      cy.loginAs("Case Manager");
      cy.get("@clientId").then((clientId) => {
        cy.visit(`/supervision/#/clients/${clientId}`);
        cy.contains("Ted Tedson");
        cy.get(".TABS_DOCUMENTS").click();
        cy.get(".filter-numbers > .number").should("have.text", 1);
        cy.get("#select-all-documents-checkbox").check({ force: true });
      });

      cy.task("listContentsOfDownloadsFolder", Cypress.config("downloadsFolder")).then(beforeDownloadList => {
        cy.contains(".button", "Open").click().wait(1000);
        cy.task("listContentsOfDownloadsFolder", Cypress.config("downloadsFolder")).then(afterDownloadList => {
          const newFilename = afterDownloadList.filter(file => !beforeDownloadList.includes(file))[0];
          const newFilePath = path.join(
            Cypress.config("downloadsFolder"),
            newFilename
          );
          cy.verifyDownload(newFilename, {contains: true});
          cy.readFile(newFilePath);
        });
      });
    });

    it("multiple document download", () => {
      cy.uploadDocument();
      cy.loginAs("Case Manager");
      cy.get("@clientId").then((clientId) => {
        cy.visit(`/supervision/#/clients/${clientId}`);
        cy.contains("Ted Tedson");
        cy.get(".TABS_DOCUMENTS").click();
        cy.get(".filter-numbers > .number").should("have.text", 2);
        cy.get("#select-all-documents-checkbox").check({force: true});
      });

      cy.task("listContentsOfDownloadsFolder", Cypress.config("downloadsFolder")).then(() => {
        cy.intercept({
          method: "GET",
          url: "/services/file-service/zip/**",
        }).as("fileServiceCall");
        cy.contains(".button", "Open").click().wait(1000);
        cy.wait("@fileServiceCall").its("response.statusCode").should("equal", 200);

        const newFilePath = path.join(
          Cypress.config("downloadsFolder"),
          "download.zip"
        );
        cy.wait(2000).verifyDownload("download.zip", {contains: true});
        cy.readFile(newFilePath);
      });
    });
  });

