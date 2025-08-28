beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient();
});

Cypress._.times(20, () => {
  describe(
    "Add event to a client",
    { tags: ["@supervision", "client", "@smoke-journey", "supervision-notes"] },
    () => {
      it("Given I'm a Case Manager on Supervision, when I add an event, then Word formatting is cleaned",
        {
          retries: {
            runMode: 2,
            openMode: 0,
          },
        }, () => {
        cy.get("@client").then(({ id, firstname, surname }) => {
          cy.visit("/supervision/#/clients/" + id);
          cy.contains(`${firstname} ${surname}`);
          cy.get('[id="create-event-button"]').click();
          cy.url().should('contain', '/event/create');

          cy.get('[label="FIELDLABELS.NOTE_TYPE"]').should('be.visible', {timeout: 3000});
          cy.get('[label="FIELDLABELS.NOTE_TYPE"]').find('select').select("Call", { force: true });
          cy.contains('Direction').should('be.visible', { timeout: 5000 });
          cy.get('[label="FIELDLABELS.NOTE_DIRECTION"]').should('be.visible', { timeout: 5000 });
          cy.get('[label="FIELDLABELS.NOTE_DIRECTION"]').first().click();

          const data =
            "<p>Test this<strong> pasted </strong>data then.</p>";

          // comment in after huge rte changes
          // ensure hugerte has loaded
          // cy.get('.tox-statusbar', {timeout: 5000});
          // cy.getEditorByLabel("Notes (optional)")
          //   .pasteText(data)
          //   .getContent()
          //   .then((content) => {
          //     expect(content).to.contain("<p>&lt;p&gt;Test this&lt;strong&gt; pasted &lt;/strong&gt;data then.&lt;/p&gt;</p>");
          //   })
          // cy.contains("Save").should('be.visible', {timeout: 5000});
          // cy.contains("Save").click();
          // cy.contains("Timeline").click({timeout: 4000});
          // cy.get('.event-note > .section-content > .wrapper').should('contain.text', data);
        });
      });
    }
  );
});
