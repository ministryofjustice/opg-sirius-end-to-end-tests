import { expect, test } from "@playwright/test";
import { createClient } from "../../../../fixtures/client/create_client";
import { createVisitForClient } from "../../../../fixtures/visit/create_visit";
import { loginAsCaseManager } from "../../../../utils/login_as";

test.describe("Edit client visit", () => {
  test(
    "Given I'm a Case Manager on Supervision, I edit an existing visit",
    { tag: "@supervision @client @smoke-journey @supervision-notes" },
    async ({ page, context }) => {
      await loginAsCaseManager(page, context);
      const client = await createClient(page);
      await createVisitForClient(page, client.id);

      await page.goto(`/supervision/#/clients/${client.id}`);
      await page.getByRole("tab", { name: "Visits" }).click();

      await expect(
        page.getByText("Supervision - Pro Visit - Standard"),
      ).toBeVisible();
      await page.locator(".edit-visit-button").click();

      await expect(page.getByText("Loading visit...")).toBeVisible();
      await expect(page.getByText("Who to visit (optional)")).toBeVisible();
      await page.getByText("Deputy", { exact: true }).click();
      await page.getByRole("button", { name: "Save" }).click();

      await expect(page.locator("visit-list-item-view")).toContainText(
        "Who to visit: Deputy",
      );
    },
  );
});
