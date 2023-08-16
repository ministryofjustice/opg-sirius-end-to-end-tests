describe(
"Client finance tab",
{ tags: ["@supervision", "@supervision-regression", "@finance-tab", "@finance"] },
() => {

  beforeEach(() => {
    cy.loginAs("Finance User Testing");
    cy.createClient()
      .withOrder()
      .withSupervisionLevel()
      .withActiveOrderStatus();
    cy.get("@client").then(({ id, caseRecNumber }) => {
      cy.assignSOPNumberToClient(caseRecNumber)
      cy.visit(`/supervision/#/clients/${id}`);
    });
    cy.get('.TABS_FINANCEINFO').click();
  });
  Cypress._.times(30, () => {
  it("allows adding credit and shows this correctly in the finance invoice list", () => {
    cy.get('.finance-personal-summary').should('be.visible');
    cy.get('.write-off').should('be.visible');
    cy.wait(300);
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
  cy.wait(300);
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

  cy.get('.TABS_FINANCEINFO').click();
  cy.get('#list-finance-discounts').should('contain.text', 'Fee reductions');
  cy.get('.finance-discount-list-discount').should('contain.text', 'Remission');
  cy.get('#finance-discount-list-table').should('contain.text', '01/04/2023');
  cy.get('#finance-discount-list-table').should('contain.text', '31/03/2024');
  cy.get('#finance-discount-list-table').should('contain.text', 'Active');
  cy.get('.finance-discount-list-notes').should('contain.text', 'Test applying fee reduction');
});
});
});
describe("Client finance tab annual fee information", {
  tags: ["@supervision", "@supervision-regression", "@finance-tab", "@finance"]
}, () => {
  before(() => {
    cy.loginAs("Finance User Testing");
    cy.createClient()
      .withOrder()
      .withSupervisionLevel()
      .withActiveOrderStatus()
      .withOrderExpiryDate();
    cy.get("@client").then(({ id, caseRecNumber }) => {
      cy.assignSOPNumberToClient(caseRecNumber)
      cy.visit(`/supervision/#/clients/${id}`);
    });
    cy.get('.TABS_FINANCEINFO').click();
  });

  it('shows annual fee information', () => {
    cy.get("@order").then(({ id: orderId }) => {
      cy.setOrderAsExpired(orderId)
    });
    cy.reload();
    cy.get('.TABS_FINANCEINFO').click();
    cy.get('span > .full-details').should('be.visible');
    cy.get('span > .full-details').should('have.length', 2);
    cy.get(':nth-child(1) > .invoice-list-item-action').click();
    cy.get('.invoice-fee-range-item-supervision-level').should('contain.text', 'General');
    cy.get('.invoice-fee-range-item-amount').should('contain.text', '£90.05');
    cy.get('.invoice-fee-range-item-from-date').should('contain.text', '01/04/2023');
    cy.get('.invoice-fee-range-item-to-date').should('contain.text', '12/07/2023');
  });
});

describe(
"Client finance tab user permissions",
{ tags: ["@supervision", "@finance-tab", "@finance"] },
() => {

  beforeEach(() => {
    cy.loginAs("Finance User Testing");
    cy.createClient()
      .withOrder()
      .withSupervisionLevel()
      .withActiveOrderStatus();
    cy.get("@client").then(({ caseRecNumber }) => {
      cy.assignSOPNumberToClient(caseRecNumber)
    });
  });

  it('will show correct content for a non finance user', () => {
    cy.loginAs("Case Manager");
    cy.get("@client").then(({ id }) => {
      cy.visit(`/supervision/#/clients/${id}`);
    });
    cy.get('.TABS_FINANCEINFO').click();

    cy.get('.add-credit').should('not.exist');
    cy.get('.write-off').should('not.exist');
    cy.get('#add-finance-discount-button').should('not.exist');
    cy.get('#edit-finance-person-button').should('not.exist');
  });

  it('will show correct content for a finance manager', () => {
    cy.loginAs("Finance Manager");
    cy.get("@client").then(({ id }) => {
      cy.visit(`/supervision/#/clients/${id}`);
    });
    cy.get('.TABS_FINANCEINFO').click();

    cy.get('.add-credit').should('not.exist');
    cy.get('.write-off').should('not.exist');
    cy.get('#add-finance-discount-button').should('not.exist');
    cy.get('#edit-finance-person-button').should('be.visible');
  });
});

