import { test, expect } from "@playwright/test";
import { loginAsCaseManager } from "../../../utils/login_as";
import { createClient } from "../../../fixtures/client/create_client";
import { createContactForClient } from "../../../fixtures/contact/create_contact";

test.describe("Edit contact", () => {
  test(
    "can edit a non organisation contact",
    {
      tag: "@supervision-core, @contact, @smoke-journey",
    },
    async ({ page, context }) => {
      await loginAsCaseManager(page, context);

      const client = await createClient(page);
      await createContactForClient(page, client.id);

      await page.goto(`/supervision/#/clients/${client.id}`);
      await page.locator("#tab-container").getByText("Contacts").click();

      await page
        .locator(".contacts-list")
        .getByRole("button", { name: "Edit" })
        .click();
      const createContactButton = page.getByRole("button", {
        name: "Save & update contact",
      });
      await expect(createContactButton).toBeVisible();
      await expect(createContactButton).toBeDisabled();

      await page
        .getByRole("textbox", { name: "First name" })
        .fill("A".repeat(256));
      await createContactButton.click();

      const validationSummary = page.locator(".validation-summary");
      await expect(validationSummary).toContainText("There is a problem");
      await expect(validationSummary).toContainText(
        "First name - The input is more than 255 characters long",
      );

      await page.getByRole("textbox", { name: "First name" }).fill("Edited");
      await createContactButton.click();
      const contactList = page.locator(
        "#contacts-list #contact-table .contact-name",
      );
      await expect(contactList).toBeVisible();
      await expect(contactList).toContainText(`Edited`);
    },
  );
});
