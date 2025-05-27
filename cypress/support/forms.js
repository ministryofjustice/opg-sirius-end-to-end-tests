Cypress.Commands.add("waitForLetterEditor", () => {
  cy.window()
    .its("tinyMCE")
    .its("activeEditor")
    .its("initialized", { timeout: 60000 });
  return cy.window().then((win) => {
    let editor = win.tinymce.activeEditor;
    editor.dom.createRng();
    return editor;
  });
});

// allows text areas to be interacted with as either TinyMCE-managed <text-wysiwyg> or <text-area>
Cypress.Commands.add("getEditorByLabel", (labelText) => {
  return cy.contains("label", labelText)
    .invoke("attr", "for")
    .then(id => {
      return cy.get(`#${id}`).then($el => {
        const tagName = $el.prop("tagName").toLowerCase();
        if (tagName === "textarea" && !$el.closest("editor").length) {
          return { isTinyMCE: false, el: $el };
        }

        return cy.window()
          .its("tinyMCE")
          .its("activeEditor")
          .should("have.property", "initialized", true)
          .then(() => {
            return cy.window().then(win => {
              const editor = win.tinymce.activeEditor;
              return { isTinyMCE: true, editor, el: Cypress.$(`#${id}`) };
            });
          });
      });
    });
});

Cypress.Commands.add("enterText", { prevSubject: true }, (ctx, data) => {
  cy.log(ctx)
  if (ctx.isTinyMCE) {
    ctx.editor.execCommand("mceSetContent", false, data);
  } else {
    cy.wrap(ctx.el).clear().type(data);
  }
  return cy.wrap(ctx);
});

Cypress.Commands.add("pasteText", { prevSubject: true }, (ctx, data) => {
  if (ctx.isTinyMCE) {
    ctx.editor.execCommand("mceInsertClipboardContent", false, { content: data });
  } else {
    cy.wrap(ctx.el).invoke("val", data).trigger("input");
  }
  return cy.wrap(ctx);
});

Cypress.Commands.add("getContent", { prevSubject: true }, (ctx) => {
  if (ctx.isTinyMCE) {
    return cy.wrap(ctx.editor.getContent());
  } else {
    return cy.wrap(ctx.el).invoke("val");
  }
});

Cypress.Commands.add("getDatePickerInputByLabel", (label) => {
  return cy.get(`date-field:has(label:contains("${label}"))`).find("input");
});
