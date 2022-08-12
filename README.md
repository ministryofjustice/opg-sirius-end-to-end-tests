# opg-sirius-end-to-end-tests

End-to-end tests for the components that make up Sirius: Managed by opg-org-infra &amp; Terraform

For standards follow https://docs.cypress.io/guides/references/best-practices unless otherwise agreed

Specifics on migration from our old UI tests [here](/docs/Migration.md)

## Running the tests

Ensure Sirius is running

Usually something like:

```shell
(cd ../opg-sirius && make dev-up)
```

Then run the tests with

```shell
docker-compose up cypress
```

Or to run in the Cypress app, install locally with `npm i` then open with

```
npx cypress open -c baseUrl=http://localhost:8080
```

If you want to run a subset of tests extra options can be passed to run by tag or by text in the test name

E.g.

```shell
docker-compose run cypress --env "grepTags=@my-tag"
```

or

```shell
docker-compose run cypress --env "grep=something"
```

More at https://github.com/cypress-io/cypress-grep
