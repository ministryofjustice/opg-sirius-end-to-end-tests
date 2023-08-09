describe("Navigation", {tags: ["@workflow", "@smoke-journey"]}, () => {
  beforeEach(() => {
    cy.loginAs("Case Manager");
  })

  it("tests header navigation", () => {
    let expectedHeaderLinks = {
      "poaUrl": {visible: true, current: false},
      "supervisionUrl": {visible: false, current: true},
      "adminUrl": {visible: true, current: false},
      "signOutUrl": {visible: true, current: false}
    }

    let expectedNavigationLinks = {
      "createClientUrl": {visible: true, current: false},
      "workflowUrl": {visible: true, current: true},
      "financeUrl": {visible: true, current: false},
    }

    cy.assertHeaderWorks('workflow', expectedHeaderLinks, expectedNavigationLinks);
  })
});

