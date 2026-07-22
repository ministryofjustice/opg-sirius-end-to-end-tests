import { expect, test } from "@playwright/test";
import { loginAsCaseManager } from "../../../utils/login_as";
import {
  createClient,
  CreatedClient,
} from "../../../fixtures/client/create_client";

test.describe("Add contact", () => {
  let client: CreatedClient;

  test.beforeEach(async ({ page, context }) => {
    await loginAsCaseManager(page, context);
    client = await createClient(page);

    await page.goto(`/supervision/#/clients/${client.id}`);
    await page.locator("#tab-container").getByText("Contacts").click();
    await expect(page.locator("#no-contacts-message")).toContainText(
      "There are no contacts",
    );
    await page.locator("#add-contact-button").click();
  });

  test(
    "new client has no contacts",
    {
      tag: "@supervision-core, @contact",
    },
    async ({ page }) => {
      const addContactTitle = page.locator(".add-contact-title");
      await expect(addContactTitle).toBeVisible();
      await expect(addContactTitle).toContainText("Create a new contact");

      const createContactButton = page.getByRole("button", {
        name: "Create contact",
      });
      await expect(createContactButton).toBeVisible();
      await expect(createContactButton).toBeDisabled();
    },
  );

  test(
    "can add a non organisation contact",
    {
      tag: "@supervision-core, @contact, @smoke-journey",
    },
    async ({ page }) => {
      await page
        .locator(".fieldset", { hasText: "Is organisation" })
        .getByText("No")
        .click();

      await page.locator("input[name=firstName]").fill("FirstName");
      const createContactButton = page.getByRole("button", {
        name: "Create contact",
      });
      await expect(createContactButton).toBeDisabled();

      await page.locator("input[name=lastName]").fill("A".repeat(256));
      await createContactButton.click();

      const validationSummary = page.locator(".validation-summary");
      await expect(validationSummary).toContainText("There is a problem");
      await expect(validationSummary).toContainText(
        "Last name - The input is more than 255 characters long",
      );

      await page.locator("input[name=lastName]").fill("LastName");
      await createContactButton.click();

      const contactList = page.locator(
        "#contacts-list #contact-table .contact-name",
      );
      await expect(contactList).toBeVisible();
      await expect(contactList).toContainText("FirstName LastName");
    },
  );

  test(
    "can add an organisation contact",
    {
      tag: "@supervision-core, @contact",
    },
    async ({ page }) => {
      await page
        .locator(".fieldset", { hasText: "Is organisation" })
        .getByText("Yes")
        .click();

      await page
        .locator("input[name=correspondenceName]")
        .fill("Correspondence Name");
      const createContactButton = page.getByRole("button", {
        name: "Create contact",
      });
      await expect(createContactButton).toBeDisabled();

      await page.locator("input[name=companyName]").fill("A".repeat(256));
      await createContactButton.click();

      const validationSummary = page.locator(".validation-summary");
      await expect(validationSummary).toContainText("There is a problem");
      await expect(validationSummary).toContainText(
        "Company name - The input is more than 255 characters long",
      );

      await page.locator("input[name=companyName]").fill("Company Name");
      await createContactButton.click();

      const contactList = page.locator(
        "#contacts-list #contact-table .contact-name",
      );
      await expect(contactList).toBeVisible();
      await expect(contactList).toContainText("Correspondence Name");
    },
  );
});
