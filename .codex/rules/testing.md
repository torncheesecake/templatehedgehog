# Testing Rules

- Run `npm run check` for normal source changes.
- Run `npm run validate` before release or deployment.
- Add tests for changed business rules, route behaviour, MJML safety, and paid delivery logic.
- Keep tests deterministic and independent of live providers.
- Mock Stripe, Redis, storage, and network calls in tests unless explicitly running an integration environment.
- Add new test files to the explicit `test:unit` command.
