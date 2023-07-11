 describe(
  "Finance tab",
  { tags: ["@supervision", "@supervision-regression"] },
  () => {

    beforeEach(() => {
      cy.loginAs("Finance User Testing");
      cy.createClient()
        .withOrder()
        .withSupervisionLevel()
        .withOrderStatus();
      cy.get("@client").then(({ caseRecNumber }) => {
        cy.assignSOPNumberToClient(caseRecNumber)
      });
      cy.get("@client").then(({ id }) => {
        cy.visit(`/supervision/#/clients/${id}`);
      });
      cy.get('.TABS_FINANCEINFO').click();
    });

    it("allows me to add credit and shows this correctly in the finance invoice list", () => {
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

    it('allows me to award a fee reduction', () => {
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

    it('can show annual fee information', () => {
      let $response = [
        {
          "amountPaid": 0,
          "amountOutstanding": 100,
          "status": {
            "handle": "OPEN",
            "label": "Open"
          },
          "sopStatus": {
            "handle": "CONFIRMED",
            "label": "Confirmed"
          },
          "allowedActions": [
            {
              "handle": "CREDIT",
              "label": "Add Credit"
            },
            {
              "handle": "WRITE OFF",
              "label": "Write-off"
            }
          ],
          "id": 4,
          "feeType": "AD",
          "reference": "AD000001\/23",
          "raisedDate": "10\/07\/2020",
          "startDate": "10\/07\/2020",
          "endDate": "09\/07\/2021",
          "amount": 100,
          "feeRanges": [
            {
              "supervisionLevel": {
                "handle": "GENERAL",
                "label": "General"
              },
              "fromDate": "01\/04\/2022",
              "toDate": "31\/03\/2024",
              "amount": 100
            }
          ],
          "ledgerEntryAllocations": [
            {
              "allowedActions": [],
              "id": 1,
              "ledgerEntry": {
                "id": 1,
                "type": {
                  "handle": "CARD PAYMENT",
                  "label": "Card payment"
                },
                "reference": "AD000001\/23",
                "dateTime": "2020-07-10T00:00:00+00:00",
                "method": "CARD PAYMENT",
                "amount": 10000,
                "amountAllocated": 10000,
                "amountUnallocated": 0,
                "status": {
                  "handle": "APPROVED",
                  "label": "Approved"
                },
                "ledgerEntryAllocations": [],
                "childLedgerEntries": [],
                "confirmedDate": "10\/07\/2020",
                "isFeeWaiver": false,
                "allowedActions": []
              },
              "dateTime": "2020-07-10T00:00:00+00:00",
              "amount": 10000,
              "status": {
                "handle": "ALLOCATED",
                "label": "Applied"
              },
              "allocatedDate": "10\/07\/2020"
            }
          ],
          "batchNumber": 2,
          "confirmedDate": "10\/07\/2020"
        }
      ];
      cy.get("@client").then(({ id }) => {
        cy.intercept("GET", `/supervision-api/v1/finance/${id}/invoices`, $response)
      });
      cy.get('span > .full-details').should('be.visible');
      cy.get('span > .full-details').click();
      cy.get('.invoice-fee-range-item-supervision-level').should('contain.text', 'General');
      cy.get('.invoice-fee-range-item-amount').should('contain.text', '£100');
      cy.get('.invoice-fee-range-item-from-date').should('contain.text', '01/04/2022');
      cy.get('.invoice-fee-range-item-to-date').should('contain.text', '31/03/2024');
    });
  });
describe(
  "Finance tab user permissions",
  { tags: ["@supervision", "@supervision-regression"] },
  () => {

    beforeEach(() => {
      cy.loginAs("Finance User Testing");
      cy.createClient()
        .withOrder()
        .withSupervisionLevel()
        .withOrderStatus();
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

