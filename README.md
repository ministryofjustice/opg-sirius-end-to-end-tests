# opg-sirius-end-to-end-tests

End-to-end tests for the components that make up Sirius: Managed by opg-org-infra &amp; Terraform

For standards follow https://docs.cypress.io/guides/references/best-practices unless otherwise agreed

Specifics on migration from our old UI tests [here](/docs/Migration.md)

## Running the tests

### Within This Repo

Commands for running the tests inside the dir of this repo can be found in the Makefile, including:

```shell
# Runs the Cypress tests
make dev
```

### In Sirius

Ensure Sirius is running

Usually something like:

```shell
(cd ../opg-sirius && make dev-up)
```

Then run *all* the tests headlessly with

```shell
docker compose up
```
Run a *single* test headlessly by updating the test name in package.json test-single (line 12)

```shell
docker compose run --rm cypress test-single
```

or through the command line
```shell
make cypress-single SPEC=user-management/navigation.cy.js
```

you can also run whole folders/ subfolders this way, e.g. 
```shell
make cypress-single SPEC=supervision/clients/
```

Or to run in the Cypress app, install locally with `npm i` then open with
```
npm run ui
```

If you want to run it against the dev environment (instead of localhost) run

```
npm run ui:dev
```

If you want to re-run a test multiple times, wrap it in

```
Cypress._.times(10, () => {
    ...
});
```

If you want to run a subset of tests extra options can be passed to run by tag or by text in the test name

E.g.

```shell
docker compose run -e CYPRESS_grep=dashboard -e CYPRESS_grepOmitFiltered=true cypress
```
This will filter on the 'describe' or 'it' definition of the test, not the test filename.
It may look like it's running all tests, but will skip over those that don't match (you will see 0 tests ran)

If you don't include grepOmitFiltered=true then filtered tests appear as pending in reports.

More at https://github.com/cypress-io/cypress-grep
