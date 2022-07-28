beforeEach(() => {
  cy.loginAs('Case Manager');
  cy.createAClient();
});

describe('Add event to a client', { tags: ['@supervision', 'client', '@smoke-journey','supervision-notes'] }, () => {
  it(
    'Given I\'m a Case Manager on Supervision, when I add an event, then Word formatting is cleaned',
    () => {
      cy.get('@clientId').then(clientId => {
        cy.visit('/supervision/#/clients/' + clientId);
        cy.contains('Ted Tedson');
        cy.get('[id="create-event-button"]').click()
        cy.get('.tox-edit-area__iframe', { timeout: 10000 }).should('be.visible').scrollIntoView()

        cy.window().its('tinyMCE').its('activeEditor').its('initialized',{"timeout":2000})
        cy.window().then((win) => { 
           
            const pastedata = '<p class="MsoNormal" style="margin: 0cm 0cm 11.25pt; font-size: 12pt; font-family: Calibri, sans-serif; text-align: justify; background: white;"><span style="font-size: 10.5pt; font-family: &quot;Open Sans&quot;, sans-serif;">Test</span><span style="font-size: 10.5pt; font-family: &quot;Open Sans&quot;, sans-serif; color: rgb(192, 0, 0);"> this</span><span style="font-size: 10.5pt; font-family: &quot;Open Sans&quot;, sans-serif;"><b> pasted </b>data then.<o:p></o:p></span></p>';
		
            let editor = win.tinymce.activeEditor
      
            editor.dom.createRng();
                    
            editor.execCommand('mceInsertClipboardContent', false, {
                content: pastedata
            });			
            
            let content = editor.getContent();

            expect(content).to.contain('<p>Test this<strong> pasted </strong>data then.</p>')
            expect(content).to.not.contain('Calibri');
            expect(content).to.not.contain('MsoNormal')
            expect(content).to.not.contain('span')
            
            
            
         });
      });
      
    }
  );
});