const simulateTyping = false; // Much slower if true

// allows text areas to be interacted with as either Rich Text Editor or <textarea>
Cypress.Commands.add("getEditorByLabel", (labelText) => {
  return cy.contains("label", labelText)
    .invoke("attr", "for")
    .then(id => {
      return cy.get(`#${id}`).then($el => {
        const tagName = $el.prop("tagName").toLowerCase();

        // Check if it's a standard textarea (not managed by an RTE)
        if (tagName === "textarea" && !$el.closest("editor").length) {
          cy.log(`Editor "${labelText}" is a standard textarea.`);
          return cy.wrap({ isRichTextEditor: false, el: $el });
        }

        const iframes = $el.find("iframe")

        if(iframes.length > 0) {
          const iframeId = $el.find("iframe")[0].id;
          const iframeSelector = `#${iframeId}`;
          cy.frameLoaded(iframeSelector);

          return cy.iframe(iframeSelector).then(($iframeSection) => {
            return { isRichTextEditor: true, editor: $iframeSection, el: $el };
          });
        }
      });
    });
});

Cypress.Commands.add("enterText", { prevSubject: true }, (ctx, data) => {
  cy.log(ctx);
  if (ctx.isRichTextEditor) {
    if (simulateTyping) {
      cy.wrap(ctx.editor).clear().type(data);
    } else {
      cy.wrap(ctx.editor).clear().invoke('html', data).trigger('input');
    }
  } else {
    if (simulateTyping) {
      cy.wrap(ctx.el).clear().type(data);
    } else {
      cy.wrap(ctx.el).clear().invoke('val', data).trigger('input');
    }
  }
  return cy.wrap(ctx); // Always return the context to allow chaining.
});

Cypress.Commands.add("pasteText", { prevSubject: true }, (ctx, data) => {
    cy.wrap(ctx.el).should('exist');
    cy.wrap(ctx.editor).type(data, {force: true});
  return cy.wrap(ctx);
});

Cypress.Commands.add("getContent", { prevSubject: true }, (ctx) => {
  if (ctx.isRichTextEditor) {
    return cy.wrap(ctx.editor).invoke("html");
  } else {
    return cy.wrap(ctx.el).invoke("val");
  }
});

Cypress.Commands.add("getDatePickerInputByLabel", (label) => {
  return cy.get(`date-field:has(label:contains("${label}"))`).find("input");
});
