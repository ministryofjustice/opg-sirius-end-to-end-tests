Cypress.Commands.add("testHeaderNavigation", (microservice) => {
       cy.loginAs("Lay User");

   cy.goToMicroserviceHomepage(microservice);

  cy.get(':nth-child(1) > .govuk-header__link').click()
  cy.url().should('include', '/lpa');

  cy.goToMicroserviceHomepage(microservice);

  //supervision link is hidden on supervision side
  cy.get(':nth-child(2) > .govuk-header__link').should('not.be.visible')

  cy.get(':nth-child(3) > .govuk-header__link').click()
  cy.url().should('include', '/admin')

  cy.goToMicroserviceHomepage(microservice);

  cy.get(':nth-child(4) > .govuk-header__link').click()
  cy.url().should('include', '/auth/login?loggedout=1')

  if (microservice == 'workflow') {
    cy.loginAs("Lay User");
  } else {
    cy.loginAs("Case Manager");
  }
  cy.goToMicroserviceHomepage(microservice);

  cy.get(':nth-child(1) > .moj-primary-navigation__link').click()
  cy.url().should('include', '/supervision/#/clients/search-for-client')

  cy.goToMicroserviceHomepage(microservice);

  cy.get(':nth-child(2) > .moj-primary-navigation__link').click()
  cy.url().should('include', '/supervision/workflow')

  cy.goToMicroserviceHomepage(microservice);

  cy.get(':nth-child(3) > .moj-primary-navigation__link').click()
  cy.url().should('include', '/supervision/#/finance-hub/reporting')

  cy.goToMicroserviceHomepage(microservice);

   if(microservice == 'workflow') {
       cy.get(':nth-child(2) > .moj-primary-navigation__link').should('have.attr', 'aria-current', 'page');
   } else {
       cy.get(':nth-child(2) > .moj-primary-navigation__link').should('not.have.attr', 'aria-current', 'page');
   }
});

Cypress.Commands.add("goToMicroserviceHomepage", (microservice) => {
    if (microservice == 'workflow') {
       cy.visit("/supervision/#/dashboard");
       cy.get('#hook-workflow-button').click()
    } else if (microservice == 'deputy-hub') {
      cy.get("@deputy").then(({id}) => cy.visit("/supervision/deputies/" + id));
    } else if (microservice == 'firm-hub') {
      cy.get("@firmId").then((firmId) => cy.visit("/supervision/deputies/firm/" + firmId));
    }
});
