require("cypress-iframe");
require("cypress-wait-until");

Cypress.Commands.add("login", (email: string) => {
  cy.visit("/auth/logout", { failOnStatusCode: false });
  cy.clearCookies();

  cy.visit("/oauth/login");

  cy.waitUntil(() => cy.get('input[name="email"]').should("have.value", "@opgtest.com"));

  cy.get('input[name="email"]').then(elt => {
    elt.val(email);
  });

  cy.get('[type="submit"]').click();
});

Cypress.Commands.add("loginAs", (user: string) => {
  const emails = {
    "Allocations User": "allocations@opgtest.com",
    "Case Manager": "case.manager@opgtest.com",
    "Finance Manager": "finance.manager@opgtest.com",
    "Finance Reporting User": "finance.reporting@opgtest.com",
    "Finance User Testing": "finance.user.testing@opgtest.com",
    "LPA Manager": "2manager@opgtest.com",
    "Lay User": "Lay1-14@opgtest.com",
    "System Admin": "system.admin@opgtest.com",
    "Public API": "publicapi@opgtest.com",
  };

  const email = emails[user];

  if (email == null) {
    throw new Error("Could not find test login details for user " + user);
  }

  cy.login(email);
});

const getAndStoreTokens = () => {
  cy.request({
    url: "/api/v1/users/current",
    headers: {
      accept: "application/json",
      "opg-bypass-membrane": 1,
    },
  })
    .its("headers")
    .then((res) => {
      cy.wrap(res.authorization).as("jwtToken");
    });

  cy.getCookie("XSRF-TOKEN").then((res) => {
    cy.wrap(decodeURIComponent(res.value)).as("csrfToken");
  });
};

const sendToApi = (verb: string, url: string, data: string, retry: boolean = false) => {
  cy.then(getAndStoreTokens);

  const retryOptions = retry
    ? { retryOnStatusCodeFailure: true, retryOnNetworkFailure: true }
    : {};

  cy.get("@jwtToken").then((jwtToken) => {
    cy.get("@csrfToken").then((csrfToken) => {
      return cy.request({
        method: verb,
        url: url,
        headers: {
          accept: "application/json",
          authorization: jwtToken,
          "content-type": "application/json",
          "opg-bypass-membrane": 1,
          "x-xsrf-token": csrfToken,
        },
        body: data,
        ...retryOptions,
      });
    });
  });
};

Cypress.Commands.add("postToApi", (url: string, data: string, retry: boolean = false) => {
  sendToApi("POST", url, data, retry);
});

Cypress.Commands.add("putToApi", (url: string, data: string) => {
  sendToApi("PUT", url, data);
});

Cypress.Commands.add("waitForSearchService", (searchTerm: string = "", personTypes: string[] = [], minimumExpected: number = 1) => {
  cy.waitUntil(
    () =>
      cy
        .postToApi("/api/v1/search/searchAll", {
          personTypes: personTypes,
          term: searchTerm,
        })
        .then((resp) => resp.body.total.count >= minimumExpected),
    {timeout: 10000, interval: 500}
  );
});
