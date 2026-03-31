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
│   └── example-entity/
│       ├── example_entity_fixture.ts
│       └── minimal.json
├── tests/
│   └── example.spec.ts
└── utils/
    └── example_common_code.ts
```

- `playwright/package.json`: Playwright-specific scripts and dependencies.
- `playwright/playwright.config.ts`: Central Playwright configuration (projects, reporters, retries, timeouts, and test discovery).
- `playwright/tests/`: Test specs (`*.spec.ts`).
- `playwright/fixtures/`: Shared test data and fixture setup helpers.
- `playwright/utils/`: Reusable helper functions used by tests and fixtures.

Keep tests feature-focused, and prefer extracting reusable setup/data logic into `fixtures/` and `utils/` to avoid duplication.

## Standards

- Use snake_case for TypeScript files and directories (e.g., `example.spec.ts`, `test_utils.ts`).
