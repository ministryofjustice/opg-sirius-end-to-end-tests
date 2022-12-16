const getIframeBody = () => {
  return cy
    .get('iframe.help-and-guidance__iframe')
    .its('0.contentDocument.body').should('not.be.empty')
    .then(cy.wrap)
}

describe("Help and Guidance", { tags: ["@supervision", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("Case Manager");
    cy.visit("/supervision/#/dashboard");
  });

  it("content is accessible when expanded", () => {
    cy.get('#open-help-and-guidance-main-menu-link').click()
    getIframeBody().find("#menu-item-2682").click()
  })
});
