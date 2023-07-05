describe("Navigation", { tags: ["@supervision-firm-deputy-hub", "@smoke-journey"] }, () => {
  it("tests header", () => {
   cy.loginAs("Case Manager");
    cy.createAFirm();
    cy.testHeaderNavigation('firm-hub');
  })
});
