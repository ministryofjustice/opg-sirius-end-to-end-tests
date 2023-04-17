beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createAClient();
});

describe(
  "Record a client risk score",
  {
    tags: ["@supervision-core", "@client-risk", "@smoke-journey"],
  },
  () => {
    it("Records a client risk score", () => {
      cy.get("@clientId").then((clientId) => {
        cy.visit(`/supervision/#/clients/${clientId}`);
      });

      cy.get("button").contains("Record client risk score").click();

      cy.get("#edit-client-risk-score").within(() => {
        cy.contains("Client Risk Evaluation Criteria")
          .closest(".fieldset")
          .find("select")
          .select("1"); // the values are indexed from zero so this actually selects "2"...

        cy.window()
          .its("tinyMCE")
          .its("activeEditor")
          .its("initialized", { timeout: 2000 });
        cy.window().then((win) => {
          const data = "<p>Risk score added</p>";
          const editor = win.tinymce.activeEditor;
          editor.dom.createRng();
          editor.execCommand("mceSetContent", false, data);
        });
      });

      cy.contains("Save & exit")
        .click()
        .then(() => {
          cy.get(".client-summary", {
            timeout: 30000,
          }).within(() => {
            cy.contains("Risk score").siblings().last().contains("2");
          });

          cy.get(".TABS_TIMELINELIST").click();

          cy.get(".timeline-event-title", { timeout: 30000 })
            .contains("Client risk score updated")
            .closest(".wrapper")
            .within(() => {
              cy.get("li")
                .first()
                .should("match", /Previous client risk score\s+Not Set/)
                .next()
                .should("match", /New client risk score\s+2/);
              cy.contains(
                ".client-risk-score-recorded-notes",
                "Risk score added"
              );
            });
        });
    });
  }
);
