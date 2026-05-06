import { type Page } from "@playwright/test";

export const pasteEditorTextByLabel = async (
  page: Page,
  labelText: string,
  value: string,
): Promise<void> => {
  const label = page.locator("label", { hasText: labelText }).first();
  const forId = await label.getAttribute("for");

  if (forId == null) {
    throw new Error(`Could not find form control id for label: ${labelText}`);
  }

  const iframe = page.locator(`#${forId} iframe`);
  if ((await iframe.count()) > 0) {
    const body = page.frameLocator(`#${forId} iframe`).locator("body");
    await body.click();
    await body.press("Meta+a");
    await body.press("Backspace");
    await body.pressSequentially(value);
    return;
  }

  const fieldByLabel = page.getByLabel(labelText);
  if ((await fieldByLabel.count()) > 0) {
    await fieldByLabel.first().fill(value);
    return;
  }

  await page.getByRole("textbox", { name: labelText }).first().fill(value);
};
