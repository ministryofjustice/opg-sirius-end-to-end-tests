import { type BrowserContext, expect, type Page } from "@playwright/test";
import * as config from "../playwright.config";

export async function setupHandlerForAuthRedirectInDocker(page: Page) {
  // /oauth/login will redirect to where-ever Sirius is set up to redirect to, which is the mock-oauth-provider on
  // localhost:8080 for local dev. This rewrites the redirect to work in dockers internal network so Sirius can be used
  // for local development without needing reconfiguring and restarting for the end-to-end tests to run
  await page.route("**/oauth/login", async (route) => {
    const response = await route.fetch({ maxRedirects: 0 });
    expect(response.status()).toBe(302);

    const locationHeader = response.headers()["location"];
    // TODO Add/find option for debug messages
    // console.debug("Received redirect to: ", locationHeader);
    const newLocation = locationHeader.replace(
      "http://localhost:8080",
      config.default.use.baseURL,
    );
    // TODO Add/find option for debug messages
    // console.debug("Rewriting redirect to: ", newLocation);

    await route.fulfill({
      status: 302,
      headers: {
        ...response.headers(),
        location: newLocation,
      },
      body: await response.body(),
    });
  });
}

export const loginAsCaseManager = async (
  page: Page,
  context: BrowserContext,
): Promise<void> => {
  await page.goto("/auth/logout");
  await context.clearCookies();

  if (config.default.use.baseURL.includes("frontend-proxy")) {
    await setupHandlerForAuthRedirectInDocker(page);
  }

  const response = await page.goto("/oauth/login");
  expect(response.status()).toBe(200);

  const emailInput = page.locator('input[name="email"]');
  await expect(emailInput).toHaveValue(/@opgtest\.com/);
  await emailInput.fill("case.manager@opgtest.com");
  await page.locator('[type="submit"]').click();
};
