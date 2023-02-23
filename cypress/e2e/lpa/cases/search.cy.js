describe("Searching for a case", { tags: ["@lpa", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("LPA Manager");
    cy.createDonor().then(({ id: donorId }) => {
      cy.createLpa(donorId).then(({ uId: lpaUid }) => {
        cy.wrap(donorId).as("donorId");
        cy.wrap(lpaUid).as("lpaUid");
      });
    });
  });

  it("selected search result navigates user to the correct case", function () {
    cy.visit(`/lpa/home`);
    cy.waitForStableDOM();

    cy.get("#searchKeyword").type(`${this.lpaUid}`);
    cy.get(".search-form > form").submit();

    cy.contains("li", "Bob Sponge").contains(`${this.lpaUid}`).click();

    cy.get("h1").contains("Bob Sponge");
    cy.contains(`${this.lpaUid}`);
  });
});
