before(() => {
  cy.loginAs('Case Manager');
});

describe('Create a new client', { tags: ['@supervision', '@client', '@smoke-journey'] }, () => {
  it('Search for client that does not exist and create a new one', () => {
    cy.visit('/supervision/#/clients/search-for-client');

    cy.get('main').find('input[placeholder="Search by Order Number, SIRIUS ID or Name"]').type('DoNotFindMe');
    cy.get('button[class="button client-search__search-button"]').should('be.visible').click();
    cy.contains('No results could be found');

    cy.contains('Create a new client').click();

    cy.get('input[name="courtReference"]').type('00000000');
    cy.get('input[name="firstName"]').type('Bill');
    cy.get('input[name="lastName"]').type('Billson');

    cy.contains('Save & exit').click();

    cy.get('span[class="title-person-name"]', { timeout: 30000 }).should('be.visible')
      .should('have.value', 'Bill Billson');
    cy.get('div[class="client-summary__cell client-summary__cell--value court-reference-value-in-client-summary"]')
      .should('not.have.value', '00000000');
  });
});
