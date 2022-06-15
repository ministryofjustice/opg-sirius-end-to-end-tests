 beforeEach(() => {
  cy.loginAs('Case Manager');
  cy.createAClient();
});

describe('Edit a client', { tags: ['@supervision', 'client', '@smoke-journey'] }, () => {
  it(
    'Given I\'m a Case Manager on Supervision and on the client dashboard page' +
    'Then the Client Dashboard page loads as expected',
    () => {
      cy.get('@clientId').then(clientId => {
        cy.visit(`/supervision/#/clients/${clientId}/edit`);
      });
      cy.contains('Edit Client: Ted Tedson');

      const suffix = Math.floor(Math.random() * 10000);

      cy.get('#editClientFormContent').as('edit-panel');
      cy.get('@edit-panel').within(() => {
        cy.get('input[name="firstName"]').clear().type('Bill' + suffix);
        cy.get('input[name="lastName"]').clear().type('Billson' + suffix);
        cy.get('input[name="memorablePhrase"]').clear().type('Memorable' + suffix);
      });

      cy.contains('Save & Exit').click();

      cy.contains('Client details');
      cy.contains('Bill' + suffix);
      cy.contains('Billson' + suffix);
      cy.contains('Memorable' + suffix);
    }
  );
});
