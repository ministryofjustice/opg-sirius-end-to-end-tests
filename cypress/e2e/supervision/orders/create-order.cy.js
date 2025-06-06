const createOrder = (orderType, orderSubType, orderDate, optional) => {
  let orderDay = orderDate.split("/")[0];
  let orderMonth = orderDate.split("/")[1];
  let orderYear = orderDate.split("/")[2];
  cy.get("@client").then(({id, caseRecNumber}) => {
    cy.visit(`/supervision/#/clients/${id}`);
    cy.get('.TABS_DOCUMENTS').click();
    cy.waitForStableDOM();
    cy.contains("Create order").click();

    // click orders tab to clear UI inconsistencies caused by the menu bar on changing screens
    cy.get('#tab-container').contains('Orders').click();
    cy.get("#orderType")
      .closest(".fieldset")
      .contains(orderType)
      .click();
    cy.contains("Order subtype")
      .closest(".fieldset")
      .find("Select")
      .select(orderSubType);
    cy.get('input[name="courtReference"]').should("not.be.disabled", {timeout: 30000});
    cy.get('input[name="courtReference"]').clear();
    cy.get("#fIELDLABELSORDERDATE_day").should("not.be.disabled").clear();
    cy.get("#fIELDLABELSORDERDATE_month").should("not.be.disabled").clear();
    cy.get("#fIELDLABELSORDERDATE_year").should("not.be.disabled").clear();
    cy.get("#orderReceivedDate_day").should("not.be.disabled").clear();
    cy.get("#orderReceivedDate_month").should("not.be.disabled").clear();
    cy.get("#orderReceivedDate_year").should("not.be.disabled").clear();
        cy.get('input[name="courtReference"]').type(caseRecNumber);
    cy.get("#fIELDLABELSORDERDATE_day").type(orderDay);
    cy.get("#fIELDLABELSORDERDATE_month").type(orderMonth);
    cy.get("#fIELDLABELSORDERDATE_year").type(orderYear);
    cy.get("#orderReceivedDate_day").type(orderDay);
    cy.get("#orderReceivedDate_month").type(orderMonth);
    cy.get("#orderReceivedDate_year").type(orderYear);
    if (optional) {
      cy.get("#orderIssueDate_day").should("not.be.disabled").clear();
      cy.get("#orderIssueDate_month").should("not.be.disabled").clear();
      cy.get("#orderIssueDate_year").should("not.be.disabled").clear();
      cy.get("#orderExpiryDate_day").should("not.be.disabled").clear();
      cy.get("#orderExpiryDate_month").should("not.be.disabled").clear();
      cy.get("#orderExpiryDate_year").should("not.be.disabled").clear();
      cy.get("#clauseExpiryDate_day").should("not.be.disabled").clear();
      cy.get("#clauseExpiryDate_month").should("not.be.disabled").clear();
      cy.get("#clauseExpiryDate_year").should("not.be.disabled").clear();
      cy.get('input[name="orderTitle"]').should("not.be.disabled").clear();
      cy.get("#orderIssueDate_day").type(orderDay);
      cy.get("#orderIssueDate_month").type(orderMonth);
      cy.get("#orderIssueDate_year").type(orderYear);
      cy.get("#orderExpiryDate_day").type(orderDay);
      cy.get("#orderExpiryDate_month").type(orderMonth);
      cy.get("#orderExpiryDate_year").type(orderYear);
      cy.get("#clauseExpiryDate_day").type(orderDay);
      cy.get("#clauseExpiryDate_month").type(orderMonth);
      cy.get("#clauseExpiryDate_year").type(orderYear);
      cy.get('input[name="orderTitle"]').type("Test Order Title");
      cy.contains("How have the deputy/deputies been appointed?")
        .closest(".fieldset")
        .contains("Sole")
        .click();
      const text =
        '<p class="MsoNormal" style="margin: 0cm 0cm 11.25pt; font-size: 12pt; font-family: Calibri, sans-serif; text-align: justify; background: white;"><span style="font-size: 10.5pt; font-family: &quot;Open Sans&quot;, sans-serif;">Test note</span></p>';
      cy.getEditorByLabel("Notes")
        .enterText(text);
    }
    cy.contains("Save & exit").click();
  });
}

beforeEach(() => {
  cy.loginAs("Allocations User");
  cy.createClient();
});

  describe(
    "Create a new order",
    {tags: ["@supervision-core", "@order", "@smoke-journey"]},
    () => {
      it("creates a supervised pfa order in supervision with mandatory fields as a system admin",
        {
          retries: {
            runMode: 2,
            openMode: 0,
          },
        }, () => {
        cy.intercept({
          method: "GET",
          url: "/supervision-api/v1/bond-providers",
        }).as("bondProviderCall");
        cy.loginAs("System Admin");
        createOrder("Property & affairs", "New deputy", "01/01/2022", false);
        cy.wait("@bondProviderCall").then(() => {
          cy.contains("Cancel").click();
        });
        cy.get('#tab-container').contains('Orders').click();
        cy.get("#order-table")
          .find("tr")
          .then((rows) => {
            expect(rows.length === 1);
          });
        cy.get(".order-header-details-case-type").contains("PFA");
        cy.get(".order-header-details-case-sub-type").contains("New deputy");
        cy.get(".order-header-date").contains("01/01/2022");
        cy.get("@client").then(({ caseRecNumber }) => {
          cy.get(".order-header-details-court-reference-number").contains(
            caseRecNumber
          );
        });
        cy.contains("View full details").click();
        cy.get(".order-date").contains("01/01/2022");
        cy.get(".order-received-date").contains("01/01/2022");
      });
    });

    it("creates a supervised h&w order in supervision with mandatory fields as an allocations user", () => {
      createOrder("Health & welfare", "New deputy", "01/01/2022", false);
      cy.get('#tab-container').contains('Orders').click();
      cy.get("#order-table")
        .find("tr")
        .then((rows) => {
          expect(rows.length === 1);
        });
      cy.get(".order-header-details-case-type").contains("H&W");
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

    it("creates a supervised pfa order in supervision with mandatory and optional fields as a system admin", () => {
      cy.intercept({
        method: "GET",
        url: "/supervision-api/v1/bond-providers",
      }).as("bondProviderCall");
      cy.loginAs("System Admin");
      createOrder("Property & affairs", "New deputy", "01/01/2022", true);
      cy.wait("@bondProviderCall").then(() => {
        cy.contains("Cancel").click();
      });
      cy.get('#tab-container').contains('Orders').click();
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
      cy.get(".order-issue-date").contains("01/01/2022");
      cy.get(".order-expiry-date").contains("01/01/2022");
      cy.get(".order-received-date").contains("01/01/2022");
      cy.get(".order-title").contains("Test");
      cy.get(".key-value-list__read-only").children().eq(19).contains("Sole");
      cy.get(".notes-not-bold").contains("Test");
      cy.get('#tab-container').contains('Timeline').click();
      cy.get(".timeline-event-title", {timeout: 30000}).should(
        "contain",
        "Order created"
      );
    });

    it("creates a non-supervised hw order in supervision with mandatory fields", () => {
      createOrder("Health & welfare", "Guardianship", "01/01/2022", true);
      cy.get('#tab-container').contains('Orders').click();
      cy.get("#order-table")
        .find("tr")
        .then((rows) => {
          expect(rows.length === 1);
        });
      cy.get(".order-header-details-case-type").contains("H&W");
      cy.get(".order-header-details-case-sub-type").contains("Guardianship");
      cy.get(".order-header-date").contains("01/01/2022");
      cy.get("@client").then(({caseRecNumber}) => {
        cy.get(".order-header-details-court-reference-number").contains(
          caseRecNumber
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
      cy.get('#tab-container').contains('Timeline').click();
      cy.get(".timeline-event-title", {timeout: 30000}).should(
        "contain",
        "Order created"
      );
    });
