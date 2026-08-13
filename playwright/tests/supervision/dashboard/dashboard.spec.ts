import { test, expect } from "@playwright/test";
import { loginAsCaseManager } from "../../../utils/login_as";

test.beforeEach(async ({ page, context }) => {
  await loginAsCaseManager(page, context);
});

test.describe(
  "Viewing the dashboard",
  { tag: "@supervision, @dashboard" },
  () => {
    test("should load the Supervision dashboard correctly", async ({
      page,
    }) => {
      await page.goto("/supervision/#/dashboard");
      await expect(
        page.getByText(
          "Tasks and caseloads can be managed from the Workflow page in Sirius Supervision.",
        ),
      ).toBeVisible();
    });
  },
);

test.describe(
  "The create client button works",
  { tag: "@supervision, @dashboard, @client" },
  () => {
    test("should navigate to the correct page", async ({ page }) => {
      await page.goto("/supervision/#/dashboard");
      await page.locator("text=Create Client").click();
      await expect(page.getByText("Add Client").first()).toBeVisible();
    });
  },
);
