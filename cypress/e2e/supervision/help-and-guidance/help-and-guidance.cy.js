describe("Help and Guidance", { tags: ["@supervision", "@smoke-journey"] }, () => {
  Cypress._.times(30, () => {

  it("content is accessible when expanded", () => {
    cy.loginAs("Case Manager");
    cy.visit("/supervision/#/dashboard");

    cy.intercept('GET', '/*/v1/config*', {
      statusCode: 200,
    });

    cy.intercept('GET', '/*/v1/help-url*', {
      statusCode: 200,
      body: {"data":{"url":"https:\/\/wordpress.sirius.opg.service.justice.gov.uk\/"}},
    });

    // it needs this wait to think about the intercepts or it won't redirect properly
    cy.get('#open-help-and-guidance-main-menu-link').wait(2000);

    cy.get('#open-help-and-guidance-main-menu-link')
      .should('be.visible')
      .then(($a) => {
        expect($a).to.have.attr('target','_blank')
        // update attr to open in same tab
        $a.attr('target', '_self')
      })
      .click()
    cy.url().should('include', 'wordpress.sirius')
    cy.get('h1').should('include.text', 'Help and Guidance')
  });
  });
});
