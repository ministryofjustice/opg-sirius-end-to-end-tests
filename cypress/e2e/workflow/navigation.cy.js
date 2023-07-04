describe("Navigation", { tags: ["@workflow", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("Case Manager");
    cy.visit("/supervision/#/dashboard");
    cy.get('#hook-workflow-button').click()
  });

  it("lpa link is clicked", () => {
    cy.get(':nth-child(1) > .govuk-header__link').click()
    cy.url().should('include', '/lpa')
  })

  it("admin link is clicked", () => {
    cy.get(':nth-child(3) > .govuk-header__link').click()
    cy.url().should('include', '/admin')
  })

  it("log out link is clicked", () => {
    cy.get(':nth-child(4) > .govuk-header__link').click()
    cy.url().should('include', '/auth/login?loggedout=1')
  })
});
