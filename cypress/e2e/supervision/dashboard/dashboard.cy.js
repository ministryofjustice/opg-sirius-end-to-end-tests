beforeEach(() => {
  cy.loginAs("Case Manager");
});

describe(
  "Viewing the dashboard",
  { tags: ["@supervision", "@dashboard"] },
  () => {
    it("should load the Supervision dashboard correctly", () => {
      cy.visit("/supervision/#/dashboard");
      // cy.contains(
      //   "Tasks and caseloads can be managed from the Workflow page in Sirius Supervision."
      // );
    });
  }
);

describe(
  "The create client button works",
  { tags: ["@supervision", "@dashboard", "@client"] },
  () => {
    it("should navigate to the correct page", () => {
      cy.visit("/supervision/#/dashboard");

      cy.contains("Create Client").click();
      cy.contains("Add Client");
    });
  }
);
