import { expect, test } from "@playwright/test";
import { createClient } from "../../../fixtures/client/create_client";
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
      .getByPlaceholder("Search by Order Number, SIRIUS ID or Name")
      .getByRole("textbox")
      .fill(client.caseRecNumber);

    const searchButton = page.getByRole("button", { name: "Search" });
    await expect(searchButton).toBeVisible();
    await searchButton.click();

    const clientLink = page.getByRole("link", {
      name: `${client.firstname} ${client.surname}`,
    });
    await expect(clientLink).toHaveCount(1);
    await clientLink.click();

    const courtReferenceValue = page.locator(
      "div.client-summary__cell.client-summary__cell--value.court-reference-value-in-client-summary",
    );
    await expect(courtReferenceValue).toBeVisible();
    await expect(courtReferenceValue).toContainText(client.caseRecNumber);
  });
});
