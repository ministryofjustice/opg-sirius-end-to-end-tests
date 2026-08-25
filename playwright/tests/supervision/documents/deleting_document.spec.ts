import { test, expect } from "@playwright/test";
import {
  loginAsAllocationsUser,
  loginAsCaseManager,
  loginAsPublicAPI,
  loginAsSystemAdmin,
} from "../../../utils/login_as";
import {
  createClient,
  CreatedClient,
} from "../../../fixtures/client/create_client";
import { uploadDocumentForClient } from "../../../fixtures/document/upload_document";

test.describe(
  "Viewing the documents tab for the client",
  { tag: "@supervision, @deleting-document" },
  () => {
    let client: CreatedClient;
    test.beforeEach(async ({ page, context }) => {
      await loginAsAllocationsUser(page, context);
      client = await createClient(page);
      await page.waitForLoadState("networkidle");
      await loginAsPublicAPI(page, context);
      await uploadDocumentForClient(page, client.caseRecNumber);
      await page.waitForLoadState("networkidle");
    });
    test("hides delete button if user does not have permissions", async ({
      page,
      context,
    }) => {
      await loginAsCaseManager(page, context);
      await page.goto(`/supervision/#/clients/${client.id}`);
      await page.getByRole("tab", { name: "Documents" }).click();
      await expect(page.locator("document-list-item")).toHaveCount(1);
      await expect(page.getByText("Delete")).not.toBeVisible();
    });
    test("allows document deletion if user has permissions a document for the client", async ({
      page,
      context,
    }) => {
      // test.slow();
      await loginAsSystemAdmin(page, context);
      await page.goto(`/supervision/#/clients/${client.id}`);
      await page.getByRole("tab", { name: "Documents" }).click();
      await expect(page.locator("document-list-item")).toHaveCount(1);
      // First time the dialog opens the Reason options are not populated for Playwright. So cancel out and reopen
      await page.getByRole("button", { name: "Delete: TEST.pdf" }).click();
      await expect(page.getByText("Delete this client document")).toBeVisible();
      await page
        .getByRole("dialog")
        .getByRole("button", { name: "Cancel" })
        .click();

      await page.getByRole("button", { name: "Delete: TEST.pdf" }).click();
      await expect(page.getByText("Delete this client document")).toBeVisible();
      await page
        .getByRole("dialog")
        .getByLabel("Reason")
        .selectOption({ label: "Duplicate" });
      await page
        .getByRole("dialog")
        .getByRole("button", { name: "Delete the document" })
        .click();

      await expect(
        page.getByText("TEST.pdf has now been deleted"),
      ).toBeVisible();
      await expect(page.getByText("There are no documents")).toBeVisible();
    });
  },
);
