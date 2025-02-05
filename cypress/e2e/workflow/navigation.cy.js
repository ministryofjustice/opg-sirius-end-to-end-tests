describe("Navigation", { tags: ["@workflow", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("Finance Manager");
  });

  it("tests header navigation", () => {
    let expectedHeaderLinks = {
      poaUrl: { current: false },
      supervisionUrl: { current: false },
      adminUrl: { current: false },
      signOutUrl: { current: false },
    };

    let expectedNavigationLinks = {
      createClientUrl: { current: false },
      workflowUrl: { current: true },
      // financeUrl: { current: false },
    };

    cy.assertHeaderWorks(
      "workflow",
      expectedHeaderLinks,
      expectedNavigationLinks
    );
  });


  it("tests help and guidance link", () => {
    cy.checkGuidanceLinkWorks("workflow");
  });

  it("tests pagination", () => {
    cy.visit('/supervision/workflow/client-tasks')
  });
});
