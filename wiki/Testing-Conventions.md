# Testing Conventions

## What to test?

### Do

- Utility methods
- Complex implementations (eg: algorithms)
- Anything that has edge cases (excl. frontend-interaction)
- Core business logic
- High-risk Services
- Common user interactions
- Error cases that you expect to happen frequently (such as entering an incorrect password when logging in)
- Interactions between units that were stubbed in the unit tests

### Don't

- JavaScript and NodeJS core functions
- Third-party libraries
- External applications
- API calls. Stub them unless you’re doing E2E testing
- Database operations, unless you’re doing E2E testing
- Trivial methods not involving logic (simple getters and setters)
- Code that is throw-away or placeholder code
