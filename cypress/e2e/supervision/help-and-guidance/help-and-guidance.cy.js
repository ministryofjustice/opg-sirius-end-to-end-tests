describe("Help and Guidance", { tags: ["@supervision", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("Case Manager");
    cy.visit("/supervision/#/dashboard");
  });

  it("content is accessible when expanded", () => {
    cy.get('#open-help-and-guidance-main-menu-link').click()
    cy.wait(2000);
    cy.frameLoaded(".help-and-guidance__iframe");
    cy.enter(".help-and-guidance__iframe").then((getBody) => {
      getBody().find("#menu-item-2682").click();
    });
  })
});
