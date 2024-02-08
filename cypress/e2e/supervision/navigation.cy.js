describe("Navigation", { tags: ["@supervision", "@smoke-journey"] }, () => {
  it("log out is clicked", () => {
    cy.loginAs("Case Manager");
    cy.visit("/supervision/#/dashboard").then(() => {
      cy.wait(2000)
      cy.get('.log-out.button').click()
      cy.url().should('include', '/auth/login?loggedout=1')
    });
  })

  it("doesn't cache data when navigating to a new client", () =>{
    cy.loginAs("Case Manager");

    cy.createClient({}, "client1")
      .withOrder()
      .closeOrder("deputy-deceased");

    cy.createClient({}, "client2")
      .withOrder();

    cy.get("@client2")
      .addWarning();

    cy.get("@client1").then(({id}) => {
      cy.visit("supervision/#/clients/" + id);
      cy.get('.client-priority-info > span').contains('Deputy deceased');
    });

    cy.get("@client2").then(({id}) => {
      cy.visit("supervision/#/clients/" + id);
      cy.get('.client-priority-info > span').contains('Case has warnings');
    });
  });


  it("actions in the menu remain available on navigation", () =>{
    cy.loginAs("Case Manager");

    cy.createClient()
      .withOrder()
      .withSupervisionLevel()
      .withActiveOrderStatus();

    cy.get("@client").then(({id}) => {
      cy.visit("supervision/#/clients/" + id);
      cy.waitUntil(() => cy.get('@order').then(({id}) => cy.url().should('contain', '?order=' + id)));
      cy.get('#create-letter-button').should('be.enabled');

      cy.get('#edit-client-risk-score-button').click();
      cy.contains('#edit-client-risk-score', 'Record client risk score');
      cy.get('.footer > .cancel').click();

      cy.waitUntil(() => cy.get('@order').then(({id}) => cy.url().should('contain', '?order=' + id)));
      cy.get('#create-letter-button').should('be.enabled');
    });
  });
});
