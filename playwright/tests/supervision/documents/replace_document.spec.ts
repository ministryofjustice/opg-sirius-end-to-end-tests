import { test, expect } from "@playwright/test";
import {
  loginAsAllocationsUser,
  loginAsCaseManager,
} from "../../../utils/login_as";
import { createClient } from "../../../fixtures/client/create_client";

test.describe("Successfully replacing a document in supervision", () => {
  test(
    "can replace a document on an event",
    { tag: "@supervision, @replace-document" },
    async ({ page, context }) => {
      await loginAsAllocationsUser(page, context);
      const client = await createClient(page);
      await page.waitForLoadState("networkidle");
      await loginAsCaseManager(page, context);
      await page.goto(`/supervision/#/clients/${client.id}`);
      await page.getByRole("tab", { name: "Documents" }).click();

      await page.getByRole("button", { name: "New event" }).click();
      await page.getByText("Case Management").click();
      await page.getByLabel("Event type").selectOption({ label: "Call" });
      await page.getByText("Outgoing").click();
      await page
        .getByRole("button", { name: "File upload (optional)" })
        .click();
      await page
        .getByRole("button", { name: "File upload (optional)" })
        .setInputFiles("fixtures/document/niceFile.txt");
      await page.getByRole("button", { name: "Save & exit" }).click();
      await page.getByRole("tab", { name: "Documents" }).click();

      await expect(
        page.getByRole("cell", {
          name: "View document: niceFile.txt Doc type Call Direction Outbound Created by case manager",
          exact: true,
        }),
      ).toBeVisible();
      await page.getByRole("button", { name: "Replace: niceFile.txt" }).click();

      await expect(page.getByText("File being replaced")).toBeVisible();
      await page
        .getByRole("textbox", { name: "FIELDLABELS.REASON" })
        .fill("A good reason to change the document.");
      await page.getByRole("button", { name: "New document" }).click();
      await page
        .getByRole("button", { name: "New document" })
        .setInputFiles("fixtures/document/newFile.txt");
      await page
        .getByRole("textbox", { name: "FIELDLABELS.DOCUMENTNAME" })
        .fill("A".repeat(256));
      await page.getByRole("button", { name: "Save & exit" }).click();
      await expect(page.getByText("There is a problem")).toBeVisible();
      await expect(
        page.getByText(
          "Document name - The input is more than 255 characters long",
        ),
      ).toBeVisible();
      await page
        .getByRole("textbox", { name: "FIELDLABELS.DOCUMENTNAME" })
        .fill("");
      await page.getByRole("button", { name: "Save & exit" }).click();

      await expect(
        page.getByRole("cell", {
          name: "View document: newFile.txt Doc type Call Direction Outbound Replaced by case manager",
          exact: true,
        }),
      ).toBeVisible();
      await expect(page.getByText("Replaced date")).toBeVisible();

      await page.getByRole("tab", { name: "Timeline" }).click();
      await expect(page.getByText("Document replaced")).toBeVisible();
      await expect(page.getByText("has been replaced")).toBeVisible();
      await expect(
        page.locator("timeline-replaced-document-file").getByText("Filename"),
      ).toBeVisible();
      await expect(
        page.getByText("A good reason to change the document"),
      ).toBeVisible();
    },
  );
});
