beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient();
});
Cypress._.times(10, () => {
  describe(
    "Add event to a client",
    { tags: ["@supervision", "client", "@smoke-journey", "supervision-notes"] },
    () => {
      it("Given I'm a Case Manager on Supervision, when I add an event, then Word formatting is cleaned", () => {
        cy.get("@client").then(({ id, firstname, surname }) => {
          cy.visit("/supervision/#/clients/" + id);
          cy.contains(`${firstname} ${surname}`);
          cy.get('[id="create-event-button"]').click();

          const data =
            "<p>Test this<strong> pasted </strong>data then.</p>";

          cy.getEditorByLabel("Notes (optional)")
            .pasteText(data)
            .getContent()
            .then((content) => {
              expect(content).to.contain(
                "<p>Test this<strong> pasted </strong>data then.</p>"
              );
            })
        });
      });
    }
  );
});
