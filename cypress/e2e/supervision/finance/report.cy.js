// const adjustInvoice = (clientId) => {
//   cy.request({
//     url: `/supervision-api/v1/finance/${clientId}/invoices`,
//     headers: {
//       accept: "application/json",
//       "opg-bypass-membrane": 1,
//     },
//   })
//     .its("body")
//     .then((invoices) => {
//       cy.wrap(invoices[0].id).as("invoiceId");
//     });
//   let invoiceAdjustmentBody = {
//     amount: "20",
//     notes: "<p>Writing of part of the invoice something</p>",
//     type: "CREDIT MEMO"
//   }
//   cy.get("@invoiceId").then((invoiceId) => {
//     cy.get("@client").then(({id}) => {
//       cy.postToApi(
//         `/supervision-api/v1/finance/${id}/invoice/${invoiceId}/ledger-entries`,
//           invoiceAdjustmentBody
//       );
//     });
//   });
// };

describe(
  "Finance hub",
  { tags: ["@supervision", "@supervision-regression", "@finance-hub", "@finance"] },
  () => {

    beforeEach(() => {
      cy.loginAs("Finance User Testing");
      cy.createClient()
        .withSOPNumber()
        .withInvoice()
        .withCreditMemo()

      cy.get("@client").then(({ id }) => {
        cy.visit(`/supervision/#/clients/${id}`);
        cy.get('#finance-reporting-main-menu-link').click();
      });
    });

    it("pending invoice adjustment approve and decline", () => {
      cy.get('#finance-pending-ledger-entries-button').click();
        cy.get("@invoice").then(({ reference }) => {
            cy.get(`.ledger-entries-list-item:contains(${reference}) .ledger-entries-list-item-selected`).click()
        });
      cy.get('#decline-selected-adjustments').click();
      cy.get('.dialog-footer > .button').click();
        cy.get("@client").then(({ id }) => {
            cy.visit(`/supervision/#/clients/${id}`);
        });
        cy.get('.TABS_FINANCEINFO').click();
        cy.get('.ledger-entry-details').within(() => {
            cy.get('dt:contains(Transaction Status) + dd:contains(Rejected)').should('be.visible')
        });
      // cy.get('#approve-selected-adjustments').should('be.disabled');
      // cy.get('#decline-selected-adjustments').should('be.disabled');
      // cy.get('.ledger-entries-list-item-selected').first().click();
      // cy.get('#approve-selected-adjustments').click();
      // cy.get('.dialog-footer > .button').click();
    });

    // it("Download Historic Reports", () => {
    //   cy.request({
    //     url: `supervision-api/v1/finance/reports/cases`,
    //     headers: {
    //       accept: "application/json",
    //       "opg-bypass-membrane": 1,
    //     },
    //   })
    //   cy.get('#finance-historic-reports-button').click();
    //   cy.get('.fieldset').click().type("1");
    //   cy.get('.finance-historic-reports > .button').click();
    //   cy.get('.finance-historic-reports-link').should('be.visible');
    // });

    // it("Upload card payment data", () => {
    //   cy.get('#finance-upload-card-payment-data-button').click();
    //   cy.get('[name="bankFile"]').selectFile('cypress/fixtures/report/cardPayment.csv');
    //   cy.get('.finance-upload-date-form-button > .button').click();
    // });
    //
    // it("Annual Billing Year", () => {
    //   cy.get('#finance-annual-billing-year-button').click();
    //   cy.get('.finance-property-edit > h2').contains('Annual billing year')
    //   cy.get('input[name="annualBillingYear"]').clear();
    //   cy.get('input[name="annualBillingYear"]').click().type("2020");
    //   cy.get("button").contains("Update").click();
    //   cy.get("button").contains("Yes").click();
    //   cy.get('.in-page-banner').contains('Finance Property updated.');
    // });

    // it("Import SOP numbers", () => {
    // may need to move this one as this client has a sop number
    //   cy.get('#finance-import-sop-number-file-button').click();
      // cy.get('[name="importSOPNumbers"]').selectFile('cypress/fixtures/report/cardPayment.csv');
    // });

    // it("Import credits transaction register", () => {
    //   cy.get('#finance-import-credits-transaction-register-file-button').click();
    //   cy.get('[name="importCreditsTransactionRegister"].selectFile('cypress/fixtures/report/creditTransaction.csv')
    // });

    // it("Import invoices transaction register", () => {
    //   cy.get('#finance-import-invoices-transaction-register-file-button').click();
    //   cy.get('[name="importInvoicesTransactionRegister"]').selectFile('cypress/fixtures/report/invoiceTransaction.csv')
    // });

    // it("Upload BACS transfer data", () => {
    //   cy.get('#finance-upload-BACS-transfer-data-button').click();
    //   cy.get('[name="uploadBACSTransferData"]').selectFile('cypress/fixtures/report/bacs.csv')
    // });

    // it("Upload aged debt analysis", () => {
    //   cy.get('#finance-upload-aged-debt-analysis-button').click();
    //   cy.get('[name="uploadAgedDebtAnalysis"]').selectFile('cypress/fixtures/report/ageDebt.csv')
    // });
  });
