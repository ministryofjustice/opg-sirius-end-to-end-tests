describe("Navigation", { tags: ["@supervision-firm-deputy-hub", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs("Case Manager");
    cy.createAFirm();
  });

});
