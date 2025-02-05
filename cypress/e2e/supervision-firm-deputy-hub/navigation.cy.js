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
        poaUrl: { current: false },
        supervisionUrl: { current: false },
        adminUrl: { current: false },
        signOutUrl: { current: false },
      };

      let expectedNavigationLinks = {
        createClientUrl: { current: false },
        workflowUrl: { current: false },
        // financeUrl: { current: false },
      };

      cy.assertHeaderWorks(
        "firm-hub",
        expectedHeaderLinks,
        expectedNavigationLinks
      );
    });

    it("tests help and guidance link", () => {
      cy.checkGuidanceLinkWorks("firm-hub");
    });
  }
);
