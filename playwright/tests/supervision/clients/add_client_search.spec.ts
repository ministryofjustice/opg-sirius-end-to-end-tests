import { expect, test } from "@playwright/test";
import { createClient } from "../../../utils/create_client";
import { loginAsCaseManager } from "../../../utils/login_as_case_manager";
import { waitForSearchService } from "../../../utils/wait_for_search_service";

test.describe("Add Client page - existing client", () => {
  test("Search for a client that exists and navigate to them", async ({
    page,
    context,
  }) => {
    await loginAsCaseManager(page, context);
    const client = await createClient(page);

    await waitForSearchService(page, client.caseRecNumber, ["Client"]);

    await page.goto("/supervision/#/clients/search-for-client");

    await page
      .locator(
        'main input[placeholder="Search by Order Number, SIRIUS ID or Name"]',
      )
      .fill(client.caseRecNumber);

    const searchButton = page.locator(
      "button.button.client-search__search-button",
    );
    await expect(searchButton).toBeVisible();
    await searchButton.click();

    await expect(page.locator(".search-results__term")).toBeVisible();

    const searchResults = page.locator(".search-results__list").locator("li");
    await expect(searchResults).toHaveCount(1);
    await searchResults
      .getByRole("link")
      .filter({ hasText: `${client.firstname} ${client.surname}` })
      .first()
      .click();

    const courtReferenceValue = page.locator(
      "div.client-summary__cell.client-summary__cell--value.court-reference-value-in-client-summary",
    );
    await expect(courtReferenceValue).toBeVisible();
    await expect(courtReferenceValue).toContainText(client.caseRecNumber);
  });
});

