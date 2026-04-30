import { expect, test } from "@playwright/test";
import {
  createClient,
  type CreatedClient,
} from "../../../fixtures/client/create_client";
import { enterEditorTextByLabel } from "../../../utils/enter_editor_text_by_label";
import { loginAsCaseManager } from "../../../utils/login_as";

test.describe("Successfully record client death confirmation", () => {
  const dateOfDeath = "16/03/2023";
  const dateDeathCertificateReceived = "16/03/2023";
  const dateNotified = "16/03/2023";
  const notifiedBy = "Deputy";
  const howNotified = "Email";
  const dateOfDeathIncorrect = "Test date";
  let client: CreatedClient;

  test.beforeEach(async ({ page, context }) => {
    await loginAsCaseManager(page, context);
    client = await createClient(page);
  });

  test(
    "Records a client's death confirmation successfully when populating all fields",
    {
      tag: "@supervision-core @client @client-record-death-confirmation @smoke-journey",
    },
    async ({ page }) => {
      await page.goto(`/supervision/#/clients/${client.id}/record-death`);
      await page.getByRole("tab", { name: "Documents" }).click();

      const recordDeathPanel = page.locator("#record-death");
      await expect(recordDeathPanel).toBeVisible();

      await recordDeathPanel
        .locator(".fieldset", { hasText: "Proof of death received" })
        .getByText("Yes")
        .click();
      await recordDeathPanel
        .locator('input[name="dateOfDeath"]')
        .fill(dateOfDeath);
      await recordDeathPanel
        .locator('input[name="dateDeathCertificateReceived"]')
        .fill(dateDeathCertificateReceived);
      await recordDeathPanel
        .locator('input[name="dateNotified"]')
        .fill(dateNotified);
      await recordDeathPanel.locator('[name="notifiedBy"]').selectOption({
        label: notifiedBy,
      });
      await recordDeathPanel
        .locator(".fieldset", { hasText: "How was the OPG notified?" })
        .getByText(howNotified)
        .click();
      await enterEditorTextByLabel(page, "Notes (optional)", "<p>Gurps</p>");

      await page
        .getByRole("button", { name: "Confirm client is deceased" })
        .click();
      await page
        .getByRole("button", { name: "The client is deceased" })
        .click();

      await expect(page.getByText("Client deceased").first()).toBeVisible();

      await page.locator("#tab-container").getByText("Timeline").click();

      await expect(
        page
          .locator(".timeline-event-title")
          .filter({ hasText: "Death" })
          .first(),
      ).toBeVisible();
      const eventContent = page.locator(
        ".event-death-record > .section-content > .wrapper",
      );
      await expect(eventContent).toContainText(
        "The death of the client has been confirmed",
      );
      await expect(eventContent).toContainText(`Date of death ${dateOfDeath}`);
      await expect(eventContent).toContainText(
        `Certificate received ${dateDeathCertificateReceived}`,
      );
      await expect(eventContent).toContainText(
        `Notified by ${notifiedBy} on ${dateNotified} by ${howNotified}`,
      );
      await expect(page.locator(".client-status-current")).toContainText(
        "Death confirmed",
      );
    },
  );

  test(
    "Displays a validation error when confirming a client's death with an invalid date of death",
    {
      tag: "@supervision-core @client @client-record-death-confirmation @smoke-journey",
    },
    async ({ page }) => {
      await page.goto(`/supervision/#/clients/${client.id}/record-death`);

      const recordDeathPanel = page.locator("#record-death");
      await expect(recordDeathPanel).toBeVisible();

      await recordDeathPanel
        .locator(".fieldset", { hasText: "Proof of death received" })
        .getByText("Yes")
        .click();
      await recordDeathPanel
        .locator('input[name="dateOfDeath"]')
        .fill(dateOfDeathIncorrect);
      await recordDeathPanel
        .locator('input[name="dateDeathCertificateReceived"]')
        .clear();
      await recordDeathPanel
        .locator('input[name="dateDeathCertificateReceived"]')
        .fill(dateDeathCertificateReceived);
      await recordDeathPanel.locator('input[name="dateNotified"]').clear();
      await recordDeathPanel
        .locator('input[name="dateNotified"]')
        .fill(dateNotified);
      await recordDeathPanel.locator('[name="notifiedBy"]').selectOption({
        label: notifiedBy,
      });
      await recordDeathPanel
        .locator(".fieldset", { hasText: "How was the OPG notified?" })
        .getByText(howNotified)
        .click();

      await page
        .getByRole("button", { name: "Confirm client is deceased" })
        .click();
      await page
        .getByRole("button", { name: "The client is deceased" })
        .click();

      await expect(page.locator(".validation-summary")).toContainText(
        "Date of death - This must be a real date",
      );
    },
  );
});
