import { test, expect } from "@playwright/test";
import {
  loginAsAllocationsUser,
  loginAsPublicAPI,
} from "../../../utils/login_as";
import { createClient } from "../../../fixtures/client/create_client";
import { uploadDocumentForClient } from "../../../fixtures/document/upload_document";

test.describe("Downloading multiple files", () => {
  test(
    "can download multiple files at once",
    { tag: "@supervision, @supervision-regression, @downloads" },
    async ({ page, context }) => {
      await loginAsAllocationsUser(page, context);
      const client = await createClient(page);
      await page.waitForLoadState("networkidle");
      await loginAsPublicAPI(page, context);
      await uploadDocumentForClient(page, client.caseRecNumber);
      await uploadDocumentForClient(page, client.caseRecNumber);
      await page.waitForLoadState("networkidle");
      await loginAsAllocationsUser(page, context);
      await page.goto(`/supervision/#/clients/${client.id}`);
      await page.getByRole("tab", { name: "Documents" }).click();
      await expect(page.locator(".filter-numbers > .number")).toHaveText("2");
      await page
        .getByRole("row", { name: "Document Date Order Actions" })
        .locator("label")
        .click();
      const downloadPromise = page.waitForEvent("download");
      await page.getByRole("button", { name: "Open" }).click();
      await downloadPromise;
    },
  );
});
