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

Cypress.Commands.add("getEditorByLabel", (labelText) => {
  return cy.contains("label", labelText)
    .invoke("attr", "for")
    .then(id => {
      return cy.get(`#${id}`).then($el => {
        const isTinyMCE = $el.next().hasClass("tox-tinymce");

        if (isTinyMCE) {
          return cy.window().then(win => {
            return new Cypress.Promise((resolve, reject) => {
              const start = Date.now();
              const timeout = 60000;

              const checkEditorReady = () => {
                const editor = win.tinymce.get(id);
                if (editor && editor.initialized) {
                  resolve({ isTinyMCE: true, editor, el: $el });
                } else if (Date.now() - start > timeout) {
                  reject(`TinyMCE editor for #${id} did not initialize in time`);
                } else {
                  setTimeout(checkEditorReady, 100);
                }
              };

              checkEditorReady();
            });
          });
        } else {
          return { isTinyMCE: false, el: $el };
        }
      });
    });
});

Cypress.Commands.add("enterText", { prevSubject: true }, (ctx, data) => {
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
