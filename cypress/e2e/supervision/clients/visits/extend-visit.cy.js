let reportDueDate = new Date();
reportDueDate.setDate(reportDueDate.getDate() + 1);

const tomorrowsDate = reportDueDate.toLocaleDateString('en-GB', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

reportDueDate.setDate(reportDueDate.getDate() + 7);

const nextWeekDate = reportDueDate.toLocaleDateString('en-GB', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient();
  cy.get("@client").then(({id}) => {
    cy.addVisitForClient(id)
  });
  cy.get("@visitId").then((visitId) => {
    cy.get("@client").then(({id}) => {
      let data = {
        "visitReportDueDate": tomorrowsDate,
        "whoToVisit": {
          "handle": "VPT-CLIENT",
          "label": "Client"
        }
      };
      cy.editVisitForClient(visitId, id, data);
    });
  });
});

describe(
  "Extend client visit",
  { tags: ["@supervision-core", "@visit", "@smoke-journey", "@extend-visit-report-due-date"] },
  () => {
    it("can extend a visit's report due date for an existing visit", () => {
      cy.get("@client").then(({id}) => {
        cy.visit(`/supervision/#/clients/${id}`);
        cy.get('#tab-container').contains('Visits').click();

        cy.get(".visit-type-field").contains("Supervision");
        cy.get(".visit-sub-type-field").contains("Pro Visit");
        cy.get(".visit-urgency-field").contains("Standard");
        cy.get(".visit-report-due-date-field").contains(tomorrowsDate);
        cy.get("visit-list-item-view").then(() => {
          cy.contains("Who to visit: Client")
          cy.contains("Supervision - Pro Visit - Standard");
          cy.contains("Visit report due by: " + tomorrowsDate)
        });
        cy.get(".extend-visit-report-due-date-button").click();

        cy.get("#extend-visit-report-due-date").as("extend-visit-report-due-date-panel");
        cy.get("@extend-visit-report-due-date-panel").within(() => {
          cy.get("#fIELDLABELSEXTENDEDVISITREPORTDUEDATE_day").clear();
          cy.get("#fIELDLABELSEXTENDEDVISITREPORTDUEDATE_day").type(reportDueDate.getDate());
          cy.get("#fIELDLABELSEXTENDEDVISITREPORTDUEDATE_month").clear();
          cy.get("#fIELDLABELSEXTENDEDVISITREPORTDUEDATE_month").type(reportDueDate.getMonth() + 1);
          cy.get("#fIELDLABELSEXTENDEDVISITREPORTDUEDATE_year").clear();
          cy.get("#fIELDLABELSEXTENDEDVISITREPORTDUEDATE_year").type(reportDueDate.getFullYear());
          cy.waitForTinyMCE()
            .enterText('<p>Because I said so</p>');
        });
        cy.intercept({
          method: "GET",
          url: `/supervision-api/v1/clients/${id}/visits`,
        }).as("getVisitsCall");
        cy.contains("Save & exit").click();
        cy.wait("@getVisitsCall").its("response.statusCode").should("equal", 200);

        cy.get(".visit-report-due-date-field").contains(nextWeekDate);

        cy.get("visit-list-item-view").then(() => {
          cy.contains("Visit report due by: " + nextWeekDate)
        });
      });
      cy.get('#tab-container').contains('Timeline').click();
      cy.get(".timeline-event-title", { timeout: 30000 })
        .should("contain", "Visit report due date extended");
      cy.get(".timeline-extended-visit-report-due-date").contains(nextWeekDate);
      cy.get(".timeline-reason-for-visit-report-due-date-extension").contains("Because I said so");
    }
  );
});
