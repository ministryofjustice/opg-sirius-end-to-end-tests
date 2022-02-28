require('./commands');
require('./client-commands');
require('./lpa-commands');

require('cypress-grep')();
require('cypress-failed-log');

// Ignore uncaught exceptions due to "process is not defined" error on the Supervision homepage
Cypress.on('uncaught:exception', (err, runnable) => {
  return false;
});
