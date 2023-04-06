Cypress.Commands.add("createOrder", (orderType, orderSubType, orderDate, optional) => {
  let orderDay = orderDate.split("/")[0];
  let orderMonth = orderDate.split("/")[1];
  let orderYear = orderDate.split("/")[2];
  cy.get("@clientId").then((clientId) => {
    cy.visit(`/supervision/#/clients/${clientId}`);
    cy.contains("Create order").click();
    cy.get("#orderType")
      .closest(".fieldset")
      .contains(orderType)
      .click();
    cy.contains("Order subtype")
      .closest(".fieldset")
      .find("Select")
      .select(orderSubType);
    cy.get("@clientCourtReference").then((clientCourtReference) => {
      cy.get('input[name="courtReference"]').clear();
      cy.get('input[name="courtReference"]').type(clientCourtReference);
    });
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
    if(optional) {
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
      cy.window()
        .its("tinyMCE")
        .its("activeEditor")
        .its("initialized", {timeout: 2000});
      cy.window().then((win) => {
        const pastedata =
          '<p class="MsoNormal" style="margin: 0cm 0cm 11.25pt; font-size: 12pt; font-family: Calibri, sans-serif; text-align: justify; background: white;"><span style="font-size: 10.5pt; font-family: &quot;Open Sans&quot;, sans-serif;">Test note</span></p>';
        let editor = win.tinymce.activeEditor;
        editor.dom.createRng();
        editor.execCommand("mceInsertClipboardContent", false, {
          content: pastedata,
        });
      });
    }
    cy.contains("Save & exit").click();
  });
});

Cypress.Commands.add("setSupervisionLevel", (orderId, overrides = {}) => {
  let supervisionLevelBody = {
    "appliesFrom": "23/03/2023",
    "newAssetLevel": "LOW",
    "newLevel": "GENERAL",
    "notes": ""
  }
  supervisionLevelBody = {...supervisionLevelBody, ...overrides};
  cy.postToApi(`/supervision-api/v1/orders/${orderId}/supervision-level`, supervisionLevelBody);
});

Cypress.Commands.add("changeOrderStatus", (orderId, overrides = {}) => {
  let orderStatusBody = {
    "orderStatus": {
      "handle": "ACTIVE",
      "label": "Active"
    },
    "statusDate": "23/03/2023",
    "statusNotes": ""
  }
  orderStatusBody = {...orderStatusBody, ...overrides};
  cy.putToApi(`/supervision-api/v1/orders/${orderId}/status`, orderStatusBody)
});
