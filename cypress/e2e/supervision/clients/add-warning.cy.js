beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient();
});

describe(
  "Add a warning",
  { tags: ["@supervision", "client", "@smoke-journey"] },
  () => {
    it("successfully after checking you cant with out each mandatory fields", () => {
      cy.get("@client").then(({id}) => {
        cy.visit("/supervision/#/clients/" + id);
      });
      cy.get('#add-warning-button').click();
      cy.contains("Save & exit").should('be.disabled');

      cy.waitForTinyMCE()
        .enterText('<p>Warning has been added</p>');
      cy.contains("Save & exit").should('be.disabled');

      cy.contains("Warning type")
        .closest(".fieldset")
        .find("select")
        .select("1")
        .contains("Compensation Claim Pending");
      cy.waitForTinyMCE()
        .enterText('');
      cy.contains("Save & exit").should('be.disabled');

      cy.waitForTinyMCE()
        .enterText('<p>Warning has been added</p>');
      cy.contains("Save & exit").click();

      cy.get('div.panel > in-page-notification > .in-page-banner').contains('Warning created, redirecting...')
      cy.get('#tab-container').contains('Summary').click();
      cy.get('.warnings-list').contains('Compensation Claim Pending');
      cy.get('.client-priority-info > span').contains('Case has warnings');
    });
  }
);
