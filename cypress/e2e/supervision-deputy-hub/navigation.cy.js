describe("Navigation", { tags: ["@supervision-deputy-hub", "@smoke-journey"] }, () => {
  it("tests header", () => {
    cy.loginAs("Case Manager");
    cy.createADeputy({
      'deputyType': {'handle': 'PRO', 'label': 'Professional'},
      'deputySubType': {'handle': 'PERSON', 'label': 'Person'},
    });
    cy.testHeaderNavigation('deputy-hub');
  })
});

