describe("Navigation", { tags: ["@workflow", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("Case Manager");
    cy.visit("/supervision/#/dashboard");
    cy.get('#hook-workflow-button').click()
  });

  it("supervision link is clicked", () => {
    cy.get(':nth-child(1) > .moj-header__navigation-link').click()
    cy.url().should('include', '/supervision')
  })

  it("lpa link is clicked", () => {
    cy.get(':nth-child(2) > .moj-header__navigation-link').click()
    cy.url().should('include', '/lpa')
  })

  it("log out link is clicked", () => {
    cy.get(':nth-child(3) > .moj-header__navigation-link').click()
    cy.url().should('include', '/auth/login?loggedout=1')
  })
});
