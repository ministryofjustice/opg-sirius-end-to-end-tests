Cypress.Commands.add("waitForLoading", (bannerText) => {
  cy.contains(".in-page-loading-banner", bannerText)
    .should("be.visible");
  cy.contains(".in-page-loading-banner", bannerText).should("not.exist");
});
