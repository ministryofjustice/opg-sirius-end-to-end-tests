beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient();
  cy.get("@client").then(({id}) => {
    cy.addVisitForClient(id)
  });
  cy.get("@visitId").then((visitId) => {
    cy.get("@client").then(({id}) => {
      let data = {
        "visitReportDueDate": "22/03/2023",
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
        cy.get(".TABS_VISITS button").click();

        cy.get(".visit-type-field").contains("Supervision");
        cy.get(".visit-sub-type-field").contains("Pro Visit");
        cy.get(".visit-urgency-field").contains("Standard");
        cy.get(".visit-report-due-date-field").contains("22/03/2023");
        cy.get("visit-list-item-view").then(() => {
          cy.contains("Who to visit: Client")
          cy.contains("Supervision - Pro Visit - Standard");
          cy.contains("Visit report due by: 22/03/2023")
        });
        cy.get(".extend-visit-report-due-date-button").click();

        cy.get("#extend-visit-report-due-date").as("extend-visit-report-due-date-panel");
        cy.get("@extend-visit-report-due-date-panel").within(() => {
          cy.get("#fIELDLABELSEXTENDEDVISITREPORTDUEDATE_day").clear();
          cy.get("#fIELDLABELSEXTENDEDVISITREPORTDUEDATE_day").type("01");
          cy.get("#fIELDLABELSEXTENDEDVISITREPORTDUEDATE_month").clear();
          cy.get("#fIELDLABELSEXTENDEDVISITREPORTDUEDATE_month").type("04");
          cy.get("#fIELDLABELSEXTENDEDVISITREPORTDUEDATE_year").clear();
          cy.get("#fIELDLABELSEXTENDEDVISITREPORTDUEDATE_year").type("2023");
          cy.window()
            .its("tinyMCE")
            .its("activeEditor")
            .its("initialized", {timeout: 2000});
          cy.window().then((win) => {
            const data =
              '<p>Because I said so</p>';
            let editor = win.tinymce.activeEditor;
            editor.dom.createRng();
            editor.execCommand("mceSetContent", false, data);
          });
        });
        cy.intercept({
          method: "GET",
          url: `/supervision-api/v1/clients/${id}/visits`,
        }).as("getVisitsCall");
        cy.contains("Save & exit").click();
        cy.wait("@getVisitsCall").its("response.statusCode").should("equal", 200);
        cy.get(".visit-report-due-date-field").contains("01/04/2023");
        cy.get("visit-list-item-view").then(() => {
          cy.contains("Visit report due by: 01/04/2023")
        });
      });
      cy.get(".TABS_TIMELINELIST").click();
      cy.get(".timeline-event-title", { timeout: 30000 })
        .should("contain", "Visit report due date extended");
      cy.get(".timeline-extended-visit-report-due-date").contains("01/04/2023");
      cy.get(".timeline-reason-for-visit-report-due-date-extension").contains("Because I said so");
    }
  );
});
