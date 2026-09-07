import { test, expect } from "@playwright/test";
import { loginAsAllocationsUser } from "../../../utils/login_as";
import { createClient } from "../../../fixtures/client/create_client";
import { createOrderForClient } from "../../../fixtures/order/create_order";
import { createDraftForClient } from "../../../fixtures/draft/create_draft";

test.describe("Delete letter", () => {
  test("deletes a drafted letter", async ({ page, context }) => {
    await loginAsAllocationsUser(page, context);
    const client = await createClient(page);
    const order = await createOrderForClient(page, client.id);
    const draft = await createDraftForClient(page, order.id, client.id);
    await page.goto(
      `supervision/#/clients/${client.id}/orders/${order.id}/drafts/${draft[0].id}`,
    );
    await page.getByRole("button", { name: "Delete draft" }).click();
    await page.getByRole("button", { name: "Confirm" }).click();
    await expect(
      page.getByRole("dialog").getByText("Draft deleted successfully"),
    ).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(
      page.getByRole("button", { name: "Retrieve drafts" }),
    ).toBeDisabled();
  });
});
