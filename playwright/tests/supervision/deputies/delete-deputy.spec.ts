import { test, expect } from "@playwright/test";
import { createClient } from "../../../fixtures/client/create_client";
import { createOrderForClient } from "../../../fixtures/order/create_order";
import { loginAsSystemAdmin } from "../../../utils/login_as";
import { createDeputyAndAssignToExistingOrder } from "../../../fixtures/deputy/create_deputy_and_assign_to_existing_order";
import { updateDeputyWithErrorStatus } from "../../../fixtures/deputy/update_deputy_on_order";

test.describe("Delete a deputy", () => {
  test("Should remove the deputy from the client's deputy list and deputy search", async ({
    page,
    context,
  }) => {
    await loginAsSystemAdmin(page, context);
    const client = await createClient(page);
    const order = await createOrderForClient(page, client.id);
    await createDeputyAndAssignToExistingOrder(page, order.id);
    const deputy = await createDeputyAndAssignToExistingOrder(page, order.id);
    const fullName = `Mr ${deputy.firstname} ${deputy.surname}`;
    await updateDeputyWithErrorStatus(page, deputy.id, order.id);
    await page.goto(`/supervision/#/clients/${client.id}`);
    await page.getByRole("tab", { name: "Deputies" }).click();
    await expect(page.locator("#deputies-table tr.summary-row")).toHaveCount(2);
    await expect(
      page.locator("div").filter({ hasText: RegExp("^" + fullName + "$") }),
    ).toBeVisible();
    await page
      .getByRole("link", { name: `Deputy record: ${fullName}` })
      .click();
    await page.getByRole("button", { name: "Delete Deputy" }).click();
    await page
      .getByRole("dialog")
      .getByRole("button", { name: "Delete Deputy" })
      .click();
    await await expect(page).toHaveURL(/.*\/supervision\/#\/dashboard/);
    await page.goto(`/supervision/#/clients/${client.id}`);
    await page.getByRole("tab", { name: "Deputies" }).click();
    await page.getByRole("button", { name: "Add deputy" }).click();
    await page
      .getByRole("textbox", { name: "Search by SIRIUS ID or Name" })
      .fill(fullName);
    await page.getByRole("button", { name: "Search" }).click();
    await expect(page.getByText("No results could be found")).toBeVisible();
  });
});
