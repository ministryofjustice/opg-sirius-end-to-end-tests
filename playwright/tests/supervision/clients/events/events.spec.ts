import { expect, test } from "@playwright/test";
import { createClient } from "../../../../fixtures/client/create_client";
import { loginAsCaseManager } from "../../../../utils/login_as";

test.describe("Events", () => {
  test(
    "Successfully create a client event in Supervision",
    { tag: "@supervision-core @client-risk @smoke-journey" },
    async ({ page, context }) => {
      await loginAsCaseManager(page, context);
      const client = await createClient(page);

      await page.goto(`/supervision/#/clients/${client.id}`);
      await page.getByRole("tab", { name: "Documents" }).click();

      await page.locator("#create-event-button").click();
      await expect(page.locator("#noteDirection")).toContainText("Incoming");

      const noteCategoryField = page.locator('[label="FIELDLABELS.NOTE_CATEGORY"]');
      await noteCategoryField.getByText("Case Management", { exact: true }).click();


      await page
        .locator('*[id^="FIELDLABELSN_"]')
        .first()
        .selectOption({ index: 1 });
      await page.getByRole("button", { name: "Save" }).click();

      await page.getByRole("tab", { name: "Timeline" }).click();
      await expect(
        page.locator(".event-note > .section-content > .wrapper"),
      ).toContainText("event has been recorded");
      await expect(
        page.locator(".event-note > .section-content > .wrapper"),
      ).toContainText("Event date");
    },
  );
});
