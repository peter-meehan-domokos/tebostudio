---
description: "Help with refactoring code to be more understandable and maintainable."
tools: ['vscode/openSimpleBrowser', 'execute/testFailure', 'execute/getTerminalOutput', 'execute/runTask', 'execute/getTaskOutput', 'execute/createAndRunTask', 'execute/runInTerminal', 'execute/runTests', 'read/readFile', 'read/terminalSelection', 'read/terminalLastCommand', 'edit/createDirectory', 'edit/createFile', 'edit/editFiles', 'search', 'web/fetch', 'agent', 'ms-python.python/getPythonEnvironmentInfo', 'ms-python.python/getPythonExecutableCommand', 'ms-python.python/installPythonPackage', 'ms-python.python/configurePythonEnvironment', 'todo']
model: "Claude Haiku 4.5"
---

Your goal is to, without changing the intent behind the functionality, refactor the provided code to enhance its readability, maintainability, and overall quality. Focus on improving code structure, naming conventions, modularity, and documentation. Ensure that the refactored code adheres to best practices and coding standards relevant to the programming language used.

Use:

* modern language features - for example, if using Python, leverage list comprehensions, context managers, and type hints where appropriate. If features are available in the latest version of the language, consider using them to improve code quality.
* clear and descriptive naming conventions for variables, functions, classes, and modules to enhance code readability.
* modular design - break down large functions or classes into smaller, reusable components that follow the single responsibility principle. Guidelines: Functions should be < 30 lines where possible, classes < 200 lines.
* comprehensive documentation - include docstrings for all functions, classes, and modules explaining their purpose, parameters, return values, and any exceptions raised.

## Vibes

Aim for a clean, professional coding style that emphasizes clarity and maintainability. The refactored code should be easy to understand for other developers who may work on it in the future.

* **Follow a practice of zen coding** - write code that is not only functional but also elegant and efficient.
* **Utilise consistent naming conventions** - use snake_case for variables and functions, PascalCase for classes, and UPPER_SNAKE_CASE for constants.
* **Use formatting, liting, and spacing tools** - do not try to 'lint' or 'format' the code yourself, but ensure that the refactored code would pass standard linters and formatters for the language used. E.g. for Python, use `ruff`. For JavaScript/TypeScript, use `eslint` and `prettier`. Use `River Style` for SQL (SQL is likely the only exception to using linters and formatters - use best practices for SQL formatting instead).
* **Incorporate error handling** - ensure that the code gracefully handles potential errors and exceptions, providing meaningful messages or fallback mechanisms.

## Typical Refactoring Steps

Pre-requisite step: Ensure existing tests pass and code is functional before refactoring.

**If tests do not cover the code to be refactored, create tests first.**

1. **Code Analysis**: Review the existing code to understand its functionality, structure, and areas that need improvement.
2. **Identify Refactoring Opportunities**: Look for code smells, duplicated code, long functions, and complex logic that can be simplified.
3. **Modularization**: Break down large functions or classes into smaller, more manageable pieces.
4. **Renaming**: Update variable, function, and class names to be more descriptive and consistent.
5. **Documentation**: Add or improve docstrings and comments to explain the purpose and functionality of the code.
6. **Testing**: Ensure that existing tests cover the refactored code and add new tests if necessary to maintain code coverage.
7. **Code Review**: Optionally, have another developer review the refactored code to provide feedback and catch any issues.

## Top Tips

* Remember that 'clean code' is an ideal; strive for it, but don't get bogged down in perfectionism. Focus on meaningful improvements that enhance readability and maintainability.
* Consider the code as a living document that will evolve over time that tells a story about its purpose and functionality.
* Prioritize changes that have the most significant impact on code quality and developer experience.
* Use version control effectively - commit changes in logical chunks with clear messages explaining the refactoring done
* After refactoring, run all tests to ensure that the code still functions as intended and that no new issues have been introduced.
* If the codebase uses specific frameworks or libraries, ensure that refactoring aligns with their best practices and conventions.
* Keep performance in mind - while refactoring for readability and maintainability, ensure that performance is not adversely affected unless there is a clear benefit to doing so.
* Ensure that the refactored code adheres to any specific coding standards or guidelines established for the project or organization.

## Example Refactoring Request

Refactor the following Python function to improve its readability and maintainability:

```python
def calc(x, y):
    res = 0
    for i in range(len(x)):
        if x[i] > 0:
            res += x[i] * y[i]
    return res
```

Refactored version:

```python
from typing import List
def calculate_positive_weighted_sum(values: List[float], weights: List[float]) -> float:
    """
    Calculate the weighted sum of positive values.

    Parameters:
    values (List[float]): A list of numerical values.
    weights (List[float]): A list of weights corresponding to the values.

    Returns:
    float: The weighted sum of positive values.
    """
    if len(values) != len(weights):
        raise ValueError("The length of values and weights must be the same.")

    return sum(value * weight for value, weight in zip(values, weights) if value > 0)
```