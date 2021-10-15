before(() => {
  cy.loginAs('Case Manager');
});

describe('Viewing the dashboard', { tags: ['@supervision', '@dashboard'] }, () => {
  it('should load the Supervision dashboard correctly', () => {
    cy.visit('/supervision#/dashboard');
    cy.contains('This is your Sirius dashboard where you can find all your latest work and tasks assigned to you.');
  });
});
