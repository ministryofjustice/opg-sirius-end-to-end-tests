describe("Navigation", { tags: ["@workflow", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("Finance Manager");
  });

  it("tests header navigation", () => {
    let expectedHeaderLinks = {
      poaUrl: { current: false, opensInNewTab: false },
      supervisionUrl: { current: false, opensInNewTab: false },
      adminUrl: { current: false, opensInNewTab: false },
      signOutUrl: { current: false, opensInNewTab: false },
    };

    let expectedNavigationLinks = {
      createClientUrl: { current: false, opensInNewTab: false },
      workflowUrl: { current: true, opensInNewTab: false },
      guidanceUrl: { current: false, opensInNewTab: true },
      // financeUrl: { current: false, opensInNewTab: true },
    };

    cy.assertHeaderWorks(
      "workflow",
      expectedHeaderLinks,
      expectedNavigationLinks
    );
  });

  it("tests pagination", () => {
    cy.visit('/supervision/workflow/client-tasks')
  });
});
