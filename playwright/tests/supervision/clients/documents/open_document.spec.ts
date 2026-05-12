import { chromium, expect, Page, test } from "@playwright/test";
import {
  createClient,
  CreatedClient,
} from "../../../../fixtures/client/create_client";
import { uploadDocumentForClient } from "../../../../fixtures/document/upload_document";
import {
  loginAsCaseManager,
  loginAsPublicAPI,
} from "../../../../utils/login_as";

test.describe("Open document successfully", () => {
  let client: CreatedClient;
  let publicApiPage: Page;

  test.beforeEach(async ({ page, context }) => {
    await loginAsCaseManager(page, context);
    client = await createClient(page);
    const browser = await chromium.launch();

    const publicApiContext = await browser.newContext();
    publicApiPage = await publicApiContext.newPage();
    await loginAsPublicAPI(publicApiPage, publicApiContext);
    await uploadDocumentForClient(publicApiPage, client.caseRecNumber);
  });

  test(
    "opens a document successfully",
    { tag: "@supervision-core @documents @open-document @smoke-journey" },
    async ({ page }) => {
      await page.goto(`/supervision/#/clients/${client.id}`);
      await expect(page.locator(".title-person-name")).toContainText(
        `${client.firstname} ${client.surname}`,
      );

      await page.getByRole("tab", { name: "Documents" }).click();
      await expect(page.locator(".filter-numbers > .number")).toHaveText("1");
      await page
        .getByRole("row", { name: "Document Date Order Actions" })
        .locator("label")
        .click();

      const downloadPromise = page.waitForEvent("download");
      await page.getByRole("button", { name: "Open" }).click();
      const download = await downloadPromise;

      expect(download.suggestedFilename()).toBeTruthy();
      const savedFilePath = await download.path();
      expect(savedFilePath).not.toBeNull();
    },
  );

  test(
    "multiple document download",
    { tag: "@supervision-core @documents @open-document @smoke-journey" },
    async ({ page }) => {
      await uploadDocumentForClient(publicApiPage, client.caseRecNumber);

      await page.goto(`/supervision/#/clients/${client.id}`);
      await expect(page.locator(".title-person-name")).toContainText(
        `${client.firstname} ${client.surname}`,
      );

      await page.getByRole("tab", { name: "Documents" }).click();
      await expect(page.locator(".filter-numbers > .number")).toHaveText("2");
      await page
        .getByRole("row", { name: "Document Date Order Actions" })
        .locator("label")
        .click();

      const fileServiceResponse = page.waitForResponse(
        (response) =>
          response.request().method() === "GET" &&
          /\/services\/file-service\/zip\//.test(response.url()),
      );
      const downloadPromise = page.waitForEvent("download");
      await page.getByRole("button", { name: "Open" }).click();

      const [response, download] = await Promise.all([
        fileServiceResponse,
        downloadPromise,
      ]);

      expect(response.status()).toBe(200);
      expect(download.suggestedFilename()).toBe("download.zip");
      const savedFilePath = await download.path();
      expect(savedFilePath).not.toBeNull();
    },
  );
});
