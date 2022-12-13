describe("Navigation", { tags: ["@supervision-firm-deputy-hub", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("Case Manager");
    cy.createAFirm();
  });

  it("navigation links are clicked", () => {
    let navigationLinks = {
      1: '/workflow',
      2: '/supervision',
      3: '/lpa',
      4: '/admin',
      5: '/auth/login?loggedout=1'
    }
    for (let key in navigationLinks) {
      cy.get("@firmId").then((firmId) => cy.visit("/supervision/deputies/firm/" + firmId));
      cy.get(':nth-child(' + key + ') > .moj-header__navigation-link').click()
      cy.url().should('include', navigationLinks[key])
    }
  })
});
