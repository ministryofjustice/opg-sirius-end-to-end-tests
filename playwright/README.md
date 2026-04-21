# Playwright tests

These are intended to ultimately replate the Cypress tests, but this is not a quick process, so for the duration of the migration both will need to be maintained.

## Instructions

To run locally ensure Sirius is started and then run headless:

```sh
make run-playwright
```

To run with the UI:

```sh
make test-ui
```

## Using Copilot to migrate an existing test (if you want to)

Until the agent plugin is working, something like.

```sh
Following the instructions in cypress-to-playwright.agent.md convert cypress/e2e/supervision/clients/add-new-client.cy.js
```

## Notes

- Using Firefox as the test runner does have some issues where elements are incorrectly reported as outside the viewport.
  While we can work around this, chromium is closer to what users are working with, so we've elected to use this as the test browser.
- There is a known issue with race conditions on some pages retrieving multiple lookup data.
  Currently there is no good workaround in Playwright, so this needs to be resolved in the Sirius frontend.
