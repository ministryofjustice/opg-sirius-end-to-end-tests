import { expect, test } from "@playwright/test";
import { createClient } from "../../../fixtures/client/create_client";
import { enterEditorTextByLabel } from "../../../utils/enter_editor_text_by_label";
import { loginAsCaseManager } from "../../../utils/login_as";

test.describe("Add a warning", () => {
  test(
    "successfully after checking you cant with out each mandatory fields",
    { tag: "@supervision @client @smoke-journey" },
    async ({ page, context }) => {
      await loginAsCaseManager(page, context);
      const client = await createClient(page);

      await page.goto(`/supervision/#/clients/${client.id}`);

      await page.locator("#add-warning-button").click();
      await expect(
        page.getByRole("button", { name: "Save & exit" }),
      ).toBeDisabled();

      await enterEditorTextByLabel(
        page,
        "Notes",
        "<p>Warning has been added</p>",
      );
      await expect(
        page.getByRole("button", { name: "Save & exit" }),
      ).toBeDisabled();

      await page
        .locator(".fieldset", { hasText: "Warning type" })
        .locator("select")
        .selectOption("1");
      await expect(
        page.locator(".fieldset", { hasText: "Warning type" }),
      ).toContainText("Compensation Claim Pending");

      await enterEditorTextByLabel(page, "Notes", "Warning has been added");
      await page.getByRole("button", { name: "Save & exit" }).click();

      await expect(
        page.locator("div.panel > in-page-notification > .in-page-banner"),
      ).toContainText("Warning created, redirecting...");

      await page.locator("#tab-container").getByText("Summary").click();
      await expect(
        page.locator(".hook-tab-content .warnings-list").first(),
      ).toContainText("Compensation Claim Pending");
      await expect(page.locator(".client-priority-info > span")).toContainText(
        "Case has warnings",
      );
    },
  );
});
