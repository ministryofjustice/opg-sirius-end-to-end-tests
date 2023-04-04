beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createAClient();
});

describe(
  "Add deputy to order smoke journey test",
  { tags: ["@supervision-core", "@deputy", "@smoke-journey"] },
  () => {
    it(
      "Adds a new deputy to a case",
      () => {
        const suffix = Math.floor(Math.random() * 10000);
        const firstName = "Test" + suffix;
        const lastName = "Deputy" + suffix;
        const fullName = firstName + " " + lastName;
        cy.get("@clientId").then((clientId) => cy.createOrderForClient(clientId));
        cy.get("@orderId").then((orderId) => {
          cy.get("@clientId").then((clientId) => {
            cy.visit(
              `/supervision/#/clients/${clientId}/orders/${orderId}/deputies/add`
            );
          });
        });
        cy.get('.deputy-search__input').type("searchdeputy");
        cy.get('.deputy-search__search-button').click();
        cy.contains('Add a new deputy').click();
        cy.get("#add-deputy").as("add-deputy-details-panel");
        cy.get("@add-deputy-details-panel").within(() => {
          cy.contains("Type of deputy")
            .closest(".fieldset")
            .contains("Lay")
            .click();
          cy.get('input[name="firstName"]').clear().type(firstName);
          cy.get('input[name="lastName"]').clear().type(lastName);
        });
        cy.contains("Save & continue").click();
        cy.contains("Exit").click();
        cy.get(".TABS_DEPUTIES").click();
        cy.get("#deputies-table")
          .find("tr")
          .then((rows) => {
            expect(rows.length === 1);
          });
        cy.get(".deputy-name").contains(fullName);
        cy.get(".deputy-type").contains("Lay");
        cy.get(".deputy-status-on-case").contains("Open");
        cy.get(".deputy-relationship-to-client").should('have.value', '');
        cy.get(".full-details").last().click();
        cy.get(".deputy-details-type").contains("Lay");
        cy.get(".deputy-details-deputy-name").contains(fullName);
        cy.get(".deputy-details-is-airmail-required").contains("No");
        cy.get(".deputy-additional-details-newsletter").contains("No");
        cy.get(".order-details-deputy-type").contains("Lay");
        cy.get(".order-details-main-correspondent").contains("Yes");
        cy.get(".order-details-deputy-status-on-case").contains("Open");
        cy.get(".order-details-fee-payer").contains("Yes");
        cy.get(".edit").should("be.visible");
        cy.get(".deputy-record").should("be.visible");
        cy.get("#add-deputy-button")
          .should("be.visible")
          .should("be.enabled");
        cy.get("#create-letter-button")
          .should("be.visible")
          .should("be.enabled");
        cy.get("#add-task-button")
          .should("be.visible")
          .should("be.enabled");
        cy.get("#retrieve-drafts-button")
          .should("be.visible")
          .should("be.disabled");
        cy.get(".TABS_TIMELINELIST").click();
        cy.get(".timeline-event-title", { timeout: 30000 })
          .should("contain", "Link")
          .should("contain", "Set fee payer");
      }
    );
    it(
      "Adds an existing deputy to a case",
      () => {
        const suffix = Math.floor(Math.random() * 10000);
        const firstName = "Test" + suffix;
        const lastName = "Deputy" + suffix;
        const fullName = firstName + " " + lastName;
        cy.createADeputy({
          'firstname': firstName,
          'surname': lastName,
          'deputyType': {'handle': 'PRO', 'label': 'Professional'},
          'deputySubType': {'handle': 'PERSON', 'label': 'Person'},
        });
        cy.get("@clientId").then((clientId) => cy.createOrderForClient(clientId, {
          'caseSubtype': "HW",
        }));
        cy.get("@orderId").then((orderId) => {
          cy.get("@clientId").then((clientId) => {
            cy.visit(
              `/supervision/#/clients/${clientId}/orders/${orderId}/deputies/add`
            );
          });
        });
        cy.get('.deputy-search__input').type(fullName);
        cy.get('.deputy-search__search-button').click();
        cy.get('.deputy-search__use-button').first().click();
        cy.get(".TABS_DEPUTIES").click();
        cy.get("#deputies-table")
          .find("tr")
          .then((rows) => {
            expect(rows.length === 1);
          });
        cy.get(".deputy-name").contains(fullName);
        cy.get(".deputy-type").contains("Professional");
        cy.get(".deputy-status-on-case").contains("Open");
        cy.get(".deputy-relationship-to-client").should('have.value', '');
        cy.get(".full-details").last().click();
        cy.get(".deputy-details-type").contains("Professional");
        cy.get(".deputy-details-deputy-name").contains(fullName);
        cy.get(".deputy-details-is-airmail-required").contains("No");
        cy.get(".deputy-additional-details-newsletter").contains("No");
        cy.get(".order-details-deputy-type").contains("Professional");
        cy.get(".order-details-main-correspondent").contains("Yes");
        cy.get(".order-details-deputy-status-on-case").contains("Open");
        cy.get(".order-details-fee-payer").contains("Yes");
        cy.get(".edit").should("be.visible");
        cy.get(".deputy-record").should("be.visible");
        cy.get("#add-deputy-button")
          .should("be.visible")
          .should("be.enabled");
        cy.get("#create-letter-button")
          .should("be.visible")
          .should("be.enabled");
        cy.get("#add-task-button")
          .should("be.visible")
          .should("be.enabled");
        cy.get("#retrieve-drafts-button")
          .should("be.visible")
          .should("be.disabled");
        cy.get(".TABS_TIMELINELIST").click();
        cy.get(".timeline-event-title", {timeout: 30000})
          .should("contain", "Link")
          .should("contain", "Set fee payer");
      }
    );
    it(
      "is unable to add a deputy already on the case",
      () => {
        const suffix = Math.floor(Math.random() * 10000);
        const organisationName = "Test Organisation" + suffix;
        cy.createADeputy({
          'firstname': "",
          "surname": "",
          'organisationName': organisationName,
          'deputyType': { 'handle': 'PA', 'label': 'Public Authority' }
        });
        cy.get("@clientId").then((clientId) => cy.createOrderForClient(clientId, {
          'caseSubtype': "HW"
        }));
        cy.get("@orderId").then((orderId) => {
          cy.get("@clientId").then((clientId) => {
            cy.visit(
              `/supervision/#/clients/${clientId}/orders/${orderId}/deputies/add`
            );
          });
        });
        cy.get('.deputy-search__input').type(organisationName);
        cy.get('.deputy-search__search-button').click();
        cy.get('.deputy-search__use-button').first().click();
        cy.get(".TABS_DEPUTIES").click();
        cy.get("#deputies-table")
          .find("tr")
          .then((rows) => {
            expect(rows.length === 1);
          });
        cy.get("@orderId").then((orderId) => {
          cy.get("@clientId").then((clientId) => {
            cy.visit(
              `/supervision/#/clients/${clientId}/orders/${orderId}/deputies/add`
            );
          });
        });
        cy.get('.deputy-search__input').should('be.visible');
        cy.get('.deputy-search__input').type(organisationName);
        cy.get('.deputy-search__search-button').click();
        cy.get('.deputy-search__use-button')
          .contains("Deputy already on case")
          .should("be.disabled");
      }
    );
  }
);
