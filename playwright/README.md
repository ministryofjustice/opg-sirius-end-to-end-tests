# TODO

## Establishing foundations and patters

- [X] Project structure
- [X] Project structure documentation [Standards](/docs/PlaywrightStandards.md) (Partially done)
- [X] Prettier for formatting
- [X] ESLint for linting
- [X] Document formatting and linting, how to run in standards
- [X] Dockerisation
  - [X] Run ESLint
  - [X] Run Prettier
  - [X] Run tests
  - [X] Run tests with UI
- [X] CI integration
  - [X] Run ESLint check
  - [X] Run Prettier check
  - [ ] Run tests
  - [ ] CI Reports
  - [ ] Archive screenshots (not currently captured)

## Using Copilot (if you want to)

Until the agent plugin is working, something like.

```sh
Following the instructions in cypress-to-playwright.agent.md convert cypress/e2e/supervision/clients/add-new-client.cy.js
```

## Instructions

To run locally ensure Sirius is started and then run headless:

```sh
make run-playwright
```

To run with the UI:

```sh
make test-ui
```
