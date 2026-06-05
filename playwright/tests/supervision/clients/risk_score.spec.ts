import { expect, test } from "@playwright/test";
import { createClient } from "../../../fixtures/client/create_client";
import { enterEditorTextByLabel } from "../../../utils/enter_editor_text_by_label";
import { loginAsCaseManager } from "../../../utils/login_as";

test.describe("Record a client risk score", () => {
  test(
    "Records a client risk score",
    { tag: "@supervision-core @client-risk @smoke-journey" },
    async ({ page, context }) => {
      await loginAsCaseManager(page, context);
      const client = await createClient(page);
      await page.goto(`/supervision/#/clients/${client.id}`);

      await page
        .getByRole("button", { name: "Record client risk score" })
        .click();

      const riskForm = page.locator("#edit-client-risk-score");
      await riskForm
        .locator(".fieldset", { hasText: "Client Risk Evaluation Criteria" })
        .locator("select")
        .selectOption({ label: "2" });

      await enterEditorTextByLabel(page, "Notes", "Risk score added");

      await page.getByRole("button", { name: "Save & exit" }).click();

      const summary = page.locator(".client-summary");
      await expect(summary).toBeVisible();
      const riskScoreLabel = summary.getByText("Risk score").first();
      await expect(riskScoreLabel).toBeVisible();
      await expect(
        riskScoreLabel.locator("xpath=following-sibling::*[last()]"),
      ).toContainText("2");

      await page.locator("#tab-container").getByText("Timeline").click();

      const timelineWrapper = page
        .locator(".wrapper", {
          has: page.locator(".timeline-event-title", {
            hasText: "Client risk score updated",
          }),
        })
        .first();

      await expect(timelineWrapper).toBeVisible();
      await expect(timelineWrapper.locator("li").first()).toContainText(
        /Previous client risk score\s+Not Set/,
      );
      await expect(timelineWrapper.locator("li").nth(1)).toContainText(
        /New client risk score\s+2/,
      );
    },
  );
});
