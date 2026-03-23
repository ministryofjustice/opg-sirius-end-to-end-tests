import { type BrowserContext, expect, type Page } from "@playwright/test";

export const loginAsCaseManager = async (
  page: Page,
  context: BrowserContext,
): Promise<void> => {
  await page.goto("/auth/logout");
  await context.clearCookies();

  await page.goto("/oauth/login");

  const emailInput = page.locator('input[name="email"]');
  await expect(emailInput).toHaveValue(/@opgtest\.com/);
  await emailInput.fill("case.manager@opgtest.com");
  await page.locator('[type="submit"]').click();
};
