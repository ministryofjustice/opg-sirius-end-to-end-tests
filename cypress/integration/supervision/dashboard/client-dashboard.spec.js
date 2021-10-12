before(function fetchUser () {
    cy.fixture('user/case-manager.json').then(user => {
        cy.login(user.email, user.password)
    });
});

beforeEach(function createClient () {
    cy.fixture('client/minimal.json').then(client => {
        cy.postToApi('/api/v1/clients', client);
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
      cy.get('.title-person-name').contains('Ted Tedson');
    });
});
