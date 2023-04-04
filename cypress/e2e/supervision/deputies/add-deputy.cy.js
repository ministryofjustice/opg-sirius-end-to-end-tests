beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createAClient();
  cy.get("@clientId").then((clientId) => cy.createOrderForClient(clientId));
  cy.get("@clientId").then((clientId) => {cy.visit(`/supervision/#/clients/${clientId}`)});
});

describe(
  "Create deputy for client",
  { tags: ["@supervision", "@deputy", "supervision-core"] },
  () => {
    it("Given I'm a Case Manager on Supervision, I can add a deputy to a clients order using only mandatory fields. This deputy will then be selected as main correspondant and fee payer.", () => {
      cy.get("@clientId").then((clientId) => {
        cy.searchForADeputyToReachAddADeputyPage();
        cy.contains('Professional').should('be.visible');
        cy.get(':nth-child(2) > .radio-button').click();
        cy.get('.deputy-details-form-firstname').type("Patrick");
        cy.get('.deputy-details-form-surname').type("Star");
        cy.contains("Save & continue").should('be.visible');
        cy.contains("Save & continue").click();
        cy.get('.footer > .dotted-link').should('contain.text', 'Exit');
        cy.get('.footer > .dotted-link').click();
        cy.get('.TABS_DEPUTIES').click();
        cy.get('tr.summary-row > :nth-child(1) > .dotted-link').click();
        cy.get('.person-name').should('be.visible');
        cy.get('.person-name').should('contain.text', "Patrick Star");
        cy.get('.summary-row.open > :nth-child(1)').should('contain.text', "Patrick Star");
        cy.get('.deputy-details-type').should('contain.text', "Professional");
        cy.get('.deputy-relation-type').should('contain.text', "Professional");
        cy.get('.fee-payer').should('be.visible');
        cy.get('.main-contact').should('be.visible');
        cy.get('.order-details-main-correspondent').should('contain.text', 'Yes');
        cy.get('.order-details-fee-payer').should('contain.text', 'Yes');
      });
  });

    it("Greys out save and continue button when mandatory form fields not filled", () => {
      cy.get("@clientId").then((clientId) => {
        cy.searchForADeputyToReachAddADeputyPage();
        cy.contains('Lay').click();
        cy.get(':nth-child(1) > .radio-button').click();
        cy.get('.deputy-details-form-firstname').type("Squidward");
        cy.get('.footer > :nth-child(1) > .button').should('be.disabled');
      });
    });

    it("Allows a new fee payer to be set for an order", () => {
      cy.get("@clientId").then((clientId) => {
        cy.get('.TABS_DEPUTIES').click();
        cy.get("@orderId").then((orderId) => {
          cy.createADeputyAndAssignToExistingOrder(orderId);
        });

        // I can create a second deputy to set them as feepayer
        cy.searchForADeputyToReachAddADeputyPage();

        //check Lay type deputy
        cy.get(':nth-child(1) > .radio-button').click();
        cy.get('.deputy-details-form-firstname').type("Kermit");
        cy.get('.deputy-details-form-surname').type("Frog");
        cy.contains("Save & continue").click();
        cy.get('.standard-form').should('contain', "Occupation");
        cy.contains("Save & continue").click();
        cy.get('.standard-form').should('contain', "Type of deputy");
        cy.get('.field-wrapper > check-box.ng-untouched > .checkbox').click();
        cy.waitForStableDOM();
        cy.contains("Save & continue").click();
        cy.get('header > h1 > span').should('contain', "Make the deputy the fee payer?");
        cy.contains("Make the fee payer").click();

        cy.get('.TABS_DEPUTIES').click();
        cy.get(':nth-child(1) > :nth-child(1) > .summary-row-heading').should('contain.text', "Mr Abc Def");
        cy.get(':nth-child(3) > :nth-child(1) > .summary-row-heading').should('contain.text', "Kermit Frog");

        //make sure fee payer and main contact symbols visible under 2nd deputy
        cy.get(':nth-child(3) > :nth-child(6) > .fee-payer').should('be.visible');
        cy.get(':nth-child(3) > :nth-child(6) > .main-contact').should('be.visible');
        //make sure fee payer symbols not visible under 1st deputy
        cy.get(':nth-child(1) > :nth-child(6) > .fee-payer').should('not.to.exist');
      });
    });
  }
);
