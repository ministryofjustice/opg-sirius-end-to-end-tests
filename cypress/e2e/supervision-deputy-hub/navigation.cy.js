describe("Navigation", { tags: ["@supervision-deputy-hub", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("Case Manager");
    cy.createADeputy({
      'deputyType': {'handle': 'PRO', 'label': 'Professional'},
      'deputySubType': {'handle': 'PERSON', 'label': 'Person'},
    });
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
      cy.get("@deputyId").then((deputyId) => cy.visit("/supervision/deputies/" + deputyId));
      cy.get(':nth-child(' + key + ') > .moj-header__navigation-link').click()
      cy.url().should('include', navigationLinks[key])
    }
  })
});
