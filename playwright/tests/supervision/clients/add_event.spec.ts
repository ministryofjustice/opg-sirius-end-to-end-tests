import { expect, test } from "@playwright/test";
import { createClient } from "../../../fixtures/client/create_client";
import { getEditorContentByLabel } from "../../../utils/get_editor_content_by_label";
import { loginAsCaseManager } from "../../../utils/login_as";
import { pasteEditorTextByLabel } from "../../../utils/paste_editor_text_by_label";

test.describe("Add event to a client", () => {
  test(
    "Given I'm a Case Manager on Supervision, when I add an event, then Word formatting is cleaned",
    { tag: "@supervision @client @smoke-journey @supervision-notes" },
    async ({ page, context }) => {
      await loginAsCaseManager(page, context);
      const client = await createClient(page);

      await page.goto(`/supervision/#/clients/${client.id}`);
      await expect(page.locator(".title-person-name")).toContainText(
        `${client.firstname} ${client.surname}`,
      );

      await page.locator("#create-event-button").click();
      await expect(page).toHaveURL(/\/event\/create/);

      const noteTypeField = page.locator('[label="FIELDLABELS.NOTE_TYPE"]');
      await expect(noteTypeField).toBeVisible();
      await noteTypeField.locator("select").selectOption({ label: "Call" });

      await expect(page.getByText("Direction")).toBeVisible();
      const noteDirectionField = page.locator(
        '[label="FIELDLABELS.NOTE_DIRECTION"]',
      );
      await expect(noteDirectionField).toBeVisible();
      await noteDirectionField.first().click();

      const data = "<p>Test this<strong> pasted </strong>data then.</p>";

      await expect(page.locator(".tox-statusbar")).toBeVisible();
      await pasteEditorTextByLabel(page, "Notes (optional)", data);

      const content = await getEditorContentByLabel(page, "Notes (optional)");
      expect(content).toContain(
        "&lt;p&gt;Test this&lt;strong&gt; pasted &lt;/strong&gt;data then.&lt;/p&gt;",
      );

      const saveButton = page.getByRole("button", { name: "Save" });
      await expect(saveButton).toBeVisible();
      await saveButton.click();

      await page.getByRole("tab", { name: "Timeline" }).click();
      await expect(
        page.locator(".event-note > .section-content > .wrapper"),
      ).toContainText(data);
    },
  );
});
