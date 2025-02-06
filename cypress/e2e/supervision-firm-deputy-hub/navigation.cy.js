describe(
  "Navigation",
  { tags: ["@supervision-firm-deputy-hub", "@smoke-journey"] },
  () => {
    beforeEach(() => {
      cy.loginAs("Finance Manager");
      cy.createAFirm();
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
          "firm-hub",
          expectedHeaderLinks,
          expectedNavigationLinks
        );
      });
    });
  }
);
