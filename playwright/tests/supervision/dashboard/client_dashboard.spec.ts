import { test, expect } from "@playwright/test";
import { loginAsCaseManager } from "../../../utils/login_as";
import { createClient } from "../../../fixtures/client/create_client";

test.describe(
  "Viewing the client dashboard",
  { tag: "@supervision, @supervision-regression, @client-dashboard" },
  () => {
    test("loads the client dashboard and navigates to the Edit Client page when the edit button is clicked", async ({
      page,
      context,
    }) => {
      await loginAsCaseManager(page, context);
      const client = await createClient(page);
      await page.goto(`/supervision/#/clients/${client.id}`);
      await expect(page.locator(".title-person-name")).toContainText(
        `${client.firstname} ${client.surname}`,
      );
      await page.getByRole("button", { name: "Edit client" }).click();
      await expect(
        page.getByText(`Edit Client: ${client.firstname} ${client.surname}`),
      ).toBeVisible();
    });
  },
);
