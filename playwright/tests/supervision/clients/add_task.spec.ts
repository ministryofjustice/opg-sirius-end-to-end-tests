import { expect, test } from "@playwright/test";
import { createClient } from "../../../fixtures/client/create_client";
import { createOrderForClient } from "../../../fixtures/order/create_order";
import { enterEditorTextByLabel } from "../../../utils/enter_editor_text_by_label";
import { loginAsCaseManager } from "../../../utils/login_as";

test.describe("Creating self assigned task in supervision", () => {
  test(
    "new task is created after a validation error",
    { tag: "@supervision @supervision-regression @client-dashboard" },
    async ({ page, context }) => {
      await loginAsCaseManager(page, context);
      const client = await createClient(page);
      await createOrderForClient(page, client.id);
      await page.goto(`/supervision/#/clients/${client.id}`);

      await page.locator("#add-task-button").click();

      const taskTypeFieldset = page
        .locator(".fieldset", { hasText: "Task type" })
        .locator("select");
      await taskTypeFieldset.selectOption("1");
      await expect(taskTypeFieldset).toContainText(
        "Casework - Complaint review",
      );

      const assignToFieldset = page
        .locator(".fieldset", { hasText: "Assign to" })
        .locator("select");
      await assignToFieldset.selectOption("0");
      await expect(assignToFieldset).toContainText("Myself");

      await page
        .locator(".fieldset", { hasText: "Due Date" })
        .locator("input")
        .fill("08/08/2020");

      const data = "A".repeat(999);
      await enterEditorTextByLabel(page, "Notes (optional)", `<p>${data}</p>`);

      await page.getByRole("button", { name: "Save & exit" }).click();

      await expect(page.locator(".validation-summary")).toContainText(
        "There is a problem",
      );
      await expect(page.locator(".validation-summary")).toContainText(
        "Notes - The input is more than 1000 characters long",
      );

      await enterEditorTextByLabel(
        page,
        "Notes (optional)",
        "<p>Working now</p>",
      );
      await page.getByRole("button", { name: "Save & exit" }).click();

      await expect(page.locator("#tab-container").getByText("2")).toBeVisible();
      await expect(
        await page.locator("#tab-container").getByText("Tasks"),
      ).toBeVisible();
      await page.locator("#tab-container").getByText("Tasks").click();

      await expect(page.locator("#client-tasks-list")).toBeVisible();
    },
  );
});
