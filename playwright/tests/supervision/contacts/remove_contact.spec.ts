import { test, expect } from "@playwright/test";
import {
  loginAsAllocationsUser,
  loginAsCaseManager,
} from "../../../utils/login_as";
import {
  createClient,
  CreatedClient,
} from "../../../fixtures/client/create_client";
import { createContactForClient } from "../../../fixtures/contact/create_contact";
import { createOrderForClient } from "../../../fixtures/order/create_order";

test.describe(
  "Remove contact",
  { tag: "@supervision-core, @contact, @smoke-journey" },
  () => {
    let client: CreatedClient;

    test.beforeEach(async ({ page, context }) => {
      await loginAsCaseManager(page, context);
      client = await createClient(page);
      await createContactForClient(page, client.id, {
        firstname: "Ian",
        surname: "Contacts",
      });
    });

    test("can not be deleted due to having a document associated to them", async ({
      page,
      context,
    }) => {
      await loginAsAllocationsUser(page, context);
      await page.goto(`/supervision/#/clients/${client.id}`);
      const order = await createOrderForClient(page, client.id);
      await page.goto(
        `/supervision/#/clients/${client.id}/orders/${order.id}/drafts/create/template`,
      );

      await expect(page.locator(".select-template")).toContainText(
        "Select a template",
      );

      await page.getByRole("button", { name: "blank: Blank template" }).click();
      await page.getByText("Mr Ian Contacts").click();
      await page.getByRole("button", { name: "Create letter" }).click();

      const editor = page
        .locator('iframe[title="Rich Text Area"]')
        .contentFrame()
        .getByLabel("Rich Text Area. Press ALT-0");
      await editor.clear();
      await editor.fill("This is a letter that I have created.");

      await page
        .getByRole("button", { name: "Save draft", exact: true })
        .click();
      await page.getByRole("button", { name: "Close" }).click();
      await page.getByRole("button", { name: "Preview & publish" }).click();
      await page.getByRole("button", { name: "Publish", exact: true }).click();
      await page.getByRole("button", { name: "Close" }).click();

      await page.locator("#tab-container").getByText("Contacts").click();

      await page.locator(".delete").click();
      await page.locator(".dialog-footer > .button").click();

      const contact = page.locator("tab-contact-list .in-page-error-banner");
      await expect(contact).toBeVisible();
      await expect(contact).toContainText("This contact cannot be deleted.");
    });

    test("can be deleted", async ({ page }) => {
      await page.goto(`/supervision/#/clients/${client.id}`);
      await page.locator("#tab-container").getByText("Contacts").click();

      await page.locator(".delete").click();
      await page.locator(".dialog-footer > .button").click();

      const contact = page.locator(
        "tab-contact-list > .hook-tab-content > :nth-child(1) > .in-page-banner > .content > h2",
      );
      await expect(contact).toBeVisible();
      await expect(contact).toContainText(
        "Mr Ian Contacts has now been deleted",
      );
    });
  },
);
