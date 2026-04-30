import { expect, test } from "@playwright/test";
import { createClient } from "../../../fixtures/client/create_client";
import { createOrderForClient } from "../../../fixtures/order/create_order";
import { createTaskForOrder } from "../../../fixtures/task/create_task";
import { loginAsCaseManager } from "../../../utils/login_as";

test.describe("Viewing the client tasks page", () => {
  test(
    "shows client tasks as expected and updates them when tasks completed",
    { tag: "@supervision @supervision-regression @client-dashboard" },
    async ({ page, context }) => {
      await loginAsCaseManager(page, context);
      const client = await createClient(page);
      const order = await createOrderForClient(page, client.id);
      await createTaskForOrder(page, order.id);
      await page.goto(`/supervision/#/clients/${client.id}`);

      await expect(page.locator("#tab-container").getByText("2")).toBeVisible();
      await expect(
        await page.locator("#tab-container").getByText("Tasks"),
      ).toBeVisible();
      await page.locator("#tab-container").getByText("Tasks").click();

      await expect(page.locator("#client-tasks-list")).toBeVisible();
      const taskColumns = page.locator(".task-columns > *");
      await expect(taskColumns.nth(0)).toContainText("Type");
      await expect(taskColumns.nth(1)).toContainText("Task due date");
      await expect(taskColumns.nth(2)).toContainText("Assigned to");
      await expect(taskColumns.nth(3)).toContainText("Order");

      await expect(
        page.locator(".task-name", { hasText: "Casework - Reply due" }),
      ).toBeVisible();
      await expect(
        page.locator(".due-date", { hasText: "29/03/2025" }),
      ).toBeVisible();
      await expect(
        page.locator(".assigned-to", {
          hasText: "Attorneyship Investigation Team",
        }),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Complete: Casework - Reply due" }),
      ).toContainText("Complete");
      await expect(
        page.getByRole("button", { name: "Update task: Casework - Reply" }),
      ).toContainText("Update Task");

      // Task details should be hidden until the "View notes" button is clicked
      const taskDetailsCell = page.getByText("NotesMandatory description");
      await expect(taskDetailsCell).not.toBeVisible();
      await expect(
        page.getByRole("button", { name: "View notes: Casework - Reply" }),
      ).toContainText("View notes");
      await page
        .getByRole("button", { name: "View notes: Casework - Reply" })
        .click();
      await expect(taskDetailsCell).toBeVisible();
      await expect(taskDetailsCell).toContainText("Mandatory description");

      await expect(
        page
          .getByRole("row", { name: "Casework - Reply due Optional" })
          .locator("order-header-summary"),
      ).toContainText("PFA");

      await page.locator(".mark").first().click();
      await expect(page.locator(".head > .title")).toContainText(
        "Complete task",
      );
      const completeTaskButton = page.locator(
        ".footer > :nth-child(1) > .button",
      );
      await expect(completeTaskButton).toContainText("Complete the task");
      await completeTaskButton.click();

      await expect(page.getByRole("tab", { name: /1 Tasks/ })).toBeVisible();
    },
  );
});
