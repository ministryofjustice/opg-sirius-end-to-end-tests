describe(
  "Navigation",
  { tags: ["@supervision-deputy-hub", "@smoke-journey"] },
  () => {
    beforeEach(() => {
      cy.loginAs("Finance Manager");
      cy.createADeputy({
        deputyType: { handle: "PRO", label: "Professional" },
        deputySubType: { handle: "PERSON", label: "Person" },
      });
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
        "deputy-hub",
        expectedHeaderLinks,
        expectedNavigationLinks
      );
    });

    it("tests help and guidance link", () => {
      cy.checkGuidanceLinkWorks("deputy-hub");
    });

  }
);
