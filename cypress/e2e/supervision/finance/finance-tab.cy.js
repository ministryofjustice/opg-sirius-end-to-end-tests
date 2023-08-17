describe(
"Finance actions tab",
{ tags: ["@supervision", "@supervision-regression", "@finance-tab", "@finance"] },
() => {

  beforeEach(() => {
    cy.loginAs("Finance User Testing");

  });

  it('allows pending invoice adjustments to be approved', () => {

    cy.createClient()
      .withInvoice();
    cy.get('@invoiceId').then((invoiceId) => {
      cy.get("@client").then(({id}) => {
        cy.wrap(id).as('clientId')
        cy.createInvoiceCredit(id, invoiceId);
      });
    });
    cy.visit(`/supervision/#/finance-hub`);

    cy.get('#finance-reporting-main-menu-link').should('be.visible').click();
    cy.get('#finance-pending-ledger-entries-button').should('be.visible').click();
    cy.get('.section-title').should('contain.text', 'Pending invoice adjustments');

    cy.get('#approve-selected-adjustments').scrollIntoView()
    cy.get('#approve-selected-adjustments').should('be.disabled');
    cy.get('#decline-selected-adjustments').should('be.disabled');

    cy.get('@clientId').then(clientId => {
      cy.get(`a[href="#/clients/${clientId}"]`).should("exist");
    })

    cy.contains('td', 'Credit invoice notes').parent('tr').as('row');
    cy.get('@row').within(() => {
      cy.contains('td', '£195.00').should('have.class', 'ledger-entries-list-item-amount');
      cy.contains('td', '£123.00').should('have.class', 'ledger-entries-list-item-outstanding');
      cy.contains('td', 'Credit memo').should('have.class', 'ledger-entries-list-item-type');
      cy.contains('td', 'S2').should('have.class', 'ledger-entries-list-item-invref');
      cy.contains('td', '/19').should('have.class', 'ledger-entries-list-item-invref');
      // cy.contains('a').parent().should('have.class', 'ledger-entries-list-item-name');

      cy.contains('td', 'Credit invoice notes').should('have.class', 'ledger-entries-list-item-notes');
      cy.get(':nth-child(1) > [type="checkbox"]').check();
    });

    // it won't register the box as checked without this reload
    cy.reload();
    cy.get(':nth-child(1) > .ledger-entries-list-item-selected').click();
    cy.get('#approve-selected-adjustments').should('not.be.disabled');
    cy.get('#decline-selected-adjustments').should('not.be.disabled');
    cy.get('#approve-selected-adjustments').click();
    cy.get('dialog-box').should('be.visible');
    cy.get('.header-text').should('contain.text', 'Confirm Invoice Adjustments');
    cy.get('.dialog-body').should('contain.text', 'S2');
    cy.get('.dialog-footer > .button').contains('Confirm').click();

    cy.get('@clientId').then(clientId => {
      cy.get(`a[href="#/clients/${clientId}"]`).should("not.exist");
    })
  });
});
