beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withOrder()
    .withDeputy();
});

describe(
  "Search bar",
  {tags: ["@supervision", "@client", "@smoke-journey"]},
  () => {

    it("finds the deputy by surname", () => {
        cy.visit("/supervision/#/dashboard");
        cy.get("@deputy").then(({firstname, salutation, surname}) => {
          cy.waitForSearchService(surname, ["Deputy"]).then(() => {
            cy.get(".search-bar__input").clear();
            cy.get(".search-bar__input").type(surname);

            cy.get(".search-bar__results").within(() => {
              cy.get(".search-bar__result").should("have.length.at.least", 1);
              cy.contains(`${salutation} ${firstname} ${surname}`)
                .click();
            });

            cy.get(".banner__deputy-wrap--name").contains(`${firstname} ${surname}`, {matchCase: false});
          })
        });
      }
    );
  });
