describe("Navigation", { tags: ["@workflow", "@smoke-journey"] }, () => {
  it("tests header", () => {
    cy.loginAs("Lay User");
    cy.testHeaderNavigation('workflow');
  })
});
