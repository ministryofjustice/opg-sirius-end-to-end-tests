beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient();
});

describe(
  "Add event to a client",
  { tags: ["@supervision", "client", "@smoke-journey", "supervision-notes"] },
  () => {
    it("Given I'm a Case Manager on Supervision, when I add an event, then Word formatting is cleaned", () => {
      cy.get("@client").then(({id, firstname, surname}) => {
        cy.visit("/supervision/#/clients/" + id);
        cy.contains(`${firstname} ${surname}`);
        cy.get('[id="create-event-button"]').click();
        cy.get('[name="FIELDLABELSNOTE_CATEGORY"]').should('be.visible', {timeout: 5000});
        cy.get('[name="FIELDLABELSNOTE_CATEGORY"]').first().click();
        cy.get('[name="FIELDLABELSNOTE_TYPE"]').should('be.visible', {timeout: 5000});
        cy.get('[name="FIELDLABELSNOTE_TYPE"]').last().select("Call");
        cy.get('[name="FIELDLABELSNOTE_DIRECTION"]').should('be.visible', {timeout: 5000});
        cy.get('[name="FIELDLABELSNOTE_DIRECTION"]').first().click();

        const data =
          "<p>Test this<strong> pasted </strong>data then.</p>";

        // ensure hugerte has loaded
        cy.get('.tox-statusbar', {timeout: 5000});
        cy.getEditorByLabel("Notes (optional)")
          .pasteText(data)
          .getContent()
          .then((content) => {
            expect(content).to.contain("<p>&lt;p&gt;Test this&lt;strong&gt; pasted &lt;/strong&gt;data then.&lt;/p&gt;</p>");
          })
        cy.contains("Save").should('be.visible', {timeout: 5000});
        cy.contains("Save").click();
        cy.contains("Timeline").click({timeout: 4000});
        cy.get('.event-note > .section-content > .wrapper').should('contain.text', data);
      });
    });
  }
);
