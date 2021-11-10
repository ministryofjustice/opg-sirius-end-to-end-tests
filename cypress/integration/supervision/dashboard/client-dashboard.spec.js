before(() => {
  cy.loginAs('Case Manager');
});

beforeEach(function createClient () {
  cy.fixture('client/minimal.json').then(client => {
    cy.postToApi('/api/v1/clients', client)
      .its('body')
      .then(res => {
          cy.wrap(res.id).as('clientId');
      });
  });
});

describe('Viewing the client dashboard', { tags: ['@supervision', '@supervision-regression', '@client-dashboard'] }, () => {
  it(
    'Given I\'m a Case Manager on Supervision and on the client dashboard page' +
    'Then the Client Dashboard page loads as expected',
    () => {
      cy.get('@clientId').then(clientId => {
        cy.visit('/supervision#/clients/' + clientId);
      });
      cy.get('.title-person-name', {timeout: 30000}).contains('Ted Tedson');
    }
  );
});
