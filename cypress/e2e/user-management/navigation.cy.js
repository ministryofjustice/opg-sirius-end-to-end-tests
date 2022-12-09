describe("Navigation", { tags: ["@user-management", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("System Admin");
  });

  it("navigation links are clicked", () => {
    let navigationLinks = {
      1: '/lpa',
      2: '/supervision',
      3: '/auth/login?loggedout=1'
    }
    for (let key in navigationLinks) {
      cy.visit("/supervision/#/dashboard");
      cy.get('#hook-user-management-button').click()
      cy.get(':nth-child(' + key + ') > .moj-header__navigation-link').click()
      cy.url().should('include', navigationLinks[key])
    }
  })
});
