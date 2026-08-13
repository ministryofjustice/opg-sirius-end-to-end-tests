import { test, expect } from "@playwright/test";
import { loginAsCaseManager } from "../../../utils/login_as";
import { createOrderForClient } from "../../../fixtures/order/create_order";
import { createClient } from "../../../fixtures/client/create_client";
import { createDeputyAndAssignToExistingOrder } from "../../../fixtures/deputy/create_deputy_and_assign_to_existing_order";

test("Loads the lay deputy hub", async ({ page, context }) => {
  await loginAsCaseManager(page, context);
  const client = await createClient(page);
  const order = await createOrderForClient(page, client.id);
  await createDeputyAndAssignToExistingOrder(page, order.id);

  await page.goto(`/supervision/#/clients/${client.id}`);
  await page.getByRole("tab", { name: "Deputies" }).click();
  await page.locator(".record").click();
  expect(page.url()).toContain("supervision/#/deputy-hub");
  await expect(
    page.locator(".deputy-hub-deputy-name-header-link"),
  ).toBeVisible();
  await expect(page.locator(".tab-container__tabs")).toContainText("Details");
  await expect(page.locator(".tab-container__tabs")).toContainText("Clients");
  await expect(page.locator(".tab-container__tabs")).toContainText("Timeline");
  await expect(page.locator(".deputy-sub-theme")).toBeVisible();
});
