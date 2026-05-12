import { expect, test } from "@playwright/test";
import { createClient } from "../../../../fixtures/client/create_client";
import { createOrderForClient } from "../../../../fixtures/order/create_order";
import { loginAsCaseManager } from "../../../../utils/login_as";

test.describe("Add visit", () => {
  test(
    "can add a new visit",
    { tag: "@supervision-core @visit @smoke-journey" },
    async ({ page, context }) => {
      await loginAsCaseManager(page, context);
      const client = await createClient(page);
      const order = await createOrderForClient(page, client.id);

      await page.goto(`/supervision/#/clients/${client.id}?order=${order.id}`);
      await page.getByRole("tab", { name: "Documents" }).click();

      await page.locator("#add-visit-button").click();

      const addVisitPanel = page.locator("#add-visit");
      await addVisitPanel
        .locator(".fieldset", { hasText: "Visit type" })
        .getByText("Supervision")
        .click();
      await addVisitPanel
        .locator(".fieldset", { hasText: "Visit subtype" })
        .locator("select")
        .selectOption({ label: "Pro Visit" });
      await addVisitPanel
        .locator(".fieldset", { hasText: "Visit urgency" })
        .getByText("Standard")
        .click();
      await addVisitPanel
        .locator(".fieldset", { hasText: "Who to visit" })
        .getByText("Client", { exact: true })
        .check({ force: true });

      await page.getByRole("button", { name: "Save & exit" }).click();
      await page.getByRole("tab", { name: "Visits" }).click();

      await expect(
        page.locator(".hook-visits-tab .hook-tab-item"),
      ).toContainText("Supervision - Pro Visit - Standard");

      await page.getByRole("tab", { name: "Timeline" }).click();
      await expect(
        page.locator(".timeline-event-title", { hasText: "Visit added" }),
      ).toBeVisible();
      await expect(
        page.locator(".changeset-visittype", { hasText: "Supervision" }),
      ).toBeVisible();
      await expect(
        page.locator(".changeset-visitsubtype", { hasText: "Pro Visit" }),
      ).toBeVisible();
      await expect(
        page.locator(".changeset-visiturgency", { hasText: "Standard" }),
      ).toBeVisible();
    },
  );
});
