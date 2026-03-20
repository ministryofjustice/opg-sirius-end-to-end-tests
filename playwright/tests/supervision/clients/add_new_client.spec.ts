import { expect, test } from "@playwright/test";
import { loginAsCaseManager } from "../../../utils/login_as_case_manager";
import { randomText } from "../../../utils/random_text";

test.describe("Add Client page", () => {
  test.beforeEach(async ({ page, context }) => {
    await loginAsCaseManager(page, context);
  });

  test("Search for client that does not exist and create a new one", async ({ page }) => {
    await page.goto("/supervision/#/clients/search-for-client");

    await page.locator('main input[placeholder="Search by Order Number, SIRIUS ID or Name"]').fill("DoNotFindMe");

    const searchButton = page.locator("button.button.client-search__search-button");
    await expect(searchButton).toBeVisible();
    await searchButton.click();

    await expect(page.getByText("No results could be found")).toBeVisible();

    await page.getByText("Create a new client").click();

    const firstName = randomText();
    const surname = randomText();

    await page.locator('input[name="courtReference"]').fill("00000000");
    await page.locator('input[name="firstName"]').fill(firstName);
    await page.locator('input[name="lastName"]').fill(surname);
    await page.locator('input[name="addressLine1"]').fill("1 A Street");
    await page.locator('input[name="town"]').fill("Townsville");
    await page.locator('input[name="postcode"]').fill("PS1 2CD");

    await page.getByText("Save & exit").click();

    const personName = page.locator("span.title-person-name");
    await expect(personName).toBeVisible({ timeout: 30_000 });
    await expect(personName).toContainText(`${firstName} ${surname}`);

    const courtReferenceValue = page.locator(
      "div.client-summary__cell.client-summary__cell--value.court-reference-value-in-client-summary"
    );
    await expect(courtReferenceValue).not.toHaveText("00000000");
  });
});
