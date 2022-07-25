import * as path from "path";

beforeEach(() => {
  cy.loginAs('Allocations User');
  cy.createAClient();
});

const uploadDocument = () => {
  cy.fixture('document/minimal.json').then(document => {
    cy.get('@clientCourtReference').then((ref) => {
      document.caseRecNumber = el.text();
    });
    cy.postToApi(`/api/public/v1/documents`, document)
      .its('body')
      .then(res => {
        expect(res.status).to.equal(201);
      });
  });
}

describe('Downloading multiple files', {tags: ['@supervision', '@supervision-regression', '@downloads']}, () => {
  it('can download multiple files at once', () => {
      uploadDocument();
      uploadDocument();

      cy.get('@clientId').then(clientId => {
        cy.visit(`/supervision/#/clients/${clientId}`);
      });

      cy.get('.TABS_DOCUMENTS').click();
      cy.get('#select-all-documents-checkbox').click();
      cy.get('.filter-numbers > .number').should('have.text', 2);

    const filename = path.join(Cypress.config('downloadsFolder'), 'download.zip')

      cy.readFile(filename).should('exist');
    }
  );
});
