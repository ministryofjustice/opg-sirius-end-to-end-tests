import { test, expect } from "@playwright/test";
import {
  loginAsAllocationsUser,
  loginAsCaseManager,
} from "../../../utils/login_as";
import { createClient } from "../../../fixtures/client/create_client";

test.describe(
  "Viewing the documents tab for the client",
  { tag: "@supervision, @filtering-document" },
  () => {
    test("filtering the documents tab for the client", async ({
      page,
      context,
    }) => {
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

      await page.getByRole("button", { name: "New event" }).click();
      await page.getByText("Case Management").click();
      await page.getByLabel("Event type").selectOption({ label: "Order" });
      await page.getByText("Outgoing").click();
      await page
        .getByRole("button", { name: "File upload (optional)" })
        .click();
      await page
        .getByRole("button", { name: "File upload (optional)" })
        .setInputFiles("fixtures/document/niceFile.txt");
      await page.getByRole("button", { name: "Save & exit" }).click();
      await page.getByRole("tab", { name: "Documents" }).click();

      await expect(page.locator("document-list-item")).toHaveCount(2);
      await page.getByRole("button", { name: "Order" }).click();
      await page.getByRole("button", { name: "Apply" }).click();
      await expect(page.locator("document-list-item")).toHaveCount(1);
    });
  },
);
