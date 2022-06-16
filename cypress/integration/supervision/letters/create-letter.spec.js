const createOrder = () => {
  return cy.get('@clientId').then(clientId => {
    cy.fixture('order/minimal.json').then(order => {
      cy.postToApi(`/supervision-api/v1/clients/${clientId}/orders`, order)
        .its('body')
        .then(res => {
          cy.wrap(res.caseRecNumber).as('courtReference');
          cy.wrap(res.id).as('orderId');
        });
    });
  });
};

const getIframeBody = () => {
  return cy.get('iframe[id="editor_ifr"]', {timeout:30000})
    .its('0.contentDocument').should('exist')
    .its('body')
    .should('not.be.undefined')
    .then(cy.wrap)
}

before(function setupAllocatedClient () {
  cy.loginAs('Allocations User');
  cy.createAClient()
    .then(createOrder);
});

beforeEach(function navigateToClient () {
  cy.get('@clientId').then(clientId => {
    cy.visit(`/supervision/#/clients/${clientId}`);
  });
});

describe('Creating, editing and retrieving a letter', { tags: ['@supervision', '@supervision-regression', '@letter'] }, () => {
  it(
    'Given I\'m a Case Manager on Supervision creating a letter template' +
    'Then the letter is edited as expected',
    () => {
      cy.get('.title-person-name').contains('Ted Tedson');

      cy.get('@orderId').then(orderId => {
        cy.get('@clientId').then(clientId => {
          cy.visit(`/supervision/#/clients/${clientId}/orders/${orderId}/drafts/create/template`);
        });
      });

      cy.contains('.select-template', 'Select a template')
      cy.contains('blank: Blank template').click();

      cy.get('draft-select-recipients')
        .find('.section-title')
        .contains('Select recipient/s');

      cy.get('li.selectable-list-item > draft-recipient:nth-child(1) > label:nth-child(1)')
        .as('firstSelectableRecipient')
        .click();

      cy.get('#create-letter-button').click();
      cy.contains('#preview-publish-button', 'Preview & publish');
      cy.contains('.document-editor__sub-title', 'Edit document...');

      cy.get('iframe[id="editor_ifr"]')
        .its('0.contentDocument').should('exist')
        .its('body').should('not.be.undefined')
        .then(cy.wrap).as('iframeBody');

      getIframeBody().find("section").clear();
      getIframeBody().find("p").type("My test letter content");

      cy.get('#save-draft-and-exit-button').click();
      cy.get('#publish-close-button').click();
      cy.get('#retrieve-drafts-button').should('not.be.disabled').click();
      cy.contains('#preview-publish-button', 'Preview & publish');

      getIframeBody().contains( 'My test letter content');
    }
  );
});


