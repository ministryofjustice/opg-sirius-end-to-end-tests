import { type Page } from "@playwright/test";

export const enterEditorTextByLabel = async (
  page: Page,
  labelText: string,
  value: string,
): Promise<void> => {
  const labelledTextbox = page.getByRole("textbox", { name: labelText });
  if ((await labelledTextbox.count()) > 0) {
    await labelledTextbox.first().fill(value);
    return;
  }

  const labelAssociatedField = page.getByLabel(labelText);
  if ((await labelAssociatedField.count()) > 0) {
    await labelAssociatedField.first().fill(value);
    return;
  }

  const label = page.locator("label", { hasText: labelText }).first();
  const forId = await label.getAttribute("for");

  if (forId == null) {
    throw new Error(`Could not find form control id for label: ${labelText}`);
  }

  const editorRoot = page.locator(`#${forId}`);

  const rootCanFill = await editorRoot
    .first()
    .evaluate((element) => {
      const tag = element.tagName.toLowerCase();
      return (
        tag === "input" ||
        tag === "textarea" ||
        element.getAttribute("contenteditable") === "true"
      );
    })
    .catch(() => false);
  if (rootCanFill) {
    await editorRoot.first().fill(value);
    return;
  }

  const iframe = editorRoot.locator("iframe");

  if ((await iframe.count()) > 0) {
    await page
      .frameLocator(`#${forId} iframe`)
      .locator("body")
      .evaluate((element, html) => {
        element.innerHTML = html;
        element.dispatchEvent(new Event("input", { bubbles: true }));
      }, value);
    return;
  }

  const textArea = editorRoot.locator("textarea").first();
  if ((await textArea.count()) > 0) {
    await textArea.fill(value);
    return;
  }

  await editorRoot.locator("[contenteditable='true']").first().fill(value);
};
