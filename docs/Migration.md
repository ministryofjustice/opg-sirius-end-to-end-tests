# Migration from Selenium and Protractor

Jira epic https://opgtransform.atlassian.net/browse/SW-5379

## Phases

### 1. Reduce feedback time and remove blockers

Run the end-to-end tests against Sirius for Pull Requests and merges to the main branch. Cutting out a lot of the 30 minutes plus turn around time to see if tests pass

Find solutions for the known issues with some Angular elements being detached from the Dom, or never being found by Cypress

### 2. Replace Updated UI tests

https://github.com/ministryofjustice/opg-sirius/tree/master/front-end/ui-tests-updated

This is the smallest test suite, so should be relatively quick to replace with equivalent Cypress tests

### 3. Replace the remaining UI tests

https://github.com/ministryofjustice/opg-sirius/tree/master/front-end/ui-tests

Remove any tests already covered by these end-to-end tests. **Prioritising flakey and slow tests,** replace the remaining tests with equivalent Cypress tests, breaking down and renaming to follow the agreed approach for this repository

## Migrating tests

### Tagging

Where possible maintain the existing descriptive tags for tests

E.g.

```
@supervision @smoke-journey @thing @SW-123
Scenario: Test the thing
```

becomes

```js
describe('Test the thing', { tags: ['@supervision', '@smoke-journey', '@thing'] }, () => {
```

### Renaming tests

As we're moving away from the cucumber and screenplay patterns, tests can be more concisely named and the code should be written in a style that is clear as to what it is setting up and asserting

```
Scenario: Record client risk score
    Given I select "Client Risk Score" from the actions sidebar
    When I record a client risk score
    Then the "Client Risk Score Success" message is displayed
```

becomes

```js
describe('Record the client risk score', () => {
    it('should record a client risk score', () => {
        ...
    })
}
```

### Splitting tests

Some of the existing tests cover multiple pages and multiple pieces of functionality. Where possible these should be split into smaller tests to make the coverage more obvious and the individual tests easier to maintain

### Make more use of API calls

Where possible use API calls to set up the test rather than driving the UI. This will be substantially quicker
