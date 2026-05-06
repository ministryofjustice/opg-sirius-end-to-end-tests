import { expect, test } from "@playwright/test";
import { createClient } from "../../../fixtures/client/create_client";
import { createOrderForClient } from "../../../fixtures/order/create_order";
import { loginAsCaseManager } from "../../../utils/login_as";

test.describe(
  "Editing tasks",
  { tag: "@supervision @supervision-regression @client-dashboard" },
  () => {
    test("Reassigning and changing due date tasks in supervision", async ({
      page,
      context,
    }) => {
      await loginAsCaseManager(page, context);
      const client = await createClient(page);
      await createOrderForClient(page, client.id);
      await page.goto(`/supervision/#/clients/${client.id}`);

      // Verify task count in tab
      const taskTab = page.locator("#tab-container").getByText("1 Tasks");
      await expect(taskTab).toBeVisible();
      await taskTab.click();

      // Click update task button
      await page.locator(".update-task-button").click();

      // Assign to other team
      const assignToFieldset = page
        .locator(".fieldset", { hasText: "Assign to" })
        .locator("select");
      await assignToFieldset.selectOption("2");
      await expect(assignToFieldset).toContainText("Other team");

      // Select team
      const selectTeamFieldset = page
        .locator(".fieldset", { hasText: "Select team" })
        .locator("select");
      await selectTeamFieldset.selectOption("25");
      await expect(selectTeamFieldset).toContainText(
        "Allocations - (Supervision)",
      );

      // Set due date
      const dueDateInput = page
        .locator(".fieldset", { hasText: "Due Date" })
        .locator("input");
      await dueDateInput.clear();
      await dueDateInput.fill("30/08/2020");

      // Submit the form
      await page.locator(".footer > :nth-child(1) > .button").click();

      // Verify success message
      await expect(
        page.locator("div.panel > :nth-child(3) > .in-page-banner"),
      ).toContainText("Task updated successfully");
    });
  },
);
