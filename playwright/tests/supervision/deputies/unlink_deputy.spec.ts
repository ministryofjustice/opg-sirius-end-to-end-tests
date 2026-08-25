import { test, expect } from "@playwright/test";
import { loginAsCaseManager } from "../../../utils/login_as";
import { createClient } from "../../../fixtures/client/create_client";
import { createOrderForClient } from "../../../fixtures/order/create_order";
import {
  assignDeputyToOrder,
  createDeputyAndAssignToExistingOrder,
} from "../../../fixtures/deputy/create_deputy_and_assign_to_existing_order";
import { updateDeputyWithErrorStatus } from "../../../fixtures/deputy/update_deputy_on_order";

test.describe("Unlink a deputy from an order", () => {
  test(
    "Should remove the deputy from the client's deputy list",
    { tag: "@supervision, @deputy, @supervision-core, @smoke-journey" },
    async ({ page, context }) => {
      await loginAsCaseManager(page, context);
      const client = await createClient(page);
      const order = await createOrderForClient(page, client.id);
      const deputy = await createDeputyAndAssignToExistingOrder(page, order.id);

      const client2 = await createClient(page);
      const order2 = await createOrderForClient(page, client2.id);
      await createDeputyAndAssignToExistingOrder(page, order2.id);

      await assignDeputyToOrder(page, order2.id, deputy.id);
      await updateDeputyWithErrorStatus(page, deputy.id, order2.id);
      await page.goto(`/supervision/#/clients/${client2.id}`);
      await page.getByRole("tab", { name: "Deputies" }).click();
      await expect(page.locator("#deputies-table tr.summary-row")).toHaveCount(
        2,
      );
      await page.getByRole("button", { name: "Un-link deputy" }).click();
      await page
        .getByRole("dialog")
        .getByRole("button", { name: "Unlink deputy" })
        .click();
      await expect(page.getByText("has now been unlinked")).toBeVisible();
      await expect(page.locator("#deputies-table tr.summary-row")).toHaveCount(
        1,
      );
    },
  );
});
