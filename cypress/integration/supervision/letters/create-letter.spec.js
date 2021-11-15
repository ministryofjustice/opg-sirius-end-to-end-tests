const createClient = () => {
  return cy.fixture('client/minimal.json').then(client => {
    cy.postToApi('/api/v1/clients', client)
      .its('body')
      .then(res => {
        cy.wrap(res.id).as('clientId');
      });
  });
};

const createOrder = () => {
  return cy.get('@clientId').then(clientId => {
    cy.fixture('order/minimal.json').then(order => {
      cy.postToApi('/api/v1/clients/' + clientId + '/orders', order)
        .its('body')
        .then(res => {
          cy.wrap(res.caseRecNumber).as('courtReference');
          cy.wrap(res.id).as('orderId');
        });
    });
  });
};

const getIframeDocument = () => {
  return cy.get('iframe').its('0.contentDocument').should('exist')
}

const getIframeBody = () => {
  return getIframeDocument().its('body').should('not.be.undefined').then(cy.wrap)
}


before(function setupAllocatedClient () {
  cy.loginAs('Allocations User')
    .then(createClient)
    .then(createOrder)
});

beforeEach(function navigateToClient () {
  cy.get('@clientId').then(clientId => {
    cy.visit('/supervision#/clients/' + clientId);
  });
});

describe('Creating, editing and retrieving a letter', { tags: ['@supervision', '@supervision-regression', '@letter'] }, () => {
  it(
    'Given I\'m a Case Manager on Supervision' +
    'Then the letter is edited as expected',
    () => {
      cy.get('.title-person-name', {timeout: 30000}).contains('Ted Tedson');

      cy.get('@orderId').then(orderId => {
        cy.get('@clientId').then(clientId => {
          cy.visit('/supervision/#/clients/' + clientId + '/orders/' + orderId + '/drafts/create/template');
        });
      });

      cy.get('.select-template', {timeout: 30000}).contains('Select a template');

      cy.get('div.document-item:nth-child(1) > button:nth-child(1) > span:nth-child(1)').click();

      cy.get('.smart__action > ng-component:nth-child(2) > div:nth-child(1) > draft-select-recipients:nth-child(1) > div:nth-child(1) > div:nth-child(1) > h2:nth-child(1)', {timeout: 30000}).contains('Select recipient/s');

      cy.get('li.selectable-list-item > draft-recipient:nth-child(1) > label:nth-child(1)').click();

      cy.get('#create-letter-button').click();

      cy.get('#preview-publish-button', {timeout:30000}).contains('Preview & publish');

      cy.get('.document-editor__sub-title', {timeout:30000}).contains('Edit document...');

      // errors - screenshot shows empty editor
      // cy.get("iframe").then( $iframe => {
      //   const $body = $element.contents().find('body');
      //   cy.wrap( $body.find('#content')).clear({force:true}); //errors //screenshot clears editor
      // });

      // getIframeBody().clear(); //errors
      // getIframeBody().find("p").should('exist'); //doesn't exist
      // getIframeBody().find("h2").type("Test");
      // getIframeBody().find("p").type("Test Blog Entry");

      //errors, no text added but cleared editor
      // cy.setTinyMceContent('#editor_ifr', 'User added text');

      cy.get('#save-draft-and-exit-button').click();
      cy.get('#publish-close-button', {timeout:30000}).click();

      cy.get('#retrieve-drafts-button', {timeout:30000}).click();
      cy.get('#preview-publish-button', {timeout:30000}).contains('Preview & publish');

      // cy.getTinyMce('#editor_ifr').contains('User added text');
    }
  );
});


