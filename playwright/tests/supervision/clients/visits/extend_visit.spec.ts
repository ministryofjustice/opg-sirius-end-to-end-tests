import { expect, test } from "@playwright/test";
import { createClient } from "../../../../fixtures/client/create_client";
import { createVisitForClient } from "../../../../fixtures/visit/create_visit";
import { editVisitForClient } from "../../../../fixtures/visit/edit_visit";
import { enterEditorTextByLabel } from "../../../../utils/enter_editor_text_by_label";
import { loginAsCaseManager } from "../../../../utils/login_as";
import { getDateInGbFormat } from "../../../../utils/date";

test.describe("Extend client visit", () => {
  test(
    "can extend a visit's report due date for an existing visit",
    {
      tag: "@supervision-core @visit @smoke-journey @extend-visit-report-due-date",
    },
    async ({ page, context }) => {
      test.setTimeout(120000);
      const reportDueDate = new Date();
      reportDueDate.setDate(reportDueDate.getDate() + 1);
      const tomorrowsDate = getDateInGbFormat(reportDueDate);

      reportDueDate.setDate(reportDueDate.getDate() + 7);
      const nextWeekDate = getDateInGbFormat(reportDueDate);

      await loginAsCaseManager(page, context);
      const client = await createClient(page);
      const visit = await createVisitForClient(page, client.id);

      await editVisitForClient(page, client.id, visit.id, {
        visitReportDueDate: tomorrowsDate,
        whoToVisit: {
          handle: "VPT-CLIENT",
          label: "Client",
        },
      });

      await page.goto(`/supervision/#/clients/${client.id}`);
      await page.getByRole("tab", { name: "Visits" }).click();

      await expect(page.locator(".visit-type-field")).toContainText(
        "Supervision",
      );
      await expect(page.locator(".visit-sub-type-field")).toContainText(
        "Pro Visit",
      );
      await expect(page.locator(".visit-urgency-field")).toContainText(
        "Standard",
      );
      await expect(page.locator(".visit-report-due-date-field")).toContainText(
        tomorrowsDate,
      );
      await expect(page.locator("visit-list-item-view")).toContainText(
        "Who to visit: Client",
      );
      await expect(page.locator("visit-list-item-view")).toContainText(
        "Supervision - Pro Visit - Standard",
      );
      await expect(page.locator("visit-list-item-view")).toContainText(
        `Visit report due by: ${tomorrowsDate}`,
      );

      await page.locator(".extend-visit-report-due-date-button").click();

      const extensionPanel = page.locator("#extend-visit-report-due-date");
      await extensionPanel
        .locator("#fIELDLABELSEXTENDEDVISITREPORTDUEDATE_day")
        .fill(String(reportDueDate.getDate()));
      await extensionPanel
        .locator("#fIELDLABELSEXTENDEDVISITREPORTDUEDATE_month")
        .fill(String(reportDueDate.getMonth() + 1));
      await extensionPanel
        .locator("#fIELDLABELSEXTENDEDVISITREPORTDUEDATE_year")
        .fill(String(reportDueDate.getFullYear()));
      await enterEditorTextByLabel(
        page,
        "Why are you extending the visit report due date?",
        "<p>Because I said so</p>",
      );

      const getVisitsResponse = page.waitForResponse(
        (response) =>
          response.request().method() === "GET" &&
          response
            .url()
            .includes(`/supervision-api/v1/clients/${client.id}/visits`),
      );
      await page.getByRole("button", { name: "Save & exit" }).click();
      const response = await getVisitsResponse;
      expect(response.status()).toBe(200);

      await expect(page.locator(".visit-report-due-date-field")).toContainText(
        nextWeekDate,
      );
      await expect(page.locator("visit-list-item-view")).toContainText(
        `Visit report due by: ${nextWeekDate}`,
      );

      await page.getByRole("tab", { name: "Timeline" }).click();
      await expect(
        page
          .getByText("Visit report due date extended", { exact: true })
          .first(),
      ).toBeVisible({ timeout: 30000 });
      await expect(
        page.locator(".timeline-extended-visit-report-due-date"),
      ).toContainText(nextWeekDate, { timeout: 30000 });
      await expect(
        page.locator(".timeline-reason-for-visit-report-due-date-extension"),
      ).toContainText("Because I said so", { timeout: 30000 });
    },
  );
});
