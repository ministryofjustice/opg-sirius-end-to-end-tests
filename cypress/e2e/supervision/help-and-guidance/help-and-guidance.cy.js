describe("Help and Guidance", { tags: ["@supervision", "@smoke-journey"] }, () => {
  it("content is accessible when expanded", {
    retries: {
      runMode: 2,
      openMode: 0,
    },
  }, () => {
    cy.loginAs("Case Manager");
    cy.visit("/supervision/#/dashboard");

    cy.intercept({ method: "GET", url: "/*/v1/help-url*" }).as(
      "helpUrlRequest"
    );

    cy.wait("@helpUrlRequest");

    cy.get('#open-help-and-guidance-main-menu-link')
      .should('be.visible')
      .then(($a) => {
        expect($a).to.have.attr('target', '_blank')
        // update attr to open in same tab
        $a.attr('target', '_self')
      })
      .click()

    cy.url().should('not.contain', 'dashboard');
  });
});
