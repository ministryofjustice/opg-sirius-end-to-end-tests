describe("Help and Guidance", { tags: ["@supervision", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("Case Manager");
    cy.visit("/supervision/#/dashboard");
  });

  it("content is accessible when expanded", () => {
    cy.get('#open-help-and-guidance-main-menu-link').click()
    cy.log(cy.getFromApi("/api/v1/help-url").its("body"))
    cy.wait(3000);
    cy.frameLoaded(".help-and-guidance__iframe");
    cy.get(".help-and-guidance__iframe").should('have.attr', 'src', 'someurl')
    cy.enter(".help-and-guidance__iframe").then((getBody) => {
      getBody().find("#menu-item-2682").click();
    });
  })
});
