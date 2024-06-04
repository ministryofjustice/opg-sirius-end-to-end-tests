describe("Navigation", { tags: ["@workflow", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("Finance Manager");
  });

  it("tests header navigation", () => {
    let expectedHeaderLinks = {
      poaUrl: { visible: true, current: false },
      // supervisionUrl: { visible: true, current: false },
      adminUrl: { visible: true, current: false },
      signOutUrl: { visible: true, current: false },
    };

    let expectedNavigationLinks = {
      createClientUrl: { visible: true, current: false },
      workflowUrl: { visible: true, current: true },
      // guidanceUrl: { visible: true, current: false },
      financeUrl: { visible: true, current: false },
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
