import { test, expect } from "@playwright/test";
import { loginAsAllocationsUser } from "../../../utils/login_as";
import { createClient } from "../../../fixtures/client/create_client";
import { createOrderForClient } from "../../../fixtures/order/create_order";

test.describe("Create letter", () => {
  test(
    "creates, edits, previews, and publishes a draft",
    { tag: "@supervision, @supervision-regression, @letter" },
    async ({ page, context }) => {
      await loginAsAllocationsUser(page, context);
      const client = await createClient(page);
      const order = await createOrderForClient(page, client.id);
      await page.goto(
        `/supervision/#/clients/${client.id}/orders/${order.id}/drafts/create/template`,
      );

      await expect(
        page.getByRole("heading", { name: "Select a template" }),
      ).toBeVisible();
      await page.getByRole("button", { name: "blank: Blank template" }).click();

      await expect(
        page.getByRole("heading", { name: "Select recipient/s" }),
      ).toBeVisible();
      await page
        .locator("#draft-select-recipients")
        .getByText(`${client.firstname} ${client.surname}`)
        .click();
      await page.locator("#create-letter-button").click();

      await expect(
        page.getByRole("button", { name: "Preview & publish" }),
      ).toBeVisible();
      await page.waitForLoadState("networkidle");
      await expect(
        page.getByRole("heading", { name: "Edit document..." }),
      ).toBeVisible();
      const editor = page
        .locator('iframe[title="Rich Text Area"]')
        .contentFrame()
        .getByLabel("Rich Text Area. Press ALT-0");
      await editor.clear();
      await editor.fill("My test letter content");

      await page
        .getByRole("button", { name: "Save draft", exact: true })
        .click();
      await page.getByRole("button", { name: "Close" }).click();
      await page.getByRole("button", { name: "Preview & publish" }).click();
      await page.waitForLoadState("networkidle");

      await expect(
        page
          .getByRole("dialog")
          .locator("iframe")
          .contentFrame()
          .getByText("My test letter content"),
      ).toBeVisible({ timeout: 30_000 });
      await page.getByRole("button", { name: "Publish", exact: true }).click();
      await expect(
        page.getByText("The draft has been successfully published"),
      ).toBeVisible();
      await page.getByRole("button", { name: "Close" }).click();
    },
  );
});
