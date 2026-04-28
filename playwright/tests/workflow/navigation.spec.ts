import { expect, type Page, test } from "@playwright/test";
import { loginAsFinanceManager } from "../../utils/login_as";

const expectedHeaderLinks = {
  poaUrl: { current: false, opensInNewTab: false },
  supervisionUrl: { current: false, opensInNewTab: false },
  adminUrl: { current: false, opensInNewTab: false },
  signOutUrl: { current: false, opensInNewTab: false },
};

const expectedNavigationLinks = {
  createClientUrl: { current: false, opensInNewTab: false },
  workflowUrl: { current: true, opensInNewTab: false },
  guidanceUrl: { current: false, opensInNewTab: true },
  financeUrl: { current: false, opensInNewTab: false },
};

const headerLinks = {
  poaUrl: {
    title: "Power of Attorney",
    url: "/lpa",
    position: 1,
  },
  supervisionUrl: {
    title: "Supervision",
    url: "/supervision",
    position: 2,
  },
  adminUrl: {
    title: "Admin",
    url: "/admin",
    position: 3,
  },
  signOutUrl: {
    title: "Sign out",
    url: "/auth/login?loggedout=1",
    position: 4,
  },
};

const navigationLinks = {
  createClientUrl: {
    title: "Create client",
    url: "/supervision/#/clients/search-for-client",
    position: 1,
  },
  workflowUrl: {
    title: "Workflow",
    url: "/supervision/workflow",
    position: 2,
  },
  guidanceUrl: {
    title: "Guidance",
    url: "https://wordpress.sirius.opg.service.justice.gov.uk",
    position: 3,
  },
  financeUrl: {
    title: "Finance",
    url: "/supervision/finance-admin/downloads",
    position: 4,
  },
};

test.describe("Navigation", { tag: "@workflow @smoke-journey" }, () => {
  test.beforeEach(async ({ page, context }) => {
    await loginAsFinanceManager(page, context);
  });

  test("tests header navigation", async ({ page }) => {
    test.slow();

    await assertHeaderWorks(expectedHeaderLinks, expectedNavigationLinks, page);
  });

  test(
    "tests pagination",
    { tag: "@workflow @smoke-journey" },
    async ({ page }) => {
      await page.goto("/supervision/workflow/client-tasks");
      await expect(page).toHaveURL(/\/supervision\/workflow\/client-tasks/);
    },
  );
});

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function checkLink(className, link, page: Page) {
  await returnToWorkflow(page);
  const linkLocator = page.locator(":nth-child(" + link.position + ") > " + className);
  await expect(linkLocator).toBeVisible();
  if (link.current) {
    await expect(linkLocator).toHaveAttribute("aria-current", "page");
  } else {
    await expect(linkLocator).not.toHaveAttribute("aria-current", "page");
  }
  await expect(linkLocator).toHaveText(link.title);

  if (!link.opensInNewTab) {
    console.log(await linkLocator.getAttribute("href"));
    await upgradeConnectionToHTTPS("http://frontend-proxy" + link.url, page);
    await linkLocator.click();
    console.log(await page.content())
    // await expect(page).toHaveURL(new RegExp(escapeRegExp(link.url)));
    await expect(page).toHaveURL(link.url);
  } else {
    await expect(linkLocator).toHaveAttribute("href", link.url);
  }
}

async function assertHeaderWorks(
  expectedHeaderLinks,
  expectedNavigationLinks,
  page: Page,
) {
  for (var [name, link] of Object.entries(expectedNavigationLinks)) {
    link = { ...link, ...navigationLinks[name] };
    await checkLink(".moj-primary-navigation__link", link, page);
  }

  for (var [name, link] of Object.entries(expectedHeaderLinks)) {
    link = { ...link, ...headerLinks[name] };
    await checkLink(".govuk-header__link", link, page);
  }
}

async function downgradeConnectionToHTTP(url: string, page: Page): Promise<void> {
  await page.route(url, async (route) => {
    const response = await route.fetch({
      maxRedirects: 0,
      url: url.replace("https://", "http://"),
    });
    await route.fulfill({
      status: response.status(),
      headers: response.headers(),
      body: await response.body(),
    });
  });
}

async function upgradeConnectionToHTTPS(url: string, page: Page): Promise<void> {
  await page.route(url, async (route) => {
    const response = await route.fetch({
      maxRedirects: 0,
      url: url.replace("http://", "https://"),
    });
    await route.fulfill({
      status: response.status(),
      headers: response.headers(),
      body: await response.body(),
    });
  });
}

async function returnToWorkflow(page: Page): Promise<void> {
  await downgradeConnectionToHTTP("https://frontend-proxy/supervision/workflow/stylesheets/all.css", page);
  await downgradeConnectionToHTTP("https://frontend-proxy/supervision/workflow/javascript/all.js", page);

  await page.goto("/supervision//#/dashboard");
  await page.getByRole("link", { name: "Workflow" }).click();
}
