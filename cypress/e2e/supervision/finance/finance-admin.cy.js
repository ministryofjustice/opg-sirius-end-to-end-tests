import randomInt from "../../../support/random-int";
const dayjs = require("dayjs");

describe(
  "Finance hub",
  {
    tags: [
      "@supervision",
      "@supervision-regression",
      "@finance-hub",
      "@finance",
    ],
  },
  () => {
    beforeEach(() => {
      cy.loginAs("Finance User Testing");
      cy.visit(`/supervision`);
      cy.get("#finance-reporting-main-menu-link").click();
    });

    it("access finance reporting page", () => {
      cy.get("h1.banner__title").should("contain.text", "Finance admin");
    });

    it("download reporting files", () => {
      cy.get("#finance-pending-ledger-entries-button").click();
      cy.get("finance-download-reports h2").should("not.exist");
      cy.get("#finance-admin-reporting-button").click();
      cy.get("finance-download-reports h2")
        .should("be.visible")
        .and("contain.text", "Download reporting files");

      let reports = [
        { name: "New Cases Report" },
        { name: "Assessment Deputy Invoices Report", date: "08/08/2023" },
        {
          name: "Annual Supervision (non Direct Debit) Invoices Report",
          date: "08/08/2023",
        },
        {
          name: "Annual Supervision (Direct Debit) Invoices Report",
          date: "08/08/2023",
        },
        { name: "SF_Fee_Dat_file", date: "08/08/2023" },
        { name: "SO_Fee_Dat_file", date: "08/08/2023" },
        { name: "SE_Fee_Dat_file", date: "08/08/2023" },
        { name: "Fee reductions dat file (Direct debit and demanded)" },
        { name: "Fee reductions dat file (Direct debit only)" },
        { name: "CR1S Bulk Credit Request" },
        { name: "Bulk Write Off Request" },
        { name: "Unconfirmed Transactions" },
        { name: "Fee Chase" },
      ];

      reports.forEach((report) => {
        cy.reload();
        cy.get(
          ".in-page-success-banner:contains(Downloaded successfully)"
        ).should("not.exist");
        cy.get(
          `finance-download-reports-form label:contains(${report.name})`
        ).click();
        if (report.date) {
          cy.getDatePickerInputByLabel("Date invoice created").type(
            report.date
          );
        }
        cy.get("footer button:contains(Download)").click();
        cy.get(
          ".in-page-success-banner:contains(Downloaded successfully)"
        ).should("be.visible");
      });
    });

    it("Download Historic Reports", () => {
      cy.get("#finance-admin-reporting-button").click();
      cy.get(
        `finance-download-reports-form label:contains(New Cases Report)`
      ).click();
      cy.intercept("GET", "supervision-api/v1/finance/reports/cases").as(
        "datFile"
      );
      cy.get("footer button:contains(Download)").click();
      cy.wait("@datFile").then(({ response }) => {
        let regex =
            /attachment; filename=daily_newcases_.*_(?<batchNumber>\d+).xlsx/,
          batchNumber = regex.exec(
            response.headers["content-disposition"].toString()
          ).groups.batchNumber;
        cy.get("#finance-historic-reports-button").click();
        cy.get("finance-report-search-form text-field input").type(batchNumber);
        cy.get(".finance-historic-reports button:contains(Search)").click();
        cy.get(".finance-historic-reports-link a.download-document")
          .as("downloadLink")
          .should("be.visible");
        cy.intercept(
          "GET",
          "/api/v1/finance/reports/*?batchNumber=" + batchNumber
        ).as("fileDownload");
        cy.window().then((win) => {
          win.document.addEventListener("click", () => {
            setTimeout(() => {
              win.document.location.reload();
            }, 1000);
          });
          cy.get("@downloadLink").click();
        });
        cy.wait("@fileDownload")
          .its("response.statusCode")
          .should("equal", 200);
      });
    });

    it("Upload card payment data", () => {
      cy.get("#finance-upload-card-payment-data-button").click();
      cy.get("finance-upload-card-payment-data h2")
        .should("be.visible")
        .and("contain.text", "Upload card payment data");
      cy.get('[name="bankFile"]').selectFile(
        "cypress/fixtures/finance/empty.csv"
      );
      cy.intercept(
        "POST",
        "/supervision-api/v1/finance/reports/card-payments"
      ).as("formSubmit");
      cy.get(".finance-upload-date-form-button > .button").click();
      cy.wait("@formSubmit").its("response.statusCode").should("equal", 400);
      cy.get("validation-summary")
        .should("be.visible")
        .and("contain.text", "Card payment data failed to upload")
        .and("contain.text", "Value is required and can't be empty");
    });

    it("Annual Billing Year", () => {
      cy.get("#finance-annual-billing-year-button").click();
      cy.get(".finance-property-edit > h2").contains("Annual billing year");
      let newYear = randomInt(2000, 10000);
      cy.get('input[name="annualBillingYear"]')
        .invoke("val")
        .then((year) => {
          while (newYear.toString() === year.toString()) {
            newYear = randomInt(2000, 10000);
          }
          cy.get('input[name="annualBillingYear"]').clear();
          cy.get('input[name="annualBillingYear"]').click().type(newYear);
        });
      cy.get("button").contains("Update").click();
      cy.get("button").contains("Yes").click();
      cy.get(".in-page-banner").contains("Finance Property updated.");
      cy.reload();
      cy.get('input[name="annualBillingYear"]').should("have.value", newYear);
    });

    it("Import SOP numbers", () => {
      cy.get("#finance-import-sop-number-file-button").click();
      cy.createClient().then((client) => {
        let sopNumber = Date.now().toString();
        cy.get('[name="importSOPNumbers"]')
          .click()
          .selectFile({
            contents: Cypress.Buffer.from(
              "Customer Account  Number,MOJ - Casrec Ref\r\n" +
                sopNumber +
                ",OPG_" +
                client.caseRecNumber
            ),
            fileName: "sop_numbers.csv",
            mimeType: "text/csv",
            lastModified: Date.now(),
          });
        cy.get(".in-page-success-banner")
          .should("be.visible")
          .and("contain.text", "File uploaded successfully");
        cy.visit(`/supervision/#/clients/${client.id}`);
        cy.get(".TABS_FINANCEINFO").click();
        cy.get(`dt:contains(SOP Reference) + dd:contains(${sopNumber})`).should(
          "be.visible"
        );
      });
    });

    it("Import credits transaction register", () => {
      cy.get(
        "#finance-import-credits-transaction-register-file-button"
      ).click();
      cy.get("finance-import-credits-transaction-register-file h2")
        .should("be.visible")
        .and("contain.text", "Import credits transaction register");
      cy.intercept(
        "POST",
        "/supervision-api/v1/finance/reports/credits-transaction-register"
      ).as("formSubmit");
      cy.get(
        "finance-import-credits-transaction-register-file file-upload input"
      )
        .click()
        .selectFile("cypress/fixtures/finance/empty.csv");
      cy.wait("@formSubmit").its("response.statusCode").should("equal", 400);
      cy.get("validation-summary")
        .should("be.visible")
        .and("contain.text", "There is a problem")
        .and("contain.text", "Value is required and can't be empty");
    });

    it("Import invoices transaction register", () => {
      cy.get(
        "#finance-import-invoices-transaction-register-file-button"
      ).click();
      cy.get("finance-import-invoices-transaction-register-file h2")
        .should("be.visible")
        .and("contain.text", "Import invoices transaction register");
      cy.intercept(
        "POST",
        "/supervision-api/v1/finance/reports/invoices-transaction-register"
      ).as("formSubmit");
      cy.get(
        "finance-import-invoices-transaction-register-file file-upload input"
      )
        .click()
        .selectFile("cypress/fixtures/finance/empty.csv");
      cy.wait("@formSubmit").its("response.statusCode").should("equal", 400);
      cy.get("validation-summary")
        .should("be.visible")
        .and("contain.text", "There is a problem")
        .and("contain.text", "Value is required and can't be empty");
    });

    it("Upload aged debt analysis", () => {
      cy.get("#finance-upload-aged-debt-analysis-button").click();
      cy.get("finance-upload-aged-debt-analysis h2")
        .should("be.visible")
        .and("contain.text", "Upload aged debt analysis");
      cy.intercept(
        "POST",
        "/supervision-api/v1/finance/reports/aged-debt-analysis"
      ).as("formSubmit");
      cy.get("finance-upload-aged-debt-analysis file-upload input")
        .click()
        .selectFile("cypress/fixtures/finance/empty.csv");
      cy.wait("@formSubmit").its("response.statusCode").should("equal", 400);
      cy.get("validation-summary")
        .should("be.visible")
        .and("contain.text", "There is a problem")
        .and("contain.text", "Value is required and can't be empty");
    });

    describe("Finance hub tests requiring a client with SOP number and invoice", () => {
      beforeEach(() => {
        cy.createClient().withSOPNumber().withInvoice().withCreditMemo();
      });

      it("Upload BACS transfer data", () => {
        cy.get("#finance-upload-BACS-transfer-data-button").click();
        cy.get("finance-upload-bacs-transfer-data h2")
          .should("be.visible")
          .and("contain.text", "Upload BACS transfer data");
        cy.get("@client").then((client) => {
          cy.get("finance-upload-bacs-transfer-data file-upload input")
            .click()
            .selectFile({
              contents: Cypress.Buffer.from(
                `Line,Type,Code,Number,Transaction  Date,Value Date,Amount,Amount Reconciled,Charges,Status,Description,Consolidated line\r\n2,Receipt,TRFC,AGNES,20/09/2020,20/09/2020,100,,,Unreconciled,${client.caseRecNumber},`
              ),
              fileName: "bacs_payments.csv",
              mimeType: "text/csv",
              lastModified: Date.now(),
            });
        });
        cy.get(".in-page-success-banner")
          .should("be.visible")
          .and(
            "contain.text",
            "The file has been uploaded. We’ll email the Supervision Billing Teams inbox to let you know if the file has been processed or if there were any issues."
          );
      });
    });
    describe("Pending invoice adjustments", () => {
      beforeEach(() => {
        cy.loginAs("Finance User Testing");
        cy.createClient().withSOPNumber().withInvoice().withCreditMemo();

        cy.visit(`/supervision/#/finance-hub`);
        cy.get("#finance-reporting-main-menu-link")
          .should("be.visible")
          .click();
        cy.get("#finance-pending-ledger-entries-button")
          .should("be.visible")
          .click();
        cy.get(".section-title").should(
          "contain.text",
          "Pending invoice adjustments"
        );
        cy.get("@client").then(({ id }) => {
          cy.wrap(id).as("clientId");
        });
      });

      it("allows pending invoice adjustments to be approved", () => {
        cy.get("#approve-selected-adjustments").scrollIntoView();
        cy.get("#approve-selected-adjustments").should("be.disabled");
        cy.get("#decline-selected-adjustments").should("be.disabled");

        cy.get("@clientId").then((clientId) => {
          cy.get(`a[href="#/clients/${clientId}"]`).click();
        });

        cy.get(".TABS_FINANCEINFO").click();
        cy.get("@invoice").then(({ reference }) => {
          let dateToday = dayjs().format("DD/MM/YYYY");

          cy.get(
            ".ledger-entry-details .key-value-list__read-only > :nth-child(2)"
          ).contains("£20.00");
          cy.get(
            ".ledger-entry-details .key-value-list__read-only > :nth-child(4)"
          ).contains(dateToday);
          cy.get(
            ".ledger-entry-details .key-value-list__read-only > :nth-child(6)"
          ).contains(reference);
          cy.get(
            ".ledger-entry-details .key-value-list__read-only > :nth-child(6)"
          ).contains("Credit memo");
          cy.get(
            ".ledger-entry-details .key-value-list__read-only > :nth-child(10)"
          ).contains("Pending");

          cy.visit(`/supervision/#/finance-hub`);
          cy.get("#finance-pending-ledger-entries-button")
            .should("be.visible")
            .click();
          cy.contains("td", reference)
            .parent("tr")
            .within(() => {
              cy.contains("td", "£20.00").should(
                "have.class",
                "ledger-entries-list-item-amount"
              );
              cy.contains("td", "£100.00").should(
                "have.class",
                "ledger-entries-list-item-outstanding"
              );
              cy.contains("td", "Credit memo").should(
                "have.class",
                "ledger-entries-list-item-type"
              );
              cy.contains("td", reference).should(
                "have.class",
                "ledger-entries-list-item-invref"
              );
              cy.contains(
                "td",
                "Writing of part of the invoice something"
              ).should("have.class", "ledger-entries-list-item-notes");
              cy.get(':nth-child(1) > [type="checkbox"]').check();
            });

          cy.get("#approve-selected-adjustments").should("not.be.disabled");
          cy.get("#decline-selected-adjustments").should("not.be.disabled");
          cy.get("#approve-selected-adjustments").click();
          cy.get("dialog-box").should("be.visible");
          cy.get(".header-text").should(
            "contain.text",
            "Confirm Invoice Adjustments"
          );
          cy.get(".dialog-body").should("contain.text", reference);
          cy.get(".dialog-footer > .button").contains("Confirm").click();
          cy.contains("td", reference).should("not.exist");
        });

        cy.get("@clientId").then((clientId) => {
          cy.visit(`/supervision/#/clients/` + clientId);
        });

        cy.get(".TABS_FINANCEINFO").click();
        cy.get("@invoice").then(({ reference }) => {
          cy.get(
            ".ledger-entry-details .key-value-list__read-only > :nth-child(6)"
          ).contains(reference);
          cy.get(
            ".ledger-entry-details .key-value-list__read-only > :nth-child(10)"
          ).contains("Approved");
        });
      });

      it("allows pending invoice adjustments to be rejected", () => {
        cy.get("@invoice").then(({ reference }) => {
          cy.contains("td", reference)
            .parent("tr")
            .within(() => {
              cy.contains("td", reference).should("exist");
              cy.get(':nth-child(1) > [type="checkbox"]').check();
            });
          cy.get("#decline-selected-adjustments").click();
          cy.get(".dialog-body").should("contain.text", reference);
          cy.get(".dialog-footer > .button").contains("Confirm").click();
          cy.contains("td", reference).should("not.exist");
        });
        cy.get("@clientId").then((clientId) => {
          cy.visit(`/supervision/#/clients/` + clientId);
        });
        cy.get(".TABS_FINANCEINFO").click();
        cy.get("@invoice").then(({ reference }) => {
          cy.get(
            ".ledger-entry-details .key-value-list__read-only > :nth-child(6)"
          ).contains(reference);
          cy.get(
            ".ledger-entry-details .key-value-list__read-only > :nth-child(10)"
          ).contains("Rejected");
        });
      });
    });
  }
);
