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

    Cypress._.times(30, () => {
      it("tests header navigation", () => {
        let expectedHeaderLinks = {
          poaUrl: { current: false, opensInNewTab: false },
          supervisionUrl: { current: false, opensInNewTab: false },
          adminUrl: { current: false, opensInNewTab: false },
          signOutUrl: { current: false, opensInNewTab: false },
        };

        let expectedNavigationLinks = {
          createClientUrl: { current: false, opensInNewTab: false },
          workflowUrl: { current: false, opensInNewTab: false },
          guidanceUrl: { current: false, opensInNewTab: true },
          // financeUrl: { current: false, opensInNewTab: true },
        };

        cy.assertHeaderWorks(
          "deputy-hub",
          expectedHeaderLinks,
          expectedNavigationLinks
        );
      });
    });
  }
);
