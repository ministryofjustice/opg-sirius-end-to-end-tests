beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient()
    .withOrder()
    .withSupervisionLevel()
  cy.get("@order").then(({id: orderId}) => {
    cy.createADeputyAndAssignToExistingOrder(orderId)
    cy.makeOrderActive(orderId)
  });
});

let currentYear = new Date().getFullYear().toString()

describe(
  "Edit due report",
  {tags: ["@supervision", "@search", "supervision-core"]},
  () => {
    it("Successfully edit due date on report in supervision", () => {
        cy.get("@order").then(({id: orderId}) => {
          cy.get("@client").then(({id: clientId}) => {
            cy.visit(
              `/supervision/#/clients/${clientId}?order=${orderId}`
            );
          });
        });
        cy.get('#tab-container').contains('Reports').click();
        cy.get('.extend-report-due-date-link').first().click();
        cy.get('#begin-extend-report-due-date-button > span').click();
        cy.getDatePickerInputByLabel("Report due date").clear();
          cy.getDatePickerInputByLabel("Report due date").type("24/01/" + currentYear);
          cy.getEditorByLabel("Why are you extending the due date?")
            .enterText('<p>I am extending the annual report</p>');
          cy.get('[type="submit"]').click();
          cy.get('.button > span').click();
          cy.get('.report-date-details > :nth-child(2) > .date-item-detail').first().contains('24 Jan ' + currentYear);
        }
    );

    it("Triggering the validation summary when editing due date on a report in supervision", () => {
        cy.get("@order").then(({id: orderId}) => {
          cy.get("@client").then(({id: clientId}) => {
            cy.visit(
              `/supervision/#/clients/${clientId}?order=${orderId}`
            );
          });
        });
        cy.get('#tab-container').contains('Reports').click();
        cy.get('.extend-report-due-date-link').first().click();
        cy.get('#begin-extend-report-due-date-button > span').click();
        cy.getDatePickerInputByLabel("Report due date").clear();
        cy.getDatePickerInputByLabel("Report due date").type("24/01/" + currentYear);
        const data =
          '<p>I am extending the annual report to over the limit of 1001 characters in the note field as there is no need for the user to extend pass this limit. If there is in the future than we will change the limit of course to ensure that they can do their jobs and we are not the blockers. I will have to repeat this paragraph three times to even get to the limit.\n' +
          'I am extending the annual report to over the limit of 1001 characters in the note field as there is no need for the user to extend pass this limit. If there is in the future than we will change the limit of course to ensure that they can do their jobs and we are not the blockers. I will have to repeat this paragraph three times to even get to the limit.\n' +
          'I am extending the annual report to over the limit of 1001 characters in the note field as there is no need for the user to extend pass this limit. If there is in the future than we will change the limit of course to ensure that they can do their jobs and we are not the blockers. I will have to repeat this paragraph three times to even get to the limit.</p>';
        cy.getEditorByLabel("Why are you extending the due date?")
          .enterText(data);
        cy.get('[type="submit"]').click();
        cy.get('.button > span').click();
        cy.get('.validation-summary').should("be.visible")
      }
    );
  });
