Cypress.Commands.add("createDonor", () =>
  cy
    .fixture("donor/minimal.json")
    .then((donor) => cy.postToApi("/api/v1/donors", donor, true).its("body"))
);

Cypress.Commands.add("createLpa", (donorId) =>
  cy
    .fixture("lpa/minimal.json")
    .then((lpa) =>
      cy.postToApi(`/api/v1/donors/${donorId}/lpas`, lpa).its("body")
    )
);

Cypress.Commands.add("createInvestigation", (lpaId) =>
  cy
    .fixture("investigation/create-investigation.json")
    .then((investigation) =>
      cy.postToApi(`/api/v1/lpas/${lpaId}/investigations`, investigation).its("body")
    )
);

Cypress.Commands.add("putInvestigationOnHold", (investigationId) =>
  cy.postToApi(`/api/v1/investigations/${investigationId}/hold-periods`, {reason: "Police Investigation"}).its("body")
);

const waitForStableDOM = (iteration = 0) => {
  let mutation,
    pollInterval = 1000,
    timeout = 60000;

  const observer = new MutationObserver((m) => mutation = m);
  observer.observe(document, {
    subtree: true,
    childList: true,
    attributes: true,
    attributeOldValue: true,
    characterData: true,
    characterDataOldValue: true,
  });

  cy.document().then(document => {
    cy.wait(pollInterval).then(() => {
      if (!mutation) {
        return cy.wrap(document);
      } else if (iteration * pollInterval < timeout) {
        return waitForStableDOM(iteration + 1);
      } else {
        throw Error('Timed out waiting for stable DOM');
      }
    });
  })
}
Cypress.Commands.add("waitForStableDOM", () => waitForStableDOM());

const waitForIframe = (selector, containing= { selector: null, content: null }, iteration = 0) => {
  let pollInterval = 1000,
    timeout = 60000;

  cy.get(selector).as("iframe");
  cy.get("@iframe").its('0.contentDocument').should('exist');
  cy.get("@iframe").then((iframe) => {
    let wait = (
      'selector' in containing
      && containing.selector
      && iframe.contents().find(containing.selector).length === 0
    ) || (
      'content' in containing
      && containing.content
      && iframe.contents().find(":contains(" + containing.content + ")").length === 0
    );

    if (wait && iteration * pollInterval < timeout) {
      cy.wait(pollInterval).then(() => {
        waitForIframe(selector, containing, iteration + 1);
      });
    } else if (wait) {
      throw Error('Timed out waiting for iFrame: ' + selector);
    }
  });
}
Cypress.Commands.add("waitForIframe", (selector, containing = {
  selector: null,
  content: null
}) => waitForIframe(selector, containing));
