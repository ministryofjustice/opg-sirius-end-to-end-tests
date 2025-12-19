# opg-sirius-end-to-end-tests

End-to-end tests for the components that make up Sirius: Managed by opg-org-infra &amp; Terraform

For standards follow https://docs.cypress.io/guides/references/best-practices unless otherwise agreed

Specifics on migration from our old UI tests [here](/docs/Migration.md)

## Running the tests
Ensure Sirius is running, usually something like:

```shell
(cd ../opg-sirius && make dev-up)
```

Then run the tests with:

```shell
docker compose up 
```
or 
```shell
(make build - optional) then make dev
```

Or to run in the Cypress app, install locally with `npm i` then open with
```
npx cypress open -c baseUrl=http://localhost:8080
```

If you want to run it against the dev environment (instead of localhost) run
```
npx cypress open -c baseUrl=https://development.sirius.opg.service.justice.gov.uk/
```

If you want to re-run a test multiple times, wrap it in
```
Cypress._.times(10, () => {
    ...
});
```