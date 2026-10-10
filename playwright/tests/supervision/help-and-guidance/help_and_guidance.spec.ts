import { test, expect } from "@playwright/test";
import { loginAsCaseManager } from "../../../utils/login_as";

test.describe("Help and Guidance", () => {
  test("content is accessible when expanded", async ({ page, context }) => {
    await loginAsCaseManager(page, context);
    await page.goto("/supervision/#/dashboard");
    await page.waitForLoadState('networkidle');

    let newTabPromise = context.waitForEvent("page");
    await page.getByRole("link", { name: "Help and guidance" }).click();
    let newTab = await newTabPromise;
    expect(newTab.url()).not.toContain("dashboard");
  });
});
