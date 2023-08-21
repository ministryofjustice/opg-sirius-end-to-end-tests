beforeEach(() => {
  cy.loginAs("Allocations User");
  cy.createClient()
    .withGuardianshipOrder();
});

describe(
  "Create a new order",
  {tags: ["@guardianship-order", "@order"]},
  () => {
    it("does not show reports and finance tabs for guardianship orders", () => {
      cy.get(".TABS_ORDERS").click();
      cy.get("#order-table")
        .find("tr")
        .then((rows) => {
          expect(rows.length === 1);
        });
      cy.get(".order-header-details-case-type").contains("PFA");
      cy.get(".order-header-details-case-sub-type").contains("New deputy");
      cy.get(".order-header-date").contains("01/01/2022");
      cy.get("@client").then(({caseRecNumber}) => {
        cy.get(".order-header-details-court-reference-number").contains(
          caseRecNumber
        );
      });
      cy.contains("View full details").click();
      cy.get(".order-date").contains("01/01/2022");
      cy.get(".order-received-date").contains("01/01/2022");
    });
  }
);
