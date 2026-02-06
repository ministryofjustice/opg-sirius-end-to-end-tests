describe("Create LPA", { tags: ["@lpa", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("LPA Manager");
    cy.createDonor().then(({ id }) => {
      cy.wrap(id).as("donorId");
    });
  });

  it("should create a Health and Welfare LPA", function () {
    cy.visit(`/lpa/#/person/${this.donorId}`);
    cy.waitForStableDOM();

    cy.contains("Create LPA Case").click();

    cy.get(".action-widget-content:visible").within(() => {
      cy.contains("hw").click();
      cy.contains("Online").click();
      cy.get("#onlineLpaId0").type("A123456789");

      const clickFieldsetRadio = (title, option) => {
        cy.contains(title).closest("fieldset").contains(option).click();
      };

      clickFieldsetRadio("There is only one attorney appointed?", "Yes");
      clickFieldsetRadio(
        "There are attorneys appointed jointly and severally?",
        "No"
      );
      clickFieldsetRadio("There are attorneys appointed jointly?", "No");
      clickFieldsetRadio(
        "There are attorneys appointed jointly in some matters and jointly and severally in others?",
        "No"
      );

      cy.contains("Add an Attorney").click();
      cy.get(".case-actor")
        .contains("h3", "Attorney")
        .closest(".case-actor")
        .within(() => {
          cy.get("#salutation0").type("Dr");
          cy.get("#firstname0").type("Kaycee");
          cy.get("#surname0").type("Adesso");
          cy.contains("Save").click();
        });

      cy.contains("LP2 Application Form").click();
      cy.contains("Add Correspondent").click();
      cy.get(".case-actor")
        .contains("h3", "Correspondent")
        .closest(".case-actor")
        .within(() => {
          cy.get("#firstname0").type("Elvina");
          cy.get("#surname0").type("Kuhtz");
          cy.contains("Save").click();
        });

      cy.contains("Save and Exit").click();
    });

    cy.contains(".case-tile-status", "Pending");

    cy.get(".task-list-task").contains("Create physical case file");
    cy.get(".task-list-task").contains("Manager allocate case to case worker");

    // cy.get(".timeline").contains(".timeline-event h2", "LPA (Create / Edit)");
    // cy.get(".timeline").contains(".timeline-event p", "LPA was created");

    cy.get(".opg-icon").contains("CasePeople").click({ force: true });
    cy.get(".person-info")
      .contains("Donor")
      .closest("person-list-item")
      .contains("Bob Sponge");

    cy.get(".person-info")
      .contains("Attorney")
      .closest("person-list-item")
      .contains("Dr Kaycee Adesso");

    cy.get(".person-info")
      .contains("Correspondent")
      .closest("person-list-item")
      .contains("Elvina Kuhtz");
  });
});

describe("Edit LPA", { tags: ["@lpa", "@smoke-journey"] }, () => {
  before(() => {
    cy.loginAs("LPA Manager");
    cy.createDonor().then(({ id: donorId }) => {
      cy.createLpa(donorId).then(({ id: lpaId }) => {
        cy.wrap(donorId).as("donorId");
        cy.wrap(lpaId).as("lpaId");
      });
    });
  });

  it("should add a correspondent", function () {
    cy.visit(`/lpa/#/person/${this.donorId}/${this.lpaId}`);
    cy.waitForStableDOM();

    cy.contains(".case-tile-status", "Pending");
    cy.contains("Edit Case").click();

    cy.get(".action-widget-content:visible").within(() => {
      cy.contains("LP2 Application Form").click();
      cy.contains("Add Correspondent").click();

      cy.get(".case-actor")
        .contains("h3", "Correspondent")
        .closest(".case-actor")
        .within(() => {
          cy.get("#firstname0").type("Chelsie");
          cy.get("#surname0").type("Lal");
          cy.contains("Save").click();
        });

      cy.contains("Save and Exit").click();
    });

    cy.get(".opg-icon").contains("CasePeople").click({ force: true });
    cy.get(".person-info")
      .contains("Correspondent")
      .closest("person-list-item")
      .contains("Chelsie Lal");
  });
});

describe("Display digital LPA", { tags: ["@lpa", "@smoke-journey"] }, () => {
  beforeEach(() => {
    cy.loginAs("System Admin");
    cy.createDonor().then(({ id: donorId }) => {
      cy.wrap(donorId).as("digitalLpaDonorId");
    });
  });

  it.only("should display digital LPAs in case tiles", function () {
    cy.intercept(
      "GET",
      `/lpa-api/v1/persons/${this.digitalLpaDonorId}/cases`,
      {
        statusCode: 200,
        body: {
          "cases": [
            {
              "id": 83,
              "uId": "M-DIGI-LPA4-9877",
              "caseSubtype": "property-and-affairs",
              "receiptDate": "02/04/2019",
              "tasks": [
                {
                  "id": 165,
                  "status": "Not started"
                },
                {
                  "id": 166,
                  "status": "Not started"
                }
              ],
              "caseType": "DIGITAL_LPA",
              "status": "Draft"
            },
            {
              "id": 84,
              "uId": "M-DIGI-LPA4-9876",
              "caseSubtype": "personal-welfare",
              "receiptDate": "02/04/2019",
              "tasks": [
                {
                  "id": 167,
                  "status": "Not started"
                }
              ],
              "caseType": "DIGITAL_LPA",
              "status": "Draft"
            }
          ]
        }
      }
    );

    cy.visit(`/lpa/#/person/${this.digitalLpaDonorId}`);

    cy.waitForStableDOM().then(() => {
      cy.get(".card-wrapper").then(elts => {
        expect(elts.length).to.eql(2);

        cy.wrap(elts[0]).find(".case-tile-type")
          .should("contain", "M-DIGI-LPA4-9876")
          .should("contain", "PW");

        cy.wrap(elts[1]).find(".case-tile-type")
          .should("contain", "M-DIGI-LPA4-9877")
          .should("contain", "PA");
      });
    })
  });
});
