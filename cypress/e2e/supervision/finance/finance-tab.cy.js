describe(
"Finance actions tab",
{ tags: ["@supervision", "@supervision-regression", "@finance-tab", "@finance"] },
() => {

  beforeEach(() => {
    cy.loginAs("Finance User Testing");
    cy.createClient()
      .withInvoice();
    cy.get('@invoiceId').then((invoiceId) => {
      cy.get("@client").then(({id}) => {
        cy.createCredit(id, invoiceId);
      });
    });
    cy.visit(`/supervision/#/finance-hub`);
  });

<<<<<<< Updated upstream:cypress/e2e/supervision/finance/finance-tab.cy.js
  it("allows adding credit and shows this correctly in the finance invoice list", () => {
    cy.get('.finance-personal-summary').should('be.visible');
    cy.get('.write-off').should('be.visible');
    cy.get('.add-credit').should('contain.text', 'Add credit').click();
    cy.get('.head > .title').should('contain.text', 'Apply credit');
    cy.get('input[name="amount"]').type('50');
    const data = '<p>Test applying credit</p>';
    cy.waitForTinyMCE()
      .enterText(data);
    cy.get('[type="submit"]').should('not.be.disabled');
    cy.get('[type="submit"]').click();

    cy.get('.TABS_FINANCEINFO').click();
    cy.get('td > h2').should('contain.text', 'Invoice ledger allocations');
    cy.get('.invoice-list-item-amount').should('contain.text', '£100.00');
    cy.get('.invoice-list-item-outstanding').should('contain.text', '£100.00');

    cy.get('span > .full-details').should('be.visible').click();
    cy.get('.invoice-ledger-entry-allocation-item-amount').should('contain.text', '£50.00');
    cy.get('.invoice-list-item-expanded').should('contain.text', 'Pending');
    cy.get('.invoice-list-item-expanded').should('contain.text', 'Credit memo');
  });

  it('allows awarding fee reductions', () => {
    cy.get('#add-finance-discount-button').should('be.visible').click();
    cy.get('.head > .title').should('contain.text', 'Award fee reduction');
    cy.get(':nth-child(1) > .radio-button').click();
    cy.get('#fIELDLABELSSTARTDATE_year').type('2023');
    cy.get('#fIELDLABELSENDDATE_year').type('2024');
    cy.get('#dateReceived_day').type('01');
    cy.get('#dateReceived_month').type('04');
    cy.get('#dateReceived_year').type('2023');
    const data = '<p>Test applying fee reduction</p>';
    cy.waitForTinyMCE()
      .enterText(data);
    cy.get('[type="submit"]').should('not.be.disabled');
    cy.get('[type="submit"]').click();
=======
  it('allows pending invoice adjustments to be approved', () => {
    cy.get('#finance-reporting-main-menu-link').should('be.visible').click();
    cy.get('#finance-pending-ledger-entries-button').should('be.visible').click();
    cy.get('.section-title').should('contain.text', 'Pending invoice adjustments');
    cy.get('#pending-adjustments-summary > :nth-child(1)').should('contain', 8);
    cy.get('#pending-adjustments-summary > :nth-child(2)').should('contain', 8);
    cy.get('#pending-adjustments-summary > :nth-child(3)').should('contain', 0);
    cy.get(':nth-child(1) > .ledger-entries-list-item-amount').should('contain', '£50.00');
    cy.get(':nth-child(1) > .ledger-entries-list-item-outstanding').should('contain', '£100.00');
    cy.get(':nth-child(1) > .ledger-entries-list-item-type').should('contain.text', 'Credit memo');
    cy.get(':nth-child(1) > .ledger-entries-list-item-invref').should('contain.text', 'AD000001/22');
    // check link goes to client
    // cy.get(':nth-child(1) > .ledger-entries-list-item-name > a').should('contain.text', 'AD000001/22');
    cy.get(':nth-child(1) > .ledger-entries-list-item-notes').should('contain.text', 'Test applying credit');

    cy.get('#approve-selected-adjustments').should('be.disabled');
    cy.get('#decline-selected-adjustments').should('be.disabled');
    cy.get(':nth-child(1) > .ledger-entries-list-item-selected').click();
    cy.get('#approve-selected-adjustments').should('not.be.disabled');
    cy.get('#decline-selected-adjustments').should('not.be.disabled');
>>>>>>> Stashed changes:cypress/e2e/supervision/finance/finance-actions-tab.cy.js

  //    cy.get('#approve-selected-adjustments').click();
  //
  });
});
