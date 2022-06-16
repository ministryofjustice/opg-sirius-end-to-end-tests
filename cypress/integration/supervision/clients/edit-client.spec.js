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
      const firstName = 'Bill' + suffix;
      const lastName = 'Billson' + suffix;
      const memorablePhrase = 'Memorable' + suffix

      cy.get('#editClientFormContent > form').find('input[name="firstName"]').clear().type(firstName);
      cy.get('#editClientFormContent > form').find('input[name="lastName"]').clear().type(lastName);
      cy.get('#editClientFormContent > form').find('input[name="memorablePhrase"]').clear().type(memorablePhrase);
      cy.get('#editClientFormContent > form').contains('Save & Exit').click();

      cy.get('.right-side').contains('.sub-section-header', 'Client details');
      cy.contains('.client-summary-full-name-value', `${firstName} ${lastName}`);
      cy.contains('.client-summary-memorable-phrase-value', memorablePhrase);
    }
  );
});
