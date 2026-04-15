# Playwright Standards

## Language

Use TypeScript for all Playwright tests. This ensures type safety and better integration with modern development tools.

## Project Structure

Organize Playwright code under the `playwright/` directory as a self-contained test package:

```text
playwright/
├── package.json
├── playwright.config.ts
├── fixtures/
│   ├── client/
│   │   ├── create_client.ts
│   │   ├── create_client_payload.ts
├── tests/
│   └── example.spec.ts
└── utils/
    ├── random_text.ts
    └── sirius_api.ts
```

- `playwright/package.json`: Playwright-specific scripts and dependencies.
- `playwright/playwright.config.ts`: Central Playwright configuration (projects, reporters, retries, timeouts, and test discovery).
- `playwright/tests/`: Test specs (`*.spec.ts`).
- `playwright/fixtures/`: Shared test data, entity factories, API-backed setup helpers, and fixture setup code used to prepare test state for specific domains.
- `playwright/utils/`: Reusable generic helper functions used by tests and fixtures.

Keep tests feature-focused, and prefer extracting reusable setup/data logic into `fixtures/` and `utils/` to avoid duplication.

### Choosing between `fixtures/` and `utils/`

- Use `playwright/fixtures/` for code that prepares test state for a specific domain, such as:
  - creating entities through the API
  - building default payloads for a specific entity
  - domain-specific setup helpers

- Use `playwright/utils/` for code that is generic and cross-cutting, such as:
  - API transport wrappers
  - random data generators
  - wait/polling helpers
  - generic formatting or date helpers

If a helper is specific to a single entity, colocate it under that entity's fixture directory rather than `utils/`.

## Standards

- Use snake_case for TypeScript files and directories (e.g., `example.spec.ts`, `test_utils.ts`).
- Ensure consistent formatting with Prettier (check with `make check-format` and automatically fix with `make format`).
- Use ESLint for linting (check with `make lint`).

### Locator Guidance

Choose locators in this order of preference:

1. `getByRole` with an accessible name (most resilient and closest to user behavior)
2. `getByLabel` for form controls
3. `getByText` for stable, user-visible copy
4. `getByTestId` when semantic/user-facing selectors are not practical

Avoid brittle selectors tied to implementation details:

- Long CSS chains or class-based selectors (for example `.foo .bar button`)
- Positional selectors like `nth-child`/`first()` used to disambiguate unstable lists
- Selectors based on framework-generated attributes or dynamic classes

Use `data-testid` when an element has no reliable accessible role/name, repeated controls cannot be uniquely targeted by role/text, or visible text is dynamic/translated.

Examples:

```typescript
// Preferred
await page.getByRole("button", { name: "Search" }).click();
await page.getByLabel("Postcode").fill("PS1 2CD");
await page.getByTestId("client-search-result").click();

// Avoid
await page.locator("button.button.client-search__search-button").click();
await page.locator(".search-results__list li").first().click();
```

