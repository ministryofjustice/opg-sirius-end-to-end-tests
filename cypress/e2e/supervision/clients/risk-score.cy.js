beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient();
});

describe(
  "Record a client risk score",
  {
    tags: ["@supervision-core", "@client-risk", "@smoke-journey"],
  },
  () => {
    it("Records a client risk score", () => {
      cy.get("@client").then(({id}) => {
        cy.visit(`/supervision/#/clients/${id}`);
      });

      cy.get("button").contains("Record client risk score").click();

      cy.get("#edit-client-risk-score").within(() => {
        cy.contains("Client Risk Evaluation Criteria")
          .closest(".fieldset")
          .find("select")
          .select("1"); // the values are indexed from zero so this actually selects "2"...

        cy.waitForTinyMCE()
          .enterText('<p>Risk score added</p>');
      });

      cy.contains("Save & exit")
        .click()
        .then(() => {
          cy.get(".client-summary", {
            timeout: 30000,
          }).within(() => {
            cy.contains("Risk score").siblings().last().contains("2");
          });

          cy.get('#tab-container').contains('Timeline').click();

          cy.get(".timeline-event-title", { timeout: 30000 })
            .contains("Client risk score updated")
            .closest(".wrapper")
            .within(() => {
              cy.get("li")
                .first()
                .within(() => {
                  cy.contains(/^Previous client risk score\s+Not Set/);
                })
                .next()
                .within(() => {
                  cy.contains(/^New client risk score\s+2/);
                });
            });
        });
    });
  }
);
