import dateToString from "../../../support/date-to-string";

describe(
"Finance actions tab",
{ tags: ["@supervision", "@supervision-regression", "@finance-tab", "@finance"] },
() => {

  beforeEach(() => {
    cy.loginAs("Finance User Testing");

  });

  it('allows pending invoice adjustments to be approved', () => {

    cy.createClient()
      .withSOPNumber()
      .withInvoice()
      .withCreditMemo();

    cy.visit(`/supervision/#/finance-hub`);

    cy.get('#finance-reporting-main-menu-link').should('be.visible').click();
    cy.get('#finance-pending-ledger-entries-button').should('be.visible').click();
    cy.get('.section-title').should('contain.text', 'Pending invoice adjustments');

    cy.get('#approve-selected-adjustments').scrollIntoView()
    cy.get('#approve-selected-adjustments').should('be.disabled');
    cy.get('#decline-selected-adjustments').should('be.disabled');

    cy.get("@client").then(({id}) => {
      cy.wrap(id).as('clientId')
    });

    cy.get('@clientId').then(clientId => {
      cy.get(`a[href="#/clients/${clientId}"]`).as('clientLink');
      cy.get(`@clientLink`).should("exist").click();
    });

    cy.get('.TABS_FINANCEINFO').click();

    cy.get('@creditMemo').then(creditMemo => {
      cy.get('@invoice').then((invoice) => {
        let receivedDate = new Date(creditMemo.dateTime);

        cy.get('.ledger-entry-details > .key-value-list > .content > .key-value-list-section > .key-value-list__read-only > :nth-child(2)').contains(creditMemo.amount);
        cy.get('.ledger-entry-details > .key-value-list > .content > .key-value-list-section > .key-value-list__read-only > :nth-child(4)').contains(dateToString(receivedDate));
        cy.get('.ledger-entry-details > .key-value-list > .content > .key-value-list-section > .key-value-list__read-only > :nth-child(6)').contains(invoice.reference);
        cy.get('.ledger-entry-details > .key-value-list > .content > .key-value-list-section > .key-value-list__read-only > :nth-child(6)').contains(creditMemo.type.label);
        cy.get('.ledger-entry-details > .key-value-list > .content > .key-value-list-section > .key-value-list__read-only > :nth-child(10)').contains('Pending');

        cy.visit(`/supervision/#/finance-hub`);

        cy.get('#finance-pending-ledger-entries-button').should('be.visible').click();

        cy.get(`@clientLink`).parent('td').parent('tr').as('row');

        cy.get('@row').within(() => {
          cy.contains('td', creditMemo.amount).should('have.class', 'ledger-entries-list-item-amount');
          cy.contains('td', invoice.amount).should('have.class', 'ledger-entries-list-item-outstanding');
          cy.contains('td', creditMemo.type.label).should('have.class', 'ledger-entries-list-item-type');
          cy.contains('td', invoice.reference).should('have.class', 'ledger-entries-list-item-invref');

          let cleanedNotes = creditMemo.notes.replace(/(<([^>]+)>)/gi, "");

          cy.contains('td', cleanedNotes).should('have.class', 'ledger-entries-list-item-notes');

          cy.get(':nth-child(1) > [type="checkbox"]').check();
        });

        cy.get('#approve-selected-adjustments').should('not.be.disabled');
        cy.get('#decline-selected-adjustments').should('not.be.disabled');
        cy.get('#approve-selected-adjustments').click();
        cy.get('dialog-box').should('be.visible');
        cy.get('.header-text').should('contain.text', 'Confirm Invoice Adjustments');
        cy.get('.dialog-body').should('contain.text', invoice.reference);
        cy.get('.dialog-footer > .button').contains('Confirm').click();
      })
    })

    cy.get(`@clientLink`).should("not.exist");

    cy.get('@clientId').then(clientId => {
      cy.visit(`/supervision/#/clients/` + clientId);
    })

    cy.get('.TABS_FINANCEINFO').click();

    cy.get('@invoice').then((invoice) => {
      cy.get('.ledger-entry-details > .key-value-list > .content > .key-value-list-section > .key-value-list__read-only > :nth-child(6)').contains(invoice.reference);
      cy.get('.ledger-entry-details > .key-value-list > .content > .key-value-list-section > .key-value-list__read-only > :nth-child(10)').contains('Approved');
    });
  });
});
