const createOrder = (orderType, orderSubType, orderDate, optional) => {
  let orderDay = orderDate.split("/")[0];
  let orderMonth = orderDate.split("/")[1];
  let orderYear = orderDate.split("/")[2];
  cy.get("@client").then(({id, caseRecNumber}) => {
    cy.visit(`/supervision/#/clients/${id}`);
    cy.contains("Create order").click();
    cy.get("#orderType")
      .closest(".fieldset")
      .contains(orderType)
      .click();
    cy.contains("Order subtype")
      .closest(".fieldset")
      .find("Select")
      .select(orderSubType);
    cy.get('input[name="courtReference"]').clear();
    cy.get('input[name="courtReference"]').type(caseRecNumber);
    cy.get("#fIELDLABELSORDERDATE_day").clear();
    cy.get("#fIELDLABELSORDERDATE_day").type(orderDay);
    cy.get("#fIELDLABELSORDERDATE_month").clear();
    cy.get("#fIELDLABELSORDERDATE_month").type(orderMonth);
    cy.get("#fIELDLABELSORDERDATE_year").clear();
    cy.get("#fIELDLABELSORDERDATE_year").type(orderYear);
    cy.get("#orderReceivedDate_day").clear();
    cy.get("#orderReceivedDate_day").type(orderDay);
    cy.get("#orderReceivedDate_month").clear();
    cy.get("#orderReceivedDate_month").type(orderMonth);
    cy.get("#orderReceivedDate_year").clear();
    cy.get("#orderReceivedDate_year").type(orderYear);
    if (optional) {
      cy.get("#orderIssueDate_day").clear();
      cy.get("#orderIssueDate_day").type(orderDay);
      cy.get("#orderIssueDate_month").clear();
      cy.get("#orderIssueDate_month").type(orderMonth);
      cy.get("#orderIssueDate_year").clear();
      cy.get("#orderIssueDate_year").type(orderYear);
      cy.get("#orderExpiryDate_day").clear();
      cy.get("#orderExpiryDate_day").type(orderDay);
      cy.get("#orderExpiryDate_month").clear();
      cy.get("#orderExpiryDate_month").type(orderMonth);
      cy.get("#orderExpiryDate_year").clear();
      cy.get("#orderExpiryDate_year").type(orderYear);
      cy.get("#clauseExpiryDate_day").clear();
      cy.get("#clauseExpiryDate_day").type(orderDay);
      cy.get("#clauseExpiryDate_month").clear();
      cy.get("#clauseExpiryDate_month").type(orderMonth);
      cy.get("#clauseExpiryDate_year").clear();
      cy.get("#clauseExpiryDate_year").type(orderYear);
      cy.get('input[name="orderTitle"]').clear();
      cy.get('input[name="orderTitle"]').type("Test Order Title");
      cy.contains("How have the deputy/deputies been appointed?")
        .closest(".fieldset")
        .contains("Sole")
        .click();
      const text =
        '<p class="MsoNormal" style="margin: 0cm 0cm 11.25pt; font-size: 12pt; font-family: Calibri, sans-serif; text-align: justify; background: white;"><span style="font-size: 10.5pt; font-family: &quot;Open Sans&quot;, sans-serif;">Test note</span></p>';
      cy.waitForTinyMCE()
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
  "Edit order details successfully",
  {tags: ["@supervision-core", "@order", "@smoke-journey"]},
  () => {
    it("creates a supervised h&w order and edit the details", () => {
      createOrder("Health & welfare", "New deputy", "01/01/2022", false);
      cy.get(".TABS_ORDERS").click();
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
      cy.get('.edit-order-button').click();
      cy.get('#begin-change-order-button > span').click();
      cy.contains("button", "Yes, edit order").should("be.enabled").click();
      cy.get('[label="Order title"] > .fieldset > .ng-untouched').type('This is an order title');
      cy.get('#howHaveTheDeputyDeputiesBeenAppointed > .fieldset > fieldset > :nth-child(1) > .radio-button').click();
      const data = '<p>Order notes etc....</p>';
      cy.waitForTinyMCE()
        .enterText(data);
      cy.get('[type="submit"]').click();
      cy.get(".TABS_TIMELINELIST").click();

      cy.get(".timeline-event-title", {timeout: 30000}).should(
        "contain",
        "Order updated"
      );

      cy.get("timeline-generic-changeset")
        .within(() => {
            cy.contains('Order title set to This is an order title');
            cy.contains('How appointed set to Sole');
            cy.contains('Notes set to Order notes etc....');
          });
    });
  }
);
