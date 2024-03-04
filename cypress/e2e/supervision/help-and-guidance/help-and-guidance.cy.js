describe("Help and Guidance", { tags: ["@supervision", "@smoke-journey"] }, () => {
  it("content is accessible when expanded", () => {
    cy.loginAs("Case Manager");
    cy.visit("/supervision/#/dashboard");

    // cy.window().then((win) => {
    //   cy.stub(win, 'open', url => {
    //     win.location.href = 'http://localhost:8080/help-and-guidance/';
    //   }).as("popup")
    // })

    cy.intercept('GET', '/*/v1/help-url', {
      statusCode: 200,
      body: {"data":{"url":"\/help-and-guidance\/"}},
    });

    cy
      .get('#open-help-and-guidance-main-menu-link')
      .invoke('attr', 'href')
      .should('contain', '/help-and-guidance');

    cy.get('#open-help-and-guidance-main-menu-link').click();
    cy.get('@popup').should("be.called");
    cy.url().should('contain.text', 'help');

    cy.get('h1').should('have.class', "help-header");

  })
});
