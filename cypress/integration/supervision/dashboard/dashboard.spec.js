before(function fetchUser () {
  cy.request({
    method: 'POST',
    url: '/',
    form: true,
    body: {
      email: 'case.manager@opgtest.com',
      password: 'Password1',
      submit: 'Sign In',
      'OPG-Bypass-Membrane': 1
    }
  });
});

describe('Viewing the dashboard', { tags: ['@supervision', '@dashboard'] }, () => {
  it('should load the Supervision dashboard correctly', () => {
    cy.visit('/supervision#/dashboard');
    cy.contains('This is your Sirius dashboard where you can find all your latest work and tasks assigned to you.');
  });
});
