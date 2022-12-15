describe("My details", { tags: ["@user-management", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("System Admin")
    cy.visit('/admin')
  });

  it("user details are displayed on page", () => {
    cy.url().should('include', '/admin')
    cy.contains('My details')
    cy.contains('Personal details')
    cy.contains('system.admin@opgtest.com')
  })
});
