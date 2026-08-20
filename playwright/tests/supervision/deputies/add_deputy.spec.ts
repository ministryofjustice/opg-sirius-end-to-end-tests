import { test, expect } from "@playwright/test";
import { loginAsCaseManager } from "../../../utils/login_as";
import { createClient } from "../../../fixtures/client/create_client";
import {
  CreatedOrder,
  createOrderForClient,
} from "../../../fixtures/order/create_order";
import { randomText } from "../../../utils/random_text";
import {
  createDeputy,
  createDeputyAndAssignToExistingOrder,
} from "../../../fixtures/deputy/create_deputy_and_assign_to_existing_order";

const searchForADeputyToReachAddADeputyPage = async (page) => {
  await page.locator("#add-deputy-button").click();
  await page
    .getByRole("textbox", { name: "Search by SIRIUS ID or Name" })
    .fill("deputy");
  await page.getByRole("button", { name: "Search" }).click();
  await page.getByRole("button", { name: "Add a new deputy" }).click();
};

const checkDeputyIsMainCorrespondentAndFeePayer = async (page) => {
  await expect(page.locator(".fee-payer")).toBeVisible();
  await expect(page.locator(".main-contact")).toBeVisible();
  await expect(page.locator(".order-details-main-correspondent")).toHaveText(
    "Yes",
  );
  await expect(page.locator(".order-details-fee-payer")).toHaveText("Yes");
};

test.describe(
  "Create deputy for client",
  { tag: "@supervision, @deputy, @supervision-core, @smoke-journey" },
  () => {
    let order: CreatedOrder;

    test.beforeEach(async ({ page, context }) => {
      await loginAsCaseManager(page, context);
      const client = await createClient(page);
      order = await createOrderForClient(page, client.id);
      await page.goto(`/supervision/#/clients/${client.id}`);
      await page.getByRole("tab", { name: "Documents" }).click();
    });

    test("Adds a new deputy to a case", async ({ page }) => {
      const firstName = randomText();
      const lastName = randomText();
      const fullName = `${firstName} ${lastName}`;
      await searchForADeputyToReachAddADeputyPage(page);

      await page.getByText("Lay").click();
      await page.getByRole("textbox", { name: "First name" }).fill(firstName);
      await page.getByRole("textbox", { name: "Last name" }).fill(lastName);
      await page
        .getByRole("textbox", { name: "Address Line 1" })
        .fill("1 A Street");
      await page
        .getByRole("textbox", { name: "City / Town" })
        .fill("Townsville");
      await page.getByRole("textbox", { name: "Postcode" }).fill("PS1 2CD");
      await page.getByRole("button", { name: "Save & continue" }).click();
      await page.getByRole("button", { name: "Exit" }).click();
      await page.getByRole("tab", { name: "Deputies" }).click();

      await expect(
        page.locator("div").filter({ hasText: RegExp("^" + fullName + "$") }),
      ).toBeVisible();
      await expect(page.getByRole("cell").nth(1)).toHaveText("Lay");
      await expect(page.getByRole("cell").nth(2)).toHaveText("Open");
      await expect(page.getByRole("cell").nth(3)).toHaveText("");
      await checkDeputyIsMainCorrespondentAndFeePayer(page);

      await page.getByRole("button", { name: "View full details:" }).click();
      await expect(page.locator(".deputy-details-type")).toHaveText("Lay");
      await expect(page.locator(".deputy-details-deputy-name")).toHaveText(
        fullName,
      );
      await expect(
        page.locator(".deputy-details-is-airmail-required"),
      ).toHaveText("No");
      await expect(page.locator(".order-details-deputy-type")).toHaveText(
        "Lay",
      );
      await expect(
        page.locator(".order-details-main-correspondent"),
      ).toHaveText("Yes");
      await expect(
        page.locator(".order-details-deputy-status-on-case"),
      ).toHaveText("Open");
      await expect(
        page.getByRole("button", { name: `Edit: ${firstName} ${lastName}` }),
      ).toBeEnabled();
      await expect(
        page.getByRole("link", { name: `Deputy record: ${firstName}` }),
      ).toBeEnabled();
      await expect(
        page.getByRole("button", { name: "Add deputy" }),
      ).toBeEnabled();
      await expect(
        page.getByRole("button", { name: "Create letter" }),
      ).toBeEnabled();
      await expect(
        page.getByRole("button", { name: "New task" }),
      ).toBeEnabled();
      await expect(
        page.getByRole("button", { name: "Retrieve drafts" }),
      ).toBeDisabled();

      await page.getByRole("tab", { name: "Timeline" }).click();
      await expect(page.getByText("Link", { exact: true })).toBeVisible();
      await expect(
        page.getByText("Set fee payer", { exact: true }),
      ).toBeVisible();
    });
    test("Adds an existing deputy to a case", async ({ page }) => {
      const deputy = await createDeputy(page, {
        deputyType: { handle: "PRO", label: "Professional" },
        deputySubType: { handle: "PERSON", label: "Person" },
      });

      const fullName = `${deputy.firstname} ${deputy.surname}`;

      await page.getByRole("button", { name: "Add deputy" }).click();

      // If the search occurs befor indexing is complete it will return no results, so needs to be retried
      await expect(async () => {
        await page
          .getByRole("textbox", { name: "Search by SIRIUS ID or Name" })
          .fill(fullName);
        await page.getByRole("button", { name: "Search" }).click();
        await expect(
          page.getByRole("button", { name: "Add deputy to case" }),
        ).toBeVisible();
      }).toPass();

      await page.getByRole("button", { name: "Add deputy to case" }).click();

      await page.getByRole("tab", { name: "Deputies" }).click();
      await expect(
        page
          .locator("div")
          .filter({ hasText: RegExp("^Mr " + fullName + "$") }),
      ).toBeVisible();
      await expect(page.getByRole("cell").nth(1)).toHaveText("Professional");
      await expect(page.getByRole("cell").nth(2)).toHaveText("Open");
      await expect(page.getByRole("cell").nth(3)).toHaveText("");

      await page.getByRole("button", { name: "View full details:" }).click();
      await expect(page.locator(".deputy-details-type")).toHaveText(
        "Professional",
      );
      await expect(page.locator(".deputy-details-deputy-name")).toHaveText(
        `Mr ${fullName}`,
      );
      await expect(
        page.locator(".deputy-details-is-airmail-required"),
      ).toHaveText("No");
      await expect(page.locator(".order-details-deputy-type")).toHaveText(
        "Professional",
      );
      await expect(
        page.locator(".order-details-main-correspondent"),
      ).toHaveText("Yes");
      await expect(
        page.locator(".order-details-deputy-status-on-case"),
      ).toHaveText("Open");
      await expect(page.locator(".order-details-fee-payer")).toHaveText("Yes");
      await expect(
        page.getByRole("button", { name: `Edit: Mr ${fullName}` }),
      ).toBeEnabled();
      await expect(
        page.getByRole("link", { name: `Deputy record: Mr ${fullName}` }),
      ).toBeEnabled();

      await expect(
        page.getByRole("button", { name: "Add deputy" }),
      ).toBeEnabled();
      await expect(
        page.getByRole("button", { name: "Create letter" }),
      ).toBeEnabled();
      await expect(
        page.getByRole("button", { name: "New task" }),
      ).toBeEnabled();
      await expect(
        page.getByRole("button", { name: "Retrieve drafts" }),
      ).toBeDisabled();

      await page.getByRole("tab", { name: "Timeline" }).click();
      await expect(page.getByText("Link", { exact: true })).toBeVisible();
      await expect(
        page.getByText("Set fee payer", { exact: true }),
      ).toBeVisible();
    });
    test("is unable to add a deputy already on the case", async ({ page }) => {
      const organisationName = randomText();

      await createDeputy(page, {
        firstname: "",
        surname: "",
        organisationName: organisationName,
        deputyType: { handle: "PA", label: "Public Authority" },
      });

      await page.getByRole("button", { name: "Add deputy" }).click();

      // If the search occurs befor indexing is complete it will return no results, so needs to be retried
      await expect(async () => {
        await page
          .getByRole("textbox", { name: "Search by SIRIUS ID or Name" })
          .fill(organisationName);
        await page.getByRole("button", { name: "Search" }).click();
        await expect(
          page.getByRole("button", { name: "Add deputy to case" }),
        ).toBeVisible();
      }).toPass();

      await page.getByRole("button", { name: "Add deputy to case" }).click();

      await page.getByRole("tab", { name: "Deputies" }).click();
      await expect(
        page
          .locator("div")
          .filter({ hasText: RegExp("^" + organisationName + "$") }),
      ).toBeVisible();
      await expect(page.getByRole("cell").nth(1)).toHaveText(
        "Public Authority",
      );

      await page.getByRole("button", { name: "Add deputy" }).click();
      await page
        .getByRole("textbox", { name: "Search by SIRIUS ID or Name" })
        .fill(organisationName);
      await page.getByRole("button", { name: "Search" }).click();
      await expect(
        page.getByRole("button", { name: "Deputy already on case" }),
      ).toBeDisabled();
    });
    test("Greys out save and continue button when mandatory form fields not filled", async ({
      page,
    }) => {
      await searchForADeputyToReachAddADeputyPage(page);

      await page.getByText("Lay").click();
      await page
        .getByRole("textbox", { name: "First name" })
        .fill(randomText());

      await expect(
        page.getByRole("button", { name: "Save & continue" }),
      ).toBeDisabled();
    });
    test("Allows a new fee payer to be set for an order", async ({ page }) => {
      const deputy = await createDeputyAndAssignToExistingOrder(page, order.id);
      await page.reload();

      await page.getByRole("tab", { name: "Deputies" }).click();
      await expect(
        page.locator("div").filter({
          hasText: RegExp(`^Mr ${deputy.firstname} ${deputy.surname}$`),
        }),
      ).toBeVisible();

      await searchForADeputyToReachAddADeputyPage(page);
      await page.getByText("Professional").click();
      await page.getByRole("textbox", { name: "First name" }).fill("Kermit");
      await page.getByRole("textbox", { name: "Last name" }).fill("Frog");
      await page
        .getByRole("textbox", { name: "Address Line 1" })
        .fill("1 A Street");
      await page
        .getByRole("textbox", { name: "City / Town" })
        .fill("Townsville");
      await page.getByRole("textbox", { name: "Postcode" }).fill("PS1 2CD");
      await page.getByRole("button", { name: "Save & continue" }).click();
      await expect(
        page.getByRole("textbox", { name: "Occupation" }),
      ).toBeVisible();
      await page.getByRole("button", { name: "Save & continue" }).click();
      await page.getByLabel("Relationship to client").selectOption("2");
      await page.getByText("Is the deputy the fee payer?").click();
      // Without this wait the feePayer is not behaving as if it is set and the updates are not saved
      await page.waitForTimeout(1000);

      await page.getByRole("button", { name: "Save & continue" }).click();
      await page.getByRole("button", { name: "Make the fee payer" }).click();

      await expect(
        page
          .getByRole("row")
          .filter({
            has: page
              .locator("div")
              .filter({ hasText: RegExp("^Kermit Frog$") }),
          })
          .getByTitle("Fee-payer icon"),
      ).toBeVisible();
    });
  },
);
