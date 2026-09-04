import { test, expect } from "@playwright/test";
import { loginAsCaseManager } from "../../../utils/login_as";
import { createClient } from "../../../fixtures/client/create_client";
import { createOrderForClient } from "../../../fixtures/order/create_order";
import { createDeputyAndAssignToExistingOrder } from "../../../fixtures/deputy/create_deputy_and_assign_to_existing_order";

test.describe("Deputy Death Notification & Confirmation", () => {
  test(
    "records a death notification for a deputy and confirms it",
    {
      tag: "@supervision, @deputy, @supervision-core, @deputy-hub, @deputy-record-death-notification, @deputy-record-death-confirmation",
    },
    async ({ page, context }) => {
      await loginAsCaseManager(page, context);
      const client = await createClient(page);
      const order = await createOrderForClient(page, client.id);
      const deputy = await createDeputyAndAssignToExistingOrder(page, order.id);
      await page.goto(`/supervision/#/clients/${client.id}`);
      await page.getByRole("tab", { name: "Deputies" }).click();
      await page.getByRole("link", { name: "Deputy record" }).click();
      await page.getByRole("button", { name: "Record death" }).click();
      await expect(
        page.getByText(`Record death of ${deputy.firstname}`),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "Confirm death notification" }),
      ).toBeDisabled();

      let today = new Date().toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      await page
        .getByRole("textbox", { name: "Date notified (dd/mm/yyyy)" })
        .fill(today);
      await page.getByLabel("Notified by").selectOption("0");
      await page.getByText("Email", { exact: true }).click();
      await page
        .getByRole("button", { name: "Confirm death notification" })
        .click();
      await page.getByRole("button", { name: "Deputy death notified" }).click();

      await page.getByText("Deputy's Death Notified");
      await page.getByRole("tab", { name: "Timeline" }).click();
      await expect(page.getByText("Death", { exact: true })).toBeVisible();
      await expect(
        page.getByText("The death of the deputy has been notified"),
      ).toBeVisible();
      await expect(
        page.getByText(`Notified by Deputy on ${today} by Email`),
      ).toBeVisible();
      await expect(
        page.getByText("Order details", { exact: true }).first(),
      ).toBeVisible();
      await expect(
        page.getByText("Status on case changed from Open to Deceased"),
      ).toBeVisible();

      await page.getByRole("button", { name: "Confirm death" }).click();
      await page.getByText("Yes").click();
      await page
        .getByRole("textbox", { name: "Date of death (dd/mm/yyyy)" })
        .fill(today);
      await page
        .getByRole("textbox", { name: "Date proof of death received" })
        .fill(today);
      await page
        .getByRole("button", { name: "Confirm deputy is deceased" })
        .click();
      await page
        .getByRole("button", { name: "The deputy is deceased" })
        .click();
      await expect(
        page.getByText("Deputy is Deceased", { exact: true }),
      ).toBeVisible();

      await page.getByRole("tab", { name: "Timeline" }).click();
      await expect(page.getByText("Death", { exact: true })).toBeVisible();
      await expect(
        page.getByText("The death of the deputy has been confirmed"),
      ).toBeVisible();
      await expect(
        page.getByText(`Date of death ${today}`).first(),
      ).toBeVisible();
      await expect(
        page.getByText(`Certificate received ${today}`),
      ).toBeVisible();
      await expect(
        page.getByText(`Notified by Deputy on ${today} by Email`).first(),
      ).toBeVisible();
    },
  );
});
