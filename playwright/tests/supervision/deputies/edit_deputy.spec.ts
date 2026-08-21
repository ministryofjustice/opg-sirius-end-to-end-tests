import { test, expect } from "@playwright/test";
import { loginAsCaseManager } from "../../../utils/login_as";
import { createClient } from "../../../fixtures/client/create_client";
import { createOrderForClient } from "../../../fixtures/order/create_order";
import { createDeputyAndAssignToExistingOrder } from "../../../fixtures/deputy/create_deputy_and_assign_to_existing_order";
test.describe(
  "Edit deputy for client",
  { tag: "@supervision, @deputy, @supervision-core, @smoke-journey" },
  () => {
    test("Editing deputy details via the deputy hub", async ({
      page,
      context,
    }) => {
      await loginAsCaseManager(page, context);
      const client = await createClient(page);
      const order = await createOrderForClient(page, client.id);
      const deputy = await createDeputyAndAssignToExistingOrder(page, order.id);
      await page.goto(`/supervision/#/clients/${client.id}`);
      await page.getByRole("tab", { name: "Deputies" }).click();

      const deputyName = `Mr ${deputy.firstname} ${deputy.surname}`;

      await expect(
        page.locator("div").filter({ hasText: RegExp("^" + deputyName + "$") }),
      ).toBeVisible();
      await expect(page.getByRole("cell").nth(1)).toHaveText("Lay");
      await expect(page.getByRole("cell").nth(2)).toHaveText("Open");

      await expect(
        page.getByRole("link", { name: `Deputy record: ${deputyName}` }),
      ).toBeEnabled();

      await page.getByRole("button", { name: `Edit: ${deputyName}` }).click();
      await page.getByRole("link", { name: "Edit deputy details: Mr" }).click();
      await page
        .getByRole("textbox", { name: "Date of birth (dd/mm/yyyy)" })
        .fill("25");
      await page.getByRole("button", { name: "Save & update deputy" }).click();
      await expect(page.getByText("There is a problem")).toBeVisible();
      await expect(
        page.getByText("Date of birth - This must be a real date"),
      ).toBeVisible();
      await expect(
        page.getByText("Date of birth - This must be on or after 01/01/1880"),
      ).toBeVisible();
      await page
        .getByRole("textbox", { name: "Date of birth (dd/mm/yyyy)" })
        .fill("25/02/2000");
      await page.getByRole("button", { name: "Save & update deputy" }).click();
      await expect(
        page.locator("#view-deputy-container").getByText("25/02/2000"),
      ).toBeVisible();
    });
  },
);
