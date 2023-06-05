Cypress.Commands.add("waitForTinyMCE", () => {
  cy.window()
    .its("tinyMCE")
    .its("activeEditor")
    .its("initialized", {timeout: 2000});
  return cy.window().then((win) => {
    let editor = win.tinymce.activeEditor;
    editor.dom.createRng();
    return editor;
  });
});

Cypress.Commands.add("enterText",{prevSubject: true}, (editor, data) => {
  editor.execCommand("mceSetContent", false, data);
  return editor;
});

Cypress.Commands.add("pasteText", {prevSubject: true}, (editor, data) => {
  editor.execCommand("mceInsertClipboardContent", false, {
    content: data,
  });
  return editor;
});

Cypress.Commands.add("getContent", {prevSubject: true}, (editor) => {
  return cy.wrap(editor.getContent());
});
