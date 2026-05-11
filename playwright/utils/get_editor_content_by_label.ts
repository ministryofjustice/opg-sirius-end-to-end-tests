import { type Page } from "@playwright/test";

export const getEditorContentByLabel = async (
  page: Page,
  labelText: string,
): Promise<string> => {
  const textboxByRole = page.getByRole("textbox", { name: labelText });
  if ((await textboxByRole.count()) > 0) {
    const textbox = textboxByRole.first();
    const value = await textbox.inputValue().catch(() => "");
    if (value.length > 0) {
      return value;
    }

    return textbox.textContent().then((text) => text ?? "");
  }

  const fieldByLabel = page.getByLabel(labelText);
  if ((await fieldByLabel.count()) > 0) {
    const field = fieldByLabel.first();
    const value = await field.inputValue().catch(() => "");
    if (value.length > 0) {
      return value;
    }

    return field.textContent().then((text) => text ?? "");
  }

  const label = page.locator("label", { hasText: labelText }).first();
  const forId = await label.getAttribute("for");
  if (forId == null) {
    throw new Error(`Could not find form control id for label: ${labelText}`);
  }

  const editorRoot = page.locator(`#${forId}`);
  const iframe = editorRoot.locator("iframe");
  if ((await iframe.count()) > 0) {
    return page.frameLocator(`#${forId} iframe`).locator("body").innerHTML();
  }

  const textArea = editorRoot.locator("textarea").first();
  if ((await textArea.count()) > 0) {
    return textArea.inputValue();
  }

  return editorRoot.locator("[contenteditable='true']").first().innerHTML();
};
