beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createAClient();
  cy.get("@clientId").then((clientId) => cy.createOrderForClient(clientId));
  cy.get("@clientId").then((clientId) => {
    cy.visit(`/supervision/#/clients/${clientId}`);
  });
});

describe(
  "Create deputy for client",
  { tags: ["@supervision", "@deputy", "supervision-core", "@smoke-journey"] },
  () => {
    it("Adds a new deputy to a case", () => {
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
      cy.get(".deputy-search__input").type("searchdeputy");
      cy.get(".deputy-search__search-button").click();
      cy.contains("Add a new deputy").click();
      cy.get("#add-deputy").as("add-deputy-details-panel");
      cy.get("@add-deputy-details-panel").within(() => {
        cy.contains("Type of deputy")
          .closest(".fieldset")
          .contains("Lay")
          .click();
        cy.get('input[name="firstName"]').clear();
        cy.get('input[name="firstName"]').type(firstName);
        cy.get('input[name="lastName"]').clear();
        cy.get('input[name="lastName"]').type(lastName);
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
      cy.get(".deputy-relationship-to-client").should("have.value", "");
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
      cy.get("#add-deputy-button").should("be.visible").should("be.enabled");
      cy.get("#create-letter-button").should("be.visible").should("be.enabled");
      cy.get("#add-task-button").should("be.visible").should("be.enabled");
      cy.get("#retrieve-drafts-button")
        .should("be.visible")
        .should("be.disabled");
      cy.get(".TABS_TIMELINELIST").click();
      cy.get(".timeline-event-title", { timeout: 30000 })
        .should("contain", "Link")
        .should("contain", "Set fee payer");
    });

    it("Adds an existing deputy to a case", () => {
      const suffix = Math.floor(Math.random() * 10000);
      const firstName = "Test" + suffix;
      const lastName = "Deputy" + suffix;
      const fullName = firstName + " " + lastName;
      cy.createADeputy({
        firstname: firstName,
        surname: lastName,
        deputyType: { handle: "PRO", label: "Professional" },
        deputySubType: { handle: "PERSON", label: "Person" },
      });
      cy.get("@clientId").then((clientId) =>
        cy.createOrderForClient(clientId, {
          caseSubtype: "HW",
        })
      );
      cy.get("@orderId").then((orderId) => {
        cy.get("@clientId").then((clientId) => {
          cy.visit(
            `/supervision/#/clients/${clientId}/orders/${orderId}/deputies/add`
          );
        });
      });
      cy.get(".deputy-search__input").type(fullName);
      cy.get(".deputy-search__search-button").click();
      cy.get(".deputy-search__use-button").first().click();
      cy.get(".TABS_DEPUTIES").click();
      cy.get("#deputies-table")
        .find("tr")
        .then((rows) => {
          expect(rows.length === 1);
        });
      cy.get(".deputy-name").contains(fullName);
      cy.get(".deputy-type").contains("Professional");
      cy.get(".deputy-status-on-case").contains("Open");
      cy.get(".deputy-relationship-to-client").should("have.value", "");
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
      cy.get("#add-deputy-button").should("be.visible").should("be.enabled");
      cy.get("#create-letter-button").should("be.visible").should("be.enabled");
      cy.get("#add-task-button").should("be.visible").should("be.enabled");
      cy.get("#retrieve-drafts-button")
        .should("be.visible")
        .should("be.disabled");
      cy.get(".TABS_TIMELINELIST").click();
      cy.get(".timeline-event-title", { timeout: 30000 })
        .should("contain", "Link")
        .should("contain", "Set fee payer");
    });

    it("is unable to add a deputy already on the case", () => {
      const suffix = Math.floor(Math.random() * 10000);
      const organisationName = "Test Organisation" + suffix;
      cy.createADeputy({
        firstname: "",
        surname: "",
        organisationName: organisationName,
        deputyType: { handle: "PA", label: "Public Authority" },
      });
      cy.get("@clientId").then((clientId) =>
        cy.createOrderForClient(clientId, {
          caseSubtype: "HW",
        })
      );
      cy.get("@orderId").then((orderId) => {
        cy.get("@clientId").then((clientId) => {
          cy.visit(
            `/supervision/#/clients/${clientId}/orders/${orderId}/deputies/add`
          );
        });
      });
      cy.get(".deputy-search__input").type(organisationName);
      cy.get(".deputy-search__search-button").click();
      cy.get(".deputy-search__use-button").first().click();
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
      cy.get(".deputy-search__input").should("be.visible");
      cy.get(".deputy-search__input").type(organisationName);
      cy.get(".deputy-search__search-button").click();
      cy.get(".deputy-search__use-button")
        .contains("Deputy already on case")
        .should("be.disabled");
    });

    it("Sets the deputy as the main fee payer and correspondent when added to a client", () => {
      cy.get("@clientId").then((clientId) => {
        cy.searchForADeputyToReachAddADeputyPage();
        cy.contains("Professional").should("be.visible");
        cy.get(":nth-child(2) > .radio-button").click();
        cy.get(".deputy-details-form-firstname").type("Patrick");
        cy.get(".deputy-details-form-surname").type("Star");
        cy.contains("Save & continue").should("be.visible");
        cy.contains("Save & continue").click();
        cy.get(".footer > .dotted-link").should("contain.text", "Exit");
        cy.get(".footer > .dotted-link").click();
        cy.get(".TABS_DEPUTIES").click();
        cy.get("tr.summary-row > :nth-child(1) > .dotted-link").click();
        cy.get(".person-name").should("be.visible");
        cy.get(".person-name").should("contain.text", "Patrick Star");
        cy.get(".summary-row.open > :nth-child(1)").should(
          "contain.text",
          "Patrick Star"
        );
        cy.get(".deputy-details-type").should("contain.text", "Professional");
        cy.get(".deputy-relation-type").should("contain.text", "Professional");
        cy.get(".fee-payer").should("be.visible");
        cy.get(".main-contact").should("be.visible");
        cy.get(".order-details-main-correspondent").should(
          "contain.text",
          "Yes"
        );
        cy.get(".order-details-fee-payer").should("contain.text", "Yes");
      });
    });

    it("Greys out save and continue button when mandatory form fields not filled", () => {
      cy.get("@clientId").then((clientId) => {
        cy.searchForADeputyToReachAddADeputyPage();
        cy.contains("Lay").click();
        cy.get(":nth-child(1) > .radio-button").click();
        cy.get(".deputy-details-form-firstname").type("Squidward");
        cy.get(".footer > :nth-child(1) > .button").should("be.disabled");
      });
    });

    it("Allows a new fee payer to be set for an order", () => {
      cy.get("@clientId").then((clientId) => {
        cy.get(".TABS_DEPUTIES").click();
        cy.get("@orderId").then((orderId) => {
          cy.createADeputyAndAssignToExistingOrder(orderId);
        });

        // I can create a second deputy to set them as feepayer
        cy.searchForADeputyToReachAddADeputyPage();

        //check Lay type deputy
        cy.contains("Professional").should("be.visible");
        cy.get(":nth-child(2) > .radio-button").click();
        cy.get(".deputy-details-form-firstname").type("Kermit");
        cy.get(".deputy-details-form-surname").type("Frog");
        cy.contains("Save & continue").click();
        cy.get(".standard-form").should("contain", "Occupation");
        cy.contains("Save & continue").click();
        cy.get(".standard-form").should("contain", "Type of deputy");
        cy.get(".field-wrapper > check-box.ng-untouched > .checkbox").click();
        cy.waitForStableDOM();
        cy.contains("Save & continue").click();
        cy.contains("Make the deputy the fee payer?").should("be.visible");
        cy.get("header > h1 > span").should(
          "contain",
          "Make the deputy the fee payer?"
        );
        cy.contains("Make the fee payer").click();

        cy.get(".TABS_DEPUTIES").click();
        cy.contains("Mr Abc Def").should("be.visible");
        cy.get(":nth-child(1) > :nth-child(1) > .summary-row-heading").should(
          "contain.text",
          "Mr Abc Def"
        );
        cy.contains("Kermit Frog").should("be.visible");
        cy.get(":nth-child(3) > :nth-child(1) > .summary-row-heading").should(
          "contain.text",
          "Kermit Frog"
        );

        //make sure fee payer and main contact symbols visible under 2nd deputy
        cy.get(":nth-child(3) > :nth-child(6) > .fee-payer").should(
          "be.visible"
        );
        cy.get(":nth-child(3) > :nth-child(6) > .main-contact").should(
          "be.visible"
        );
        //make sure fee payer symbols not visible under 1st deputy
        cy.get(":nth-child(1) > :nth-child(6) > .fee-payer").should(
          "not.to.exist"
        );
      });
    });
  }
);
