beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient().withOrder().withSupervisionLevel().withActiveOrderStatus();
});

describe(
  "Edit due report",
  { tags: ["@supervision", "@search", "supervision-core"] },
  () => {
    it("Successfully edit due date on report in supervision", () => {
      cy.get("@order").then(({ id: orderId }) => {
        cy.get("@client").then(({ id: clientId }) => {
          cy.visit(`/supervision/#/clients/${clientId}?order=${orderId}`);
        });
      });
      cy.get(".TABS_REPORTS").click();
      cy.get(".extend-report-due-date-link").first().click();
      cy.get("#begin-extend-report-due-date-button > span").click();
      cy.getDatePickerInputByLabel("Report due date").then(($el) => {
        if ($el.hasClass("date-input")) {
          // temporary fix while changing datepicker implementation
          cy.get($el).type("24 January 2023");
        } else {
          cy.get($el).type("24/012023");
        }
      });
      cy.waitForTinyMCE().enterText("<p>I am extending the annual report</p>");
      cy.get('[type="submit"]').click();
      cy.get(".button > span").click();
      cy.get(".report-date-details > :nth-child(2) > .date-item-detail")
        .first()
        .contains("24 Jan 2023");
    });

    it("Triggering the validation summary when editing due date on a report in supervision", () => {
      cy.get("@order").then(({ id: orderId }) => {
        cy.get("@client").then(({ id: clientId }) => {
          cy.visit(`/supervision/#/clients/${clientId}?order=${orderId}`);
        });
      });
      cy.get(".TABS_REPORTS").click();
      cy.get(".extend-report-due-date-link").first().click();
      cy.get("#begin-extend-report-due-date-button > span").click();
      cy.getDatePickerInputByLabel("Report due date").then(($el) => {
        if ($el.hasClass("date-input")) {
          // temporary fix while changing datepicker implementation
          cy.get($el).type("24 January 2023");
        } else {
          cy.get($el).type("24/012023");
        }
      });
      const data =
        "<p>I am extending the annual report to over the limit of 1001 characters in the note field as there is no need for the user to extend pass this limit. If there is in the future than we will change the limit of course to ensure that they can do their jobs and we are not the blockers. I will have to repeat this paragraph three times to even get to the limit.\n" +
        "I am extending the annual report to over the limit of 1001 characters in the note field as there is no need for the user to extend pass this limit. If there is in the future than we will change the limit of course to ensure that they can do their jobs and we are not the blockers. I will have to repeat this paragraph three times to even get to the limit.\n" +
        "I am extending the annual report to over the limit of 1001 characters in the note field as there is no need for the user to extend pass this limit. If there is in the future than we will change the limit of course to ensure that they can do their jobs and we are not the blockers. I will have to repeat this paragraph three times to even get to the limit.</p>";
      cy.waitForTinyMCE().enterText(data);
      cy.get('[type="submit"]').click();
      cy.get(".button > span").click();
      cy.get(".validation-summary").should("be.visible");
    });
  }
);
