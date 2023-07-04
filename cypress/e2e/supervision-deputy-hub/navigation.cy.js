describe("Navigation", { tags: ["@supervision-deputy-hub", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("Case Manager");
    cy.createADeputy({
      'deputyType': {'handle': 'PRO', 'label': 'Professional'},
      'deputySubType': {'handle': 'PERSON', 'label': 'Person'},
    });
  });

  });
});
