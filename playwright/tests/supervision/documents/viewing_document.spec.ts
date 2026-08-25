import { test, expect } from "@playwright/test";
import {
  loginAsAllocationsUser,
  loginAsPublicAPI,
  loginAsSystemAdmin,
} from "../../../utils/login_as";
import { createClient } from "../../../fixtures/client/create_client";
import { uploadDocumentForClient } from "../../../fixtures/document/upload_document";

test.describe("Viewing a document in the documents tab for the client", () => {
  test("allows document to be viewed with PDF viewer", async ({
    page,
    context,
  }) => {
    await loginAsAllocationsUser(page, context);
    const client = await createClient(page);
    await page.waitForLoadState("networkidle");
    await loginAsPublicAPI(page, context);
    uploadDocumentForClient(page, client.caseRecNumber);
    await page.waitForLoadState("networkidle");
    await loginAsSystemAdmin(page, context);
    await page.goto(`/supervision/#/clients/${client.id}`);
    await page.getByRole("tab", { name: "Documents" }).click();
    await expect(page.locator("document-list-item")).toHaveCount(1);

    await page.getByRole("button", { name: "View document: TEST.pdf" }).click();
    await expect(
      page.locator("document-viewer iframe").contentFrame().getByText("TEST"),
    ).toBeVisible();
  });
});
