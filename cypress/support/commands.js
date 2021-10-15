Cypress.Commands.add("login", (email, password) => {
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
  let userFiles =  {
    'Case Manager': 'user/case-manager.json',
    'Allocations User': 'user/allocations.json',
  };

  let userFile = userFiles[user];

  if (userFile == null) {
    throw new Error("Could not find test login details for user " + user);
  }

  return cy.fixture(userFile).then(user => {
    cy.login(user.email, user.password);
  });
});

Cypress.Commands.add('postToApi', (url, data) => {
  cy.request({
    url: '/api/v1/users/current',
    headers: {
      'accept': 'application/json',
      'opg-bypass-membrane': 1
    }
  })
    .its('headers')
    .then((res) => {
      cy.wrap(res.authorization).as('jwtToken');
    });

  cy.getCookie('XSRF-TOKEN')
    .then((res) => {
      cy.wrap(decodeURIComponent(res.value)).as('csrfToken');
    });

  cy.get('@jwtToken').then(jwtToken => {
    cy.get('@csrfToken').then(csrfToken => {
      return cy.request({
        method: 'POST',
        url: url,
        headers: {
          'accept': 'application/json',
          'authorization': jwtToken,
          'content-type': 'application/json',
          'opg-bypass-membrane': 1,
          'x-xsrf-token': csrfToken
        },
        body: data
      });
    });
  });
});
