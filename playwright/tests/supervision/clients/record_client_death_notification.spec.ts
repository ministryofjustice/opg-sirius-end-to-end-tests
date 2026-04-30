import { expect, test } from "@playwright/test";
import { createClient } from "../../../fixtures/client/create_client";
import { enterEditorTextByLabel } from "../../../utils/enter_editor_text_by_label";
import { loginAsCaseManager } from "../../../utils/login_as";

test.describe("Successfully record client death notification", () => {
  const dateNotified = "16/03/2023";
  const notifiedBy = "Deputy";
  const howNotified = "Email";

  test(
    "Successfully recording client death notification when populating all fields",
    {
      tag: "@supervision-core @client @client-record-death-notification @smoke-journey",
    },
    async ({ page, context }) => {
      await loginAsCaseManager(page, context);
      const client = await createClient(page);

      await page.goto(`/supervision/#/clients/${client.id}/record-death`);

      const recordDeathPanel = page.locator("#record-death");
      await expect(recordDeathPanel).toBeVisible();

      await recordDeathPanel.locator('input[name="dateNotified"]').clear();
      await recordDeathPanel
        .locator('input[name="dateNotified"]')
        .fill(dateNotified);
      await recordDeathPanel.locator('[name="notifiedBy"]').selectOption({
        label: notifiedBy,
      });

      await recordDeathPanel
        .locator(".fieldset", { hasText: "How was the OPG notified?" })
        .getByText(howNotified)
        .click();

      await enterEditorTextByLabel(
        page,
        "Notes (optional)",
        "<p>Client has been notified dead</p>",
      );

      await page
        .getByRole("button", { name: "Confirm death notification" })
        .click();
      await page.getByRole("button", { name: "Client death notified" }).click();

      await expect(page.locator(".client-priority-info")).toContainText(
        "Client notified deceased",
      );

      await page.locator("#tab-container").getByText("Timeline").click();

      const deathEvent = page.locator(
        ".event-death-record > .section-content > .wrapper",
      );
      await expect(deathEvent).toBeVisible();
      await expect(deathEvent).toContainText("Death");
      await expect(deathEvent).toContainText(
        "The death of the client has been notified",
      );
      await expect(deathEvent).toContainText(
        `Notified by ${notifiedBy} on ${dateNotified} by ${howNotified}`,
      );
    },
  );
});
