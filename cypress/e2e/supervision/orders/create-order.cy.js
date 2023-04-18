beforeEach(() => {
  cy.loginAs("Allocations User");
  cy.createAClient();
});

describe(
  "Create a new order",
  { tags: ["@supervision-core", "@order", "@smoke-journey"] },
  () => {
    it("creates a supervised pfa order in supervision with mandatory fields as a system admin", () => {
      cy.intercept({
        method: "GET",
        url: "/supervision-api/v1/bond-providers",
      }).as("bondProviderCall");
      cy.loginAs("System Admin");
      cy.createOrder("Property & affairs", "New deputy", "01/01/2022", false);
      cy.wait("@bondProviderCall").then(() => {
        cy.contains("Cancel").click();
      });
      cy.get(".TABS_ORDERS").click();
      cy.get("#order-table")
        .find("tr")
        .then((rows) => {
          expect(rows.length === 1);
        });
      cy.get(".order-header-details-case-type").contains("PFA");
      cy.get(".order-header-details-case-sub-type").contains("New deputy");
      cy.get(".order-header-date").contains("01/01/2022");
      cy.get("@clientCourtReference").then((clientCourtReference) => {
        cy.get(".order-header-details-court-reference-number").contains(
          clientCourtReference
        );
      });
      cy.contains("View full details").click();
      cy.get(".order-date").contains("01/01/2022");
      cy.get(".order-received-date").contains("01/01/2022");
    });

    it("creates a supervised h&w order in supervision with mandatory fields as an allocations user", () => {
      cy.createOrder("Health & welfare", "New deputy", "01/01/2022", false);
      cy.get(".TABS_ORDERS").click();
      cy.get("#order-table")
        .find("tr")
        .then((rows) => {
          expect(rows.length === 1);
        });
      cy.get(".order-header-details-case-type").contains("H&W");
      cy.get(".order-header-details-case-sub-type").contains("New deputy");
      cy.get(".order-header-date").contains("01/01/2022");
      cy.get("@clientCourtReference").then((clientCourtReference) => {
        cy.get(".order-header-details-court-reference-number").contains(
          clientCourtReference
        );
      });
      cy.contains("View full details").click();
      cy.get(".order-date").contains("01/01/2022");
      cy.get(".order-received-date").contains("01/01/2022");
    });

    it("creates a supervised pfa order in supervision with mandatory and optional fields as a system admin", () => {
      cy.intercept({
        method: "GET",
        url: "/supervision-api/v1/bond-providers",
      }).as("bondProviderCall");
      cy.loginAs("System Admin");
      cy.createOrder("Property & affairs", "New deputy", "01/01/2022", true);
      cy.wait("@bondProviderCall").then(() => {
        cy.contains("Cancel").click();
      });
      cy.get(".TABS_ORDERS").click();
      cy.get("#order-table")
        .find("tr")
        .then((rows) => {
          expect(rows.length === 1);
        });
      cy.get(".order-header-details-case-type").contains("PFA");
      cy.get(".order-header-details-case-sub-type").contains("New deputy");
      cy.get(".order-header-date").contains("01/01/2022");
      cy.get("@clientCourtReference").then((clientCourtReference) => {
        cy.get(".order-header-details-court-reference-number").contains(
          clientCourtReference
        );
      });
      cy.contains("View full details").click();
      cy.get(".order-date").contains("01/01/2022");
      cy.get(".order-issue-date").contains("01/01/2022");
      cy.get(".order-expiry-date").contains("01/01/2022");
      cy.get(".order-received-date").contains("01/01/2022");
      cy.get(".order-title").contains("Test");
      cy.get(".key-value-list__read-only").children().eq(19).contains("Sole");
      cy.get(".notes-not-bold").contains("Test");
      cy.get(".TABS_TIMELINELIST").click();
      cy.get(".timeline-event-title", { timeout: 30000 }).should(
        "contain",
        "Order created"
      );
    });

    it("creates a non-supervised hw order in supervision with mandatory fields", () => {
      cy.createOrder("Health & welfare", "Guardianship", "01/01/2022", true);
      cy.get(".TABS_ORDERS").click();
      cy.get("#order-table")
        .find("tr")
        .then((rows) => {
          expect(rows.length === 1);
        });
      cy.get(".order-header-details-case-type").contains("H&W");
      cy.get(".order-header-details-case-sub-type").contains("Guardianship");
      cy.get(".order-header-date").contains("01/01/2022");
      cy.get("@clientCourtReference").then((clientCourtReference) => {
        cy.get(".order-header-details-court-reference-number").contains(
          clientCourtReference
        );
      });
      cy.contains("View full details").click();
      cy.get(".order-date").contains("01/01/2022");
      cy.get(".order-issue-date").contains("01/01/2022");
      cy.get(".order-expiry-date").contains("01/01/2022");
      cy.get(".order-received-date").contains("01/01/2022");
      cy.get(".order-title").contains("Test");
      cy.get(".key-value-list__read-only").children().eq(19).contains("Sole");
      cy.get(".notes-not-bold").contains("Test");
      cy.get(".TABS_TIMELINELIST").click();
      cy.get(".timeline-event-title", { timeout: 30000 }).should(
        "contain",
        "Order created"
      );
    });
  }
);
