import randomText from "../../../support/random-text";

beforeEach(() => {
  cy.loginAs("Case Manager");
  cy.createClient().withOrder();

  cy.get("@client").then(({ id }) => {
    cy.visit(`/supervision/#/clients/${id}`);
    cy.get('.TABS_DOCUMENTS').click();
    cy.waitForStableDOM();
  });
});

const searchForADeputyToReachAddADeputyPage = () => {
  return cy.then(() => {
    cy.get("#add-deputy-button").should("be.visible", "be.enabled").click();
    // type in name to search field
    cy.get(".deputy-search__input").type("deputy");
    cy.get(".deputy-search__form > .button").click();
    cy.contains("Add a new deputy").should("be.visible").click();
  });
};

describe(
    "Create deputy for client",
    {tags: ["@supervision", "@deputy", "supervision-core", "@smoke-journey"]},
    () => {
      it("Adds a new deputy to a case", () => {
        const firstName = randomText();
        const lastName = randomText();
        const fullName = `${firstName} ${lastName}`;
        searchForADeputyToReachAddADeputyPage();
        cy.get("#typeOfDeputy .radio-button")
          .contains("Lay")
          .should("be.visible")
          .click();
        cy.get(".deputy-details-form-firstname").type(firstName);
        cy.get(".deputy-details-form-surname").type(lastName);
        cy.contains("Save & continue").should("be.visible").click();
        cy.get(".footer > .dotted-link").should("contain.text", "Exit").click();

        cy.get('#tab-container').contains('Deputies').click();

        cy.get("#deputies-table").within(() => {
          cy.get(".deputy-name").contains(fullName).should("be.visible");
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
        });
        cy.get("#add-deputy-button").should("be.visible").should("be.enabled");
        cy.get("#create-letter-button").should("be.visible").should("be.enabled");
        cy.get("#add-task-button").should("be.visible").should("be.enabled");
        cy.get("#retrieve-drafts-button")
          .should("be.visible")
          .should("be.disabled");

        cy.get('#tab-container').contains('Timeline').click();

        cy.get(".timeline-event-title", {timeout: 30000})
          .should("contain", "Link")
          .should("contain", "Set fee payer");
      });

      it("Adds an existing deputy to a case", () => {
        cy.createADeputy({
          deputyType: {handle: "PRO", label: "Professional"},
          deputySubType: {handle: "PERSON", label: "Person"},
        });
        cy.wait(500);
        cy.get("@deputy").then(({firstname, surname}) => {
          const fullName = `${firstname} ${surname}`;
          cy.get("#add-deputy-button").should("be.visible").click();
          cy.get(".deputy-search__input").should("be.visible").type(fullName);
          cy.get(".deputy-search__search-button").click();
          cy.get(".deputy-search__use-button").first().click();

          cy.get('#tab-container').contains('Deputies').click();

          cy.get("#deputies-table").within(() => {
            cy.get(".deputy-name").contains(fullName).should("be.visible");
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
          });
          cy.get("#add-deputy-button").should("be.visible").should("be.enabled");
          cy.get("#create-letter-button")
            .should("be.visible")
            .should("be.enabled");
          cy.get("#add-task-button").should("be.visible").should("be.enabled");
          cy.get("#retrieve-drafts-button")
            .should("be.visible")
            .should("be.disabled");

          cy.get('#tab-container').contains('Timeline').click();

          cy.get(".timeline-event-title", {timeout: 30000})
            .should("contain", "Link")
            .should("contain", "Set fee payer");
        });
      });

      it("is unable to add a deputy already on the case", () => {
        const organisationName = randomText();
        cy.createADeputy({
          firstname: "",
          surname: "",
          organisationName: organisationName,
          deputyType: {handle: "PA", label: "Public Authority"},
        });
        cy.wait(500);
        cy.get("@deputy").then(() => {
          cy.get("#add-deputy-button").should("be.visible").click();
          cy.get(".deputy-search__input")
            .should("be.visible")
            .type(organisationName);
          cy.get(".deputy-search__search-button").click();
          cy.get(".deputy-search__use-button").first().click();

          cy.get('#tab-container').contains('Deputies').click();

          cy.get("#add-deputy-button").should("be.visible").click();
          cy.get(".deputy-search__input")
            .should("be.visible")
            .type(organisationName);
          cy.get(".deputy-search__search-button").click();
          cy.get(".deputy-search__use-button")
            .contains("Deputy already on case")
            .should("be.disabled");
        });
      });

      it(
        "Sets the deputy as the main fee payer and correspondent when added to a client",
        {},
        () => {
          searchForADeputyToReachAddADeputyPage();
          cy.get("#typeOfDeputy .radio-button")
            .contains("Professional")
            .should("be.visible")
            .click();
          cy.get(".deputy-details-form-firstname").type("Patrick");
          cy.get(".deputy-details-form-surname").type("Star");
          cy.contains("Save & continue").should("be.visible").click();
          cy.get(".footer > .dotted-link").should("contain.text", "Exit").click();

          cy.get('#tab-container').contains('Deputies').click();
          cy.reload();
          cy.get("#deputies-table").within(() => {
            cy.contains("View full details").click();
            cy.get(".person-name").should("be.visible", {
              timeout: 60000,
              interval: 500,
            });
            cy.contains(".person-name", "Patrick Star");
            cy.contains(".deputy-details-type", "Professional");
            cy.contains(".deputy-relation-type", "Professional");
            cy.get(".fee-payer").should("be.visible");
            cy.get(".main-contact").should("be.visible");
            cy.contains(".order-details-main-correspondent", "Yes");
            cy.contains(".order-details-fee-payer", "Yes");
          });
        }
      );

      it("Greys out save and continue button when mandatory form fields not filled", () => {
        searchForADeputyToReachAddADeputyPage();
        cy.get("#typeOfDeputy .radio-button")
          .contains("Lay")
          .should("be.visible")
          .click();
        cy.get(".deputy-details-form-firstname")
          .should("be.visible")
          .type("Squidward");
        cy.get(".footer > :nth-child(1) > .button").should("be.disabled");
      });

      it(
        "Allows a new fee payer to be set for an order",
        {
          retries: {
            runMode: 2,
            openMode: 1,
          },
        },
        () => {
          cy.get("@order").then(({id}) => {
            cy.createADeputyAndAssignToExistingOrder(id).then(() => {
              // deputy created through API so page needs reloading in order for Angular to be aware of the change
              cy.reload();
              cy.get('#tab-container').contains('Deputies').should("be.visible").click();
              cy.contains("Mr Abc Def").should("be.visible");
              // I can create a second deputy to set them as feepayer
              searchForADeputyToReachAddADeputyPage();
              //check Lay type deputy
              cy.get("#typeOfDeputy .radio-button")
                .contains("Professional")
                .should("be.visible")
                .click();
              cy.get(".deputy-details-form-firstname").type("Kermit");
              cy.get(".deputy-details-form-surname").type("Frog");
              cy.get("footer button[type=submit]").as("submitButton");
              cy.get("@submitButton")
                .should("have.text", " Save & continue ")
                .should("be.visible")
                .click();
              cy.get(".standard-form").should("contain", "Occupation");
              cy.get("@submitButton")
                .should("have.text", " Save & continue ")
                .should("be.visible")
                .click();
              cy.get(".money + check-box > label").as("feePayerCheckbox");
              cy.get("@feePayerCheckbox").should("be.visible").click();
              cy.get("label:contains(Type of deputy) + select").should(
                "have.value",
                "1"
              );
              cy.wait(1000);
              cy.get("@submitButton")
                .should("have.text", " Save & continue ")
                .should("be.visible")
                .click();
              cy.contains("Make the deputy the fee payer?").should("be.visible");
              cy.get("header > h1 > span").should(
                "contain",
                "Make the deputy the fee payer?"
              );
              cy.get("fee-payer-dialog button")
                .contains("Make the fee payer")
                .should("be.visible")
                .click();
              cy.get(":nth-child(3) > .in-page-banner").contains(
                "Deputy successfully saved"
              );
            });
          });
        }
      );
    }
  );
