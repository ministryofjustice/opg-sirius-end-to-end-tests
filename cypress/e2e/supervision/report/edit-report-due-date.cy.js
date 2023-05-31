beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withOrder()
    .withSupervisionLevel()
    .withOrderStatus()
});

describe(
  "Edit due report",
  {tags: ["@supervision", "@search", "supervision-core"]},
  () => {
    it("Successfully edit due date on report in supervision", () => {
      cy.get("@order").then(({id: orderId}) => {
        cy.get("@client").then(({id: clientId}) => {
          cy.visit(
            `/supervision/#/clients/${clientId}?order=${orderId}`
          );
        });
      });
      cy.get('.TABS_REPORTS').click();
      cy.get(':nth-child(1) > report-summary > .report-summary-container > .report-summary-action-panel > .lodge-report-container-parent > .extend-report-due-date-link').click();
      cy.get('#begin-extend-report-due-date-button > span').click();
      cy.get('.date-input').click().type("24 January 2023");
      cy.window()
        .its("tinyMCE")
        .its("activeEditor")
        .its("initialized", {timeout: 2000});
      cy.window().then((win) => {
        const data =
          '<p>I am extending the annual report</p>';
        let editor = win.tinymce.activeEditor;
        editor.dom.createRng();
        editor.execCommand("mceSetContent", false, data);
      });
      cy.get('[type="submit"]').click();
      cy.get('.button > span').click();
      cy.get(':nth-child(1) > report-summary > .report-summary-container > .report-summary-content-panel > .report-summary-content-details > .report-date-details > :nth-child(2) > .date-item-detail').contains('24 Jan 2023');
      }
    );
  });

