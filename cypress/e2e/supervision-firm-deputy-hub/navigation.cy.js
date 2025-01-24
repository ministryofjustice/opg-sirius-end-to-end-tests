describe(
  "Navigation",
  { tags: ["@supervision-firm-deputy-hub", "@smoke-journey"] },
  () => {
    beforeEach(() => {
      cy.loginAs("Finance Manager");
      cy.createAFirm();
    });

    it("tests header navigation", () => {
      let expectedHeaderLinks = {
        poaUrl: { visible: true, current: false },
        supervisionUrl: { visible: true, current: false },
        adminUrl: { visible: true, current: false },
        signOutUrl: { visible: true, current: false },
      };

      let expectedNavigationLinks = {
        createClientUrl: { visible: true, current: false },
        workflowUrl: { visible: true, current: false },
        // guidanceUrl: { visible: true, current: false },
        // financeUrl: { visible: true, current: false },
      };

      cy.assertHeaderWorks(
        "firm-hub",
        expectedHeaderLinks,
        expectedNavigationLinks
      );
    });
  }
);
