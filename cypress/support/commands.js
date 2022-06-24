require('cypress-iframe');
require('cypress-wait-until');

Cypress.Commands.add("login", (email, password) => {
  cy.visit('/auth/logout');
  cy.clearCookies();

  cy.request({
    method: 'POST',
    url: '/',
    form: true,
    body: {
      email: email,
      password: password,
      submit: 'Sign In',
      'OPG-Bypass-Membrane': 1
    }
  });
});

Cypress.Commands.add("loginAs", (user) => {
  const userFiles = {
    'Allocations User': 'user/allocations.json',
    'Case Manager': 'user/case-manager.json',
    'LPA Manager': 'user/lpa-manager.json',
    'Lay User': 'user/lay.json',
    'System Admin': 'user/system-admin.json',
  };

  let userFile = userFiles[user];

  if (userFile == null) {
    throw new Error("Could not find test login details for user " + user);
  }

  return cy.fixture(userFile).then(user => {
    cy.login(user.email, user.password);
  });
});

const getAndStoreTokens = () => {
  cy.request({
    url: '/api/v1/users/current',
    headers: {
      'accept': 'application/json',
      'opg-bypass-membrane': 1
    }
  }).its('headers')
    .then((res) => {
      cy.wrap(res.authorization).as('jwtToken');
    });

  cy.getCookie('XSRF-TOKEN')
    .then((res) => {
      cy.wrap(decodeURIComponent(res.value)).as('csrfToken');
    });
}

Cypress.Commands.add('sendToApi', (verb, url, data, retry) => {
  cy.then(getAndStoreTokens);

  const retryOptions = retry
    ? { retryOnStatusCodeFailure: true, retryOnNetworkFailure: true }
    : {};

  cy.get('@jwtToken').then(jwtToken => {
    cy.get('@csrfToken').then(csrfToken => {
      return cy.request({
        method: verb,
        url: url,
        headers: {
          'accept': 'application/json',
          'authorization': jwtToken,
          'content-type': 'application/json',
          'opg-bypass-membrane': 1,
          'x-xsrf-token': csrfToken
        },
        body: data,
        ...retryOptions,
      });
    });
  });
});

Cypress.Commands.add('postToApi', (url, data, retry) => {
  cy.sendToApi('POST', url, data, retry);
});

Cypress.Commands.add('putToApi', (url, data) => {
  cy.sendToApi('PUT', url, data);
});
