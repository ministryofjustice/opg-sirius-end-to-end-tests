beforeEach(() => {
  cy.loginAs("Finance Manager");
  cy.createClient();
});

describe(
  "Create a manual invoice",
  {
    tags: ["@supervision-core", "@client-risk", "@smoke-journey"],
  },
  () => {
    it("successfully add a manual invoice and also see validation error", () => {
      cy.get("@client").then(({id}) => {
        cy.visit(`/supervision/#/clients/${id}`);
      });

      cy.get("button").contains("Add manual invoice").click();

      cy.get('multi-options.ng-untouched').within(() => {
        cy.contains("AD")
          .closest(".fieldset")
          .find("select")
          .select("0");
      });

      cy.get('#raisedDate_day').type('01')
      cy.get('#raisedDate_month').type('04')
      cy.get('#raisedDate_year').type('2020')

      cy.get('.amount > .fieldset').type("321")

      cy.get("button").contains("Create manual invoice").click()

      cy.get('.validation-summary').should("be.visible")
        .and("contain.text", "There appears to be a problem")
        .and("contain.text", "The amount for an AD fee must be £100");

      cy.get("button").contains("Create manual invoice").click()

      cy.get(".TABS_TIMELINELIST").click();
      cy.get(".timeline-event-title", {timeout: 30000}).should(
        "contain",
        "Manual Invoice Created"
      );
    });
  }
);
