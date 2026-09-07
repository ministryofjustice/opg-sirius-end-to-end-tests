import { test, expect } from "@playwright/test";
import { loginAsAllocationsUser } from "../../../utils/login_as";
import { createClient } from "../../../fixtures/client/create_client";
import { createOrderForClient } from "../../../fixtures/order/create_order";
import { createDraftForClient } from "../../../fixtures/draft/create_draft";

test.describe("Edit letter", () => {
  test(
    "editing and retrieving a letter",
    { tag: "@supervision, @supervision-regression, @letter" },
    async ({ page, context }) => {
      await loginAsAllocationsUser(page, context);
      const client = await createClient(page);
      const order = await createOrderForClient(page, client.id);
      const draft = await createDraftForClient(page, order.id, client.id);
      await page.goto(
        `supervision/#/clients/${client.id}/orders/${order.id}/drafts/${draft[0].id}`,
      );
      await page.waitForLoadState("networkidle");
      const editor = page
        .locator('iframe[title="Rich Text Area"]')
        .contentFrame()
        .getByLabel("Rich Text Area. Press ALT-0");
      await editor.clear();
      await editor.fill("My test letter content");
      await page.getByRole("button", { name: "Save draft & exit" }).click();
      await expect(page.getByText("Draft saved successfully")).toBeVisible();
      await page.getByRole("button", { name: "Close" }).click();
      await page.getByRole("button", { name: "Retrieve drafts" }).click();
      await expect(
        page
          .locator('iframe[title="Rich Text Area"]')
          .contentFrame()
          .getByText("My test letter content"),
      ).toBeVisible();
    },
  );
});
