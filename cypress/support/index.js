require('./commands');

require('cypress-grep')();

// Ignore uncaught exceptions due to "process is not defined" error on the Supervision homepage
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
