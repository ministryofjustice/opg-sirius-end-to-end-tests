describe("Log in page", { tags: ["@common", "@login"] }, () => {
  it("should display the login page", () => {
    cy.visit("/", { failOnStatusCode: false });

    cy.get('input[name="email"]');
    cy.get('input[name="password"]');
    cy.get('input[value="Sign In"]');
    cy.get('a[href="/auth/reset-password-request"]');
  });

  it("should fail to validate an empty username and password", () => {
    cy.visit("/", { failOnStatusCode: false });
    let signInButton = cy.get('input[value="Sign In"]');
    signInButton.click();

    cy.contains("Value is required and can't be empty");
    cy.contains("Enter your password");
  });

  it("should not log in with an invalid username and password", () => {
    cy.visit("/", { failOnStatusCode: false });

    cy.get('input[name="email"]').type("not.a.user@opgtest.com");
    cy.get('input[name="password"]').type("not-a-password");

    let signInButton = cy.get('input[value="Sign In"]');
    signInButton.click();

    cy.contains("Login failed");
  });

  it("should redirect to the LPA dashboard when an LPA user successfully logs in", () => {
    cy.visit("/", { failOnStatusCode: false });

    cy.get('input[name="email"]').type("unit.manager@opgtest.com");
    cy.get('input[name="password"]').type("Password1");

    let signInButton = cy.get('input[value="Sign In"]');
    signInButton.click();

    cy.contains("Home");
    cy.url().should("include", "/lpa/home");
  });

  it("should redirect to the Supervision dashboard when an Supervision user successfully logs in", () => {
    cy.visit("/", { failOnStatusCode: false });

    cy.get('input[name="email"]').type("lay1-1@opgtest.com");
    cy.get('input[name="password"]').type("Password1");

    let signInButton = cy.get('input[value="Sign In"]');
    signInButton.click();

    cy.contains("Welcome");
    cy.url().should("include", "/supervision/#/dashboard");
  });
});
