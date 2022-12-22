describe("Navigation", { tags: ["@supervision", "@smoke-journey"] }, () => {
  it("log out is clicked", () => {
    cy.loginAs("Case Manager");
    cy.visit("/supervision/#/dashboard").then(() => {
      cy.wait(2000)
      cy.get('.log-out.button').click()
      cy.url().should('include', '/auth/login?loggedout=1')
    });
  })
});
