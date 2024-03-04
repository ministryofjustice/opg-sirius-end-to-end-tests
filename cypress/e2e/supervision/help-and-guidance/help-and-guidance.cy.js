describe("Help and Guidance", { tags: ["@supervision", "@smoke-journey"] }, () => {
  it("content is accessible when expanded", () => {
    cy.loginAs("Case Manager");
    cy.visit("/supervision/#/dashboard");

    cy.window().then((win) => {
      cy.stub(win, 'open', url => {
        win.location.href = 'https://wordpress.sirius.opg.service.justice.gov.uk/';
      }).as("popup")
    })
    cy.get('#open-help-and-guidance-main-menu-link').click()
    cy.get('@popup').should("be.called")
    cy.get('h1').should('have.class', "help-header");
    cy.get('h1').should('contain.text', "Help and Guidance");
  })
});
