import { expect, test } from "@playwright/test";
import { createClient } from "../../../fixtures/client/create_client";
import { loginAsCaseManager } from "../../../utils/login_as";

test.describe("Edit an existing client", () => {
  test(
    "Edits an existing client",
    { tag: "@supervision-core @client @smoke-journey" },
    async ({ page, context }) => {
      const suffix = Math.floor(Math.random() * 10_000).toString();
      const newFirstName = `Test${suffix}`;
      const newLastName = `Client${suffix}`;
      const memorablePhrase = `Memorable${suffix}`;

      await loginAsCaseManager(page, context);
      const client = await createClient(page);

      await page.goto(`/supervision/#/clients/${client.id}/edit`);
      await expect(
        page.getByText(`Edit Client: ${client.firstname} ${client.surname}`),
      ).toBeVisible();

      await page.reload();
      await expect(page).toHaveURL(
        new RegExp(`/supervision/#/clients/${client.id}/edit`),
      );

      const firstNameInput = page.locator('input[name="firstName"]');
      const lastNameInput = page.locator('input[name="lastName"]');
      const memorablePhraseInput = page.locator(
        'input[name="memorablePhrase"]',
      );

      await expect(firstNameInput).toBeVisible();
      await expect(firstNameInput).toHaveValue(client.firstname);
      await expect(firstNameInput).toBeEnabled();
      await expect(lastNameInput).toHaveValue(client.surname);
      await expect(lastNameInput).toBeEnabled();
      await expect(memorablePhraseInput).toBeEnabled();

      await firstNameInput.clear();
      await firstNameInput.fill(newFirstName);
      await lastNameInput.clear();
      await lastNameInput.fill(newLastName);
      await memorablePhraseInput.clear();
      await memorablePhraseInput.fill(memorablePhrase);

      await Promise.all([
        page.waitForResponse(
          (response) =>
            response.request().method() === "PUT" &&
            response
              .url()
              .includes(`/supervision-api/v1/clients/${client.id}`) &&
            response.ok(),
        ),
        page.getByText("Save & Exit").click(),
      ]);

      await expect(page.locator(".title-person-name")).toContainText(
        `${newFirstName} ${newLastName}`,
      );

      await page.locator("#tab-container").getByText("Summary").click();
      await expect(
        page.locator(".client-summary-full-name-value"),
      ).toContainText(`${newFirstName} ${newLastName}`);
      await expect(
        page.locator(".client-summary-memorable-phrase-value"),
      ).toContainText(memorablePhrase);

      await page.locator("#tab-container").getByText("Timeline").click();
      await page.reload();

      await expect(
        page.locator(".timeline-event-title").getByText("Client edited"),
      ).toBeVisible();

      const changeset = page.locator("timeline-generic-changeset").first();
      await expect(changeset).toContainText(
        `First name changed from ${client.firstname} to ${newFirstName}`,
      );
      await expect(changeset).toContainText(
        `Last name changed from ${client.surname} to ${newLastName}`,
      );
      await expect(changeset).toContainText(
        `Memorable phrase set to ${memorablePhrase}`,
      );
    },
  );
});
