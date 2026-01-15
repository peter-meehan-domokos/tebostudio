---
description: 'Python coding conventions and guidelines'
applyTo: '**/*.py'
---

# Python Coding Conventions

Python should follow the 'zen' of Python: simple, readable, and explicit code is preferred. Think **simplicity** over **complexity**.

Ensure that concise, simple, and well-documented code is prioritized over clever or complex implementations. Follow modern Python practices and idioms. Use Pythonic features and patterns.

Consider using well-known open-source libraries to solve common problems instead of reinventing the wheel.

**DO NOT** use outdated styles or patterns.

## General Guidelines

* Use type hints and return types for all functions and methods.
* Use list comprehensions and generator expressions where appropriate for clarity and performance.
* Use f-strings for string formatting (Python 3.6+).
* Use context managers (`with` statement) for resource management (files, network connections).
* Use dataclasses (using `pydantic` if available) for simple data structures instead of traditional classes.
* Use `pathlib` for file system paths instead of `os.path`.
* Utilise `pytest` features such as fixtures, markers, and parameterization for testing.

## Code Style and Formatting

- Follow the **PEP 8** style guide for Python.
- Maintain proper indentation (use 4 spaces for each level of indentation).
- **Line length: 120 characters** (set by `ruff.toml`; this is longer than PEP 8 but matches the repo standard).
- Place function and class docstrings immediately after the `def` or `class` keyword.
- Use blank lines to separate functions, classes, and code blocks where appropriate.
- Use **modern** Python features (e.g., f-strings for formatting, type hints), practices, and patterns.
- Use **widely adopted libraries** and frameworks where applicable, following their conventions.
- `ruff` is enforced by pre-commit hooks. If formatting fails, run `ruff check --fix` to auto-correct.

### Imports & Formatting
- Import statements are organized and checked by ruff (rule `I`). Group imports: stdlib, third-party, local.
- `ruff` is enforced by pre-commit hooks. If formatting fails, run `ruff check --fix` to auto-correct.
- Many style issues are auto-fixable; re-run the check if hooks fail.

## Testing & Test-Driven Development

### Coverage Expectations
- **Target: 90% code coverage** across all modules. This is the standard for production code in this repository.
- Use `pytest-cov` to measure coverage locally: `pytest --cov=app tests/unit`.
- Integration tests should have meaningful assertions; avoid low-value tests that only stub external calls.
- Use `pytest` conventions for test organization and naming.
- AVOID using `unittest` style. All tests should be functions, not classes.

### Testing Strategy
- **Critical paths first**: Test the main happy path and all explicit error cases. Edge cases that aren't explicitly handled don't need tests.
- **Unit vs. Integration**:
  - Unit tests: Single functions/methods with mocked external dependencies (GCP, Firestore, storage).
  - Integration tests: Marked with `@pytest.mark.integtest`; test real GCP interactions in test environment.
  - Use `conftest.py` fixtures for common setup (clients, test buckets, monkeypatching).
- **Test-Driven Development (TDD)**:
  - Write tests before implementation when defining new features.
  - Start with a failing test that describes the expected behavior.
  - Implement the minimum code to pass the test.
  - Refactor for clarity and reusability.

### Practical Test Patterns
- Mock external dependencies (GCS, Firestore, API calls). Use `unittest.mock.patch` or `monkeypatch`.
- For Flask endpoints: use `app.test_client()` to test routes with realistic multipart forms or JSON payloads.
- Test error cases explicitly: validation errors, exceptions, edge cases in loops.
- Use descriptive test names and docstrings: `test_post_job_validation_error` not `test_job`.
- Avoid testing library behavior; focus on your code's logic.

## Example of Proper Documentation

```python
def calculate_area(radius: float) -> float:
    """
    Calculate the area of a circle given the radius.

    Args:
        radius: The radius of the circle.

    Returns:
        The area of the circle, calculated as π * radius^2.
    """
    import math
    return math.pi * radius ** 2
```

## Error Handling & Validation

- **Validation-first**: Use Pydantic models for input validation. Catch `ValidationError` early and return structured error responses.
- **Explicit over implicit**: Raise specific exceptions with clear messages for business logic errors (e.g., `ValueError`, `FileNotFoundError`).
- **Separate concerns**: Distinguish between validation errors (user input) and runtime errors (system failures).
- **Logging**: Use the configured logger (`from app.utils.logger import LOGGER`) with structured logging (pass `extra={}` dict for context).
- **Error responses**: For Flask endpoints, catch exceptions explicitly and return appropriate HTTP status codes and error details (see `app/routes/jobs.py` for patterns).

## Configuration & Environment

- **Settings via config module**: Use `Settings` dataclass + `get_settings()` to read from environment variables. See `app/config.py`.
- **Env-aware behavior**: Code should behave differently based on `ENV` (dev vs. test vs. prod). Use monkeypatch in tests to override settings.
- **No hardcoding**: All configuration (paths, buckets, API endpoints) comes from `Settings` or environment variables.
- **Test isolation**: Use fixture-based monkeypatching to avoid test pollution (e.g., `monkeypatch.setenv()`).
