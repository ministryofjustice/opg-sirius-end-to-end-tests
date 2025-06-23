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
          cy.get(".tox-edit-area__iframe", { timeout: 10000 })
            .should("be.visible")
            .scrollIntoView();

          const data =
            '<p class="MsoNormal" style="margin: 0cm 0cm 11.25pt; font-size: 12pt; font-family: Calibri, sans-serif; text-align: justify; background: white;"><span style="font-size: 10.5pt; font-family: &quot;Open Sans&quot;, sans-serif;">Test</span><span style="font-size: 10.5pt; font-family: &quot;Open Sans&quot;, sans-serif; color: rgb(192, 0, 0);"> this</span><span style="font-size: 10.5pt; font-family: &quot;Open Sans&quot;, sans-serif;"><b> pasted </b>data then.<o:p></o:p></span></p>';

          cy.waitForTinyMCE()
            .pasteText(data)
            .getContent()
            .then((content) => {
              expect(content).to.contain(
                "<p>Test this<strong> pasted </strong>data then.</p>"
              );
              expect(content).to.not.contain("Calibri");
              expect(content).to.not.contain("MsoNormal");
              expect(content).to.not.contain("span");
            })
        });
      });
    }
  );
});
