beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient();
  cy.get("@client").then(({id}) => {
    cy.addVisitForClient(id)
  });
});

describe(
  "Edit client visit",
  { tags: ["@supervision", "@client", "@smoke-journey", "@supervision-notes"] },
  () => {
    it("Given I'm a Case Manager on Supervision, I edit an existing visit", () => {
      cy.get("@client").then(({id}) => {
          cy.visit(`/supervision/#/clients/${id}`)
        }
      );

      cy.get(".TABS_VISITS button").click();

      cy.contains("Supervision - Pro Visit - Standard");
      cy.get(".edit-visit-button").click();

      cy.get("input[data-core-value='VPT-CLIENT']").click({force:true});
      cy.get("button[type='submit']").click();

      cy.get("visit-list-item-view").then(() => {
        cy.contains("Who to visit: Client")
      });
    }
  );
});
