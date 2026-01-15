---
agent: 'agent'
description: 'Generate comprehensive pytest-based unit and integration tests for Python code following repository conventions'
tools: ['edit/createFile', 'edit/editFiles', 'search', 'usages', 'runTasks', 'testFailure', 'problems']
model: 'Claude Sonnet 4.5'
---

# Generate Python Tests Following Best Practices

## Primary Directive

Generate comprehensive, maintainable pytest tests for Python code that achieve 90% coverage, follow modern Python 3.11+ idioms, adhere to repository conventions, and validate both happy paths and explicit error cases. Tests must be executable, isolated, and use appropriate mocking strategies for external dependencies.

## Execution Context

This prompt guides creation of unit and integration tests for the product-research monorepo, which uses pytest with parallel execution (pytest-xdist), coverage tracking (pytest-cov), and a record/replay system for BigQuery integration tests. All tests are functions (no unittest classes), use pytest fixtures for setup, and follow the 90% coverage mandate.

## Core Requirements

- **Coverage target**: 90% code coverage for all production code (measured via pytest-cov)
- **Test organization**: Unit tests in `tests/unit/`, integration tests in `tests/integration/`
- **Naming convention**: `test_<function_name>_<scenario>` (e.g., `test_calculate_area_with_negative_radius_raises_value_error`)
- **Modern Python**: Use Python 3.11+ features (type hints, f-strings, contextlib, pathlib)
- **No unittest classes**: All tests are pytest functions with fixtures
- **Isolation**: Mock external dependencies (BigQuery, GCS, APIs) using `unittest.mock.patch` or `monkeypatch`
- **Markers**: Use `@pytest.mark.integration`, `@pytest.mark.performance`, `@pytest.mark.contract` as appropriate

## Operational Workflow

### Phase 1: Analyze Code Under Test

1. **Identify test surface area**:
   - Public functions and classes requiring coverage
   - Critical paths (main workflows that must work correctly)
   - Explicit error handling (validation, exceptions)
   - External dependencies (BigQuery, GCS, HTTP APIs)

2. **Determine test strategy**:
   - **Unit tests**: Isolated function/method testing with mocked dependencies
   - **Integration tests**: End-to-end workflows with record/replay BigQuery mocking (see `tests/conftest.py`)
   - **Edge cases**: Only test edge cases explicitly handled in code (don't test library behavior)

### Phase 2: Structure Test Files

**File organization**:
```
tests/
├── unit/
│   ├── <module_name>/
│   │   ├── test_<function_group>.py
│   │   └── __init__.py
│   └── conftest.py (shared unit test fixtures)
├── integration/
│   ├── test_<workflow>.py
│   └── fixtures/ (DVC-tracked parquet files)
└── conftest.py (bq_seam_controller fixture)
```

**Test file template**:
```python
"""Unit tests for <module_name>.<function_group>.

Tests cover <brief description of what's being tested>.
"""

import pytest
from unittest.mock import MagicMock, patch

from <module> import <function_or_class>


# Fixtures (if needed)
@pytest.fixture
def sample_data():
    """Provide sample input data for tests."""
    return {"key": "value"}


# Happy path tests
def test_function_name_returns_expected_output():
    """Test function returns correct output for valid input."""
    result = function_name(valid_input)
    assert result == expected_output


# Error handling tests
def test_function_name_raises_value_error_for_invalid_input():
    """Test function raises ValueError when input is invalid."""
    with pytest.raises(ValueError, match="expected error message"):
        function_name(invalid_input)
```

### Phase 3: Write Unit Tests

**Unit test patterns**:

| Pattern | When to Use | Example |
|---------|-------------|---------|
| Direct assertion | Pure functions, simple logic | `assert calculate_area(5) == 78.54` |
| Mock external calls | GCS, BigQuery, HTTP APIs | `@patch('utils.bigquery.run_bq_query')` |
| Pytest fixtures | Shared setup (clients, data) | `@pytest.fixture def mock_bq_client()` |
| Parameterization | Multiple input scenarios | `@pytest.mark.parametrize("radius,expected", [...])` |
| Context managers | Exception testing | `with pytest.raises(ValueError):` |
| Monkeypatch | Environment variables, settings | `monkeypatch.setenv("ENV", "test")` |

**Example unit test with mocking**:
```python
@patch('utils.bigquery.run_bq_query')
def test_fetch_data_calls_bigquery_with_correct_query(mock_bq_query):
    """Test fetch_data constructs and executes correct BigQuery query."""
    mock_bq_query.return_value = pd.DataFrame({"col": [1, 2, 3]})
    
    result = fetch_data(operator_id="123", start_date="2023-01-01")
    
    # Verify BigQuery was called with expected query pattern
    mock_bq_query.assert_called_once()
    call_args = mock_bq_query.call_args[0]
    assert "operator_id = '123'" in call_args[1]
    assert result.shape == (3, 1)
```

### Phase 4: Write Integration Tests

**Integration test structure**:
- Use `bq_seam_controller` fixture (from `tests/conftest.py`) for record/replay BigQuery mocking
- Tests run in replay mode by default (uses DVC-tracked `.parquet` fixtures)
- Record mode (`TEST_BQ_MODE=record`) updates fixtures with live BigQuery data

**Integration test template**:
```python
@pytest.mark.integration
@pytest.mark.parametrize("bq_seam_controller", ["scenario_name"], indirect=True)
def test_end_to_end_workflow(bq_seam_controller):
    """Test complete workflow from request to response."""
    mode, scenario = bq_seam_controller
    
    # Execute workflow (BigQuery calls intercepted by fixture)
    result = run_complete_workflow(operator_id="123")
    
    # Validate output structure and values
    assert "ewt_metrics" in result
    assert result["status"] == "success"
```

### Phase 5: Validate Coverage and Quality

**Run tests locally**:
```bash
poetry run pytest -n auto -m "not performance" --cov=<module> --cov-report=term-missing
```

**Check coverage gaps**:
- Review `--cov-report=term-missing` output for uncovered lines
- Add tests for critical uncovered paths
- Ignore trivial code (e.g., `if __name__ == "__main__"`, property getters)

**Quality checklist**:
- [ ] All tests pass (`pytest` exit code 0)
- [ ] Coverage ≥90% for new/modified code
- [ ] Test names are descriptive (`test_<what>_<when>_<expected>`)
- [ ] External dependencies are mocked (no live API calls in unit tests)
- [ ] Fixtures are used for repeated setup
- [ ] Docstrings explain what is being tested (not how)
- [ ] No `unittest.TestCase` classes (use pytest functions)

## Output Specifications

**Deliverables**:
1. Test files in `tests/unit/<module>/test_<function>.py` or `tests/integration/test_<workflow>.py`
2. Shared fixtures in `tests/conftest.py` or `tests/unit/conftest.py`
3. Coverage report confirming ≥90% coverage
4. All tests passing with `poetry run pytest -n auto`

**File naming**:
- Unit tests: `tests/unit/<module>/test_<function_group>.py`
- Integration tests: `tests/integration/test_<end_to_end_scenario>.py`
- Test fixtures: Descriptive function names (e.g., `@pytest.fixture def mock_gcs_client()`)

**Documentation**:
- Module-level docstring explaining test scope
- Function docstrings for complex test logic
- Inline comments for non-obvious assertions or mocking

## Key Principles

- **Test behavior, not implementation**: Focus on inputs/outputs, not internal details
- **Critical paths first**: Happy path + explicit error cases; edge cases only if explicitly handled
- **Isolation via mocking**: Unit tests never hit real BigQuery, GCS, or external APIs
- **Descriptive over concise**: `test_calculate_ewt_raises_value_error_when_stops_missing` > `test_ewt_error`
- **DVC for integration fixtures**: Large test data in `.parquet` files, versioned with DVC
- **Coverage is not the goal**: 90% is the target, but meaningful assertions matter more than line coverage

## Anti-Patterns to Avoid

- **Testing library behavior**: Don't test pandas, numpy, or third-party library logic
- **Brittle mocks**: Avoid mocking internal implementation details; mock at boundaries (API calls, file I/O)
- **Missing error tests**: Every `raise` statement in production code needs a corresponding test
- **Unmarked integration tests**: Always use `@pytest.mark.integration` for tests using `bq_seam_controller`
- **Hard-coded test data**: Use fixtures or parameterization for reusable test data
- **Skipped tests without reason**: Use `@pytest.mark.skip(reason="...")` only with justification
- **unittest.TestCase classes**: This repo uses pytest functions exclusively

---

**Related Resources**:
- [Python coding conventions](../instructions/python.instructions.md)
- [pytest documentation](https://docs.pytest.org/en/stable/)
- [pytest-cov coverage guide](https://pytest-cov.readthedocs.io/)
- [Repository testing strategy](../copilot-instructions.md)
