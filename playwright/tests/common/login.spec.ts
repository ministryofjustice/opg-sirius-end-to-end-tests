import { expect, test } from "@playwright/test";
import * as config from "../../playwright.config";
import { setupHandlerForAuthRedirectInDocker } from "../../utils/login_as";

test.describe('Log in page', () => {
  test.beforeEach(async ({ page }) => {
    if (config.default.use.baseURL.includes("frontend-proxy")) {
      await setupHandlerForAuthRedirectInDocker(page);
    }
  });

  test('should display the login page', { tag: '@common @login' }, async ({ page }) => {
    await page.goto('/old-login', { waitUntil: 'networkidle' });

    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="password"]')).toBeVisible();
    await expect(page.locator('input[value="Sign In"]')).toBeVisible();
  });

  test('should fail to validate an empty username and password', { tag: '@common @login' }, async ({ page }) => {
    await page.goto('/old-login', { waitUntil: 'networkidle' });
    const signInButton = page.locator('input[value="Sign In"]');
    await signInButton.click();

    await expect(page.locator('text=Value is required and can\'t be empty')).toBeVisible();
    await expect(page.locator('text=Enter your password')).toBeVisible();
  });

  test('should not log in with an invalid username and password', { tag: '@common @login' }, async ({ page }) => {
    await page.goto('/old-login', { waitUntil: 'networkidle' });

    await page.locator('input[name="email"]').fill('not.a.user@opgtest.com');
    await page.locator('input[name="password"]').fill('not-a-password');

    const signInButton = page.locator('input[value="Sign In"]');
    await signInButton.click();

    await expect(page.locator('text=Login failed')).toBeVisible();
  });

  test('should redirect to the LPA dashboard when an LPA user successfully logs in', { tag: '@common @login' }, async ({ page }) => {
    await page.goto('/oauth/login');

    await page.locator('input[name="email"]').clear();
    await page.locator('input[name="email"]').fill('unit.manager@opgtest.com');
    await page.locator('[type="submit"]').click();

    await expect(page.locator('text=Home')).toBeVisible();
    await expect(page).toHaveURL(/.*\/lpa\/home/);
  });

  test('should redirect to the Supervision dashboard when an Supervision user successfully logs in', { tag: '@common @login' }, async ({ page }) => {
    await page.goto('/oauth/login');

    await page.locator('input[name="email"]').clear();
    await page.locator('input[name="email"]').fill('lay1-1@opgtest.com');
    await page.locator('[type="submit"]').click();

    await expect(page.locator('text=Welcome')).toBeVisible();
    await expect(page).toHaveURL(/.*\/supervision\/#\/dashboard/);
  });
});
