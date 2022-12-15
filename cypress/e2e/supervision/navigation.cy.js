describe("Navigation", { tags: ["@supervision", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("Case Manager");
  });

  it("log out is clicked", () => {
    cy.get('.log-out.button').click()
    cy.url().should('include', '/auth/login?loggedout=1')
  })
});
