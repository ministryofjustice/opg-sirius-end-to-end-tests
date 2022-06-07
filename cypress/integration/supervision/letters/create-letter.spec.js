const createOrder = () => {
  return cy.get('@clientId').then(clientId => {
    cy.fixture('order/minimal.json').then(order => {
      cy.postToApi('/supervision-api/v1/clients/' + clientId + '/orders', order)
        .its('body')
        .then(res => {
          cy.wrap(res.caseRecNumber).as('courtReference');
          cy.wrap(res.id).as('orderId');
        });
    });
  });
};

const getIframeDocument = () => {
  return cy.get('iframe[id="editor_ifr"]', {timeout:30000}).its('0.contentDocument').should('exist')
}

const getIframeBody = () => {
  return getIframeDocument().its('body').should('not.be.undefined').then(cy.wrap)
}

const getRecipientHeader = () => {
  return cy.get('.smart__action > ng-component:nth-child(2) > div:nth-child(1) > draft-select-recipients:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h2:nth-child(1)', {timeout: 30000});
}

const getFirstSelectableRecipient = () => {
  return cy.get('li.selectable-list-item > draft-recipient:nth-child(1) > label:nth-child(1)', {timeout: 30000});
}

before(function setupAllocatedClient () {
  cy.loginAs('Allocations User');
  cy.createAClient()
    .then(createOrder);
});

beforeEach(function navigateToClient () {
  cy.get('@clientId').then(clientId => {
    cy.visit('/supervision#/clients/' + clientId);
  });
});

describe('Creating, editing and retrieving a letter', { tags: ['@supervision', '@supervision-regression', '@letter'] }, () => {
  it(
    'Given I\'m a Case Manager on Supervision creating a letter template' +
    'Then the letter is edited as expected',
    () => {
      cy.get('.title-person-name', {timeout: 30000}).contains('Ted Tedson');

      cy.get('@orderId').then(orderId => {
        cy.get('@clientId').then(clientId => {
          cy.visit('/supervision/#/clients/' + clientId + '/orders/' + orderId + '/drafts/create/template');
        });
      });

      cy.get('.select-template', {timeout: 30000}).contains('Select a template');
      cy.contains('blank: Blank template').click();

      getRecipientHeader().contains('Select recipient/s');
      getFirstSelectableRecipient().click();

      cy.get('#create-letter-button').click();
      cy.get('#preview-publish-button', {timeout:30000}).contains('Preview & publish');
      cy.get('.document-editor__sub-title', {timeout:30000}).contains('Edit document...');

      getIframeBody().find("section").clear();
      getIframeBody().find("p").type("My test letter content");

      cy.get('#save-draft-and-exit-button').click();
      cy.get('#publish-close-button', {timeout:30000}).click();
      cy.get('#retrieve-drafts-button', {timeout:30000}).should('not.be.disabled').click();
      cy.get('#preview-publish-button', {timeout:30000}).contains('Preview & publish');

      getIframeBody().contains("My test letter content");
    }
  );
});


