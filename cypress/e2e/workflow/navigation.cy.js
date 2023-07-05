describe("Navigation", { tags: ["@workflow", "@smoke-journey"] }, () => {
  it("tests header", () => {
    cy.loginAs("Case Manager");
    cy.testHeaderNavigation('workflow');
  })
});
