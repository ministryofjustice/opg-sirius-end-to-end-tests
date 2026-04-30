import { expect, test } from "@playwright/test";
import { createClient } from "../../../fixtures/client/create_client";
import { createDeputyAndAssignToExistingOrder } from "../../../fixtures/deputy/create_deputy_and_assign_to_existing_order";
import { createOrderForClient } from "../../../fixtures/order/create_order";
import { addSupervisionLevel } from "../../../fixtures/order/add_supervision_level";
import { makeOrderActive } from "../../../fixtures/order/make_order_active";
import { loginAsAllocationsUser } from "../../../utils/login_as";

test.describe("Allocate a client smoke journey", () => {
  test(
    "allocates a client to casework team when order is active",
    { tag: "@supervision-core @allocate-client @smoke-journey" },
    async ({ page, context }) => {
      test.slow();

      await loginAsAllocationsUser(page, context);

      const client = await createClient(page);
      const order = await createOrderForClient(page, client.id);
      await addSupervisionLevel(page, order.id);
      await createDeputyAndAssignToExistingOrder(page, order.id);
      await makeOrderActive(page, order.id);

      await page.goto(`/supervision/#/clients/${client.id}?order=${order.id}`);

      await page.locator("#allocate-button").click();
      await page
        .locator(".required")
        .locator("xpath=ancestor::*[contains(@class, 'fieldset')]")
        .locator("select")
        .selectOption({ label: "Lay Team 1 - (Supervision)" });
      await page.locator("button.button.primary.dialog-button").click();

      await expect(
        page.locator(".case-owner-value-in-client-summary"),
      ).toContainText("Lay Team 1 - (Supervision) - 0123456789");
      await expect(page.locator("#allocate-button")).toBeVisible();
      await expect(page.locator("#allocate-button")).toBeDisabled();

      await page.locator("#tab-container").getByText("Timeline").click();

      await expect(
        page.locator(".timeline-event-title", { hasText: "Client Allocated" }),
      ).toBeVisible();
      await expect(page.locator(".hook-allocated-teamname")).toContainText(
        "Lay Team 1 - (Supervision)",
      );
      await expect(page.locator(".hook-allocated-clientname")).toContainText(
        `${client.firstname} ${client.surname}`,
      );
    },
  );
});
