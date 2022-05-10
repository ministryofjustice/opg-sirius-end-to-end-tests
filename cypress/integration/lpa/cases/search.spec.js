describe("Searching for a case", { tags: ["@lpa", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("LPA Manager");
    cy.createDonor().then(({ id: donorId }) => {
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.wrap(donorId).as("donorId");
        cy.wrap(lpaId).as("lpaId");
      });
    });
  });

  it("selected search result navigates user to the correct case", function () {
    cy.visit(`/lpa/home`);

    cy.get("#searchKeyword").type('Bob Sponge');
    cy.get(".search-form > form").submit();

    cy.get("ul[role=list]").first().contains('Bob Sponge');
    cy.get("ul[role=list]").last().contains('Bob Sponge');

    cy.get("[role=list] > :nth-child(4)").contains("Case:")
      .then($searchResult => {
        const lpaId = $searchResult.text().replace(/[^\d-]/g, '');
        cy.wrap(lpaId).as("lpaId");
        cy.wrap($searchResult).click();
      });

    cy.get("@lpaId").then(lpaId => {
      cy.contains(`${this.lpaId}`);
      cy.contains('Bob Sponge');
    });
  });
});
