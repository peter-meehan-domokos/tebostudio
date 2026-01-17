---
description: "JavaScript coding conventions and guidelines"
applyTo: "**/*.js, **/*.jsx"
---

# JavaScript Coding Conventions

JavaScript development must prioritize **clarity, modern patterns, and functional programming principles**. Prioritize **readability and maintainability** over brevity or cleverness. Write code that is self-documenting and follows established React and JavaScript best practices.

Ensure that concise, well-documented code is prioritized. Follow modern JavaScript and React practices and idioms. Adhere to the conventions of established libraries (React, Next.js, etc.).

Adopt a functional programming approach favoring pure functions and immutability. Prefer `const` and immutable patterns. Follow the single responsibility principle for functions and components. Prefer D3.js library for array and data manipulation unless there is a better alternative, but avoid imperative loops.

Prompt me to refactor code that violates the above conventions, especially single responsibility and pure functions.

**PROHIBITED PATTERNS**:

- Class components (use functional components)
- CommonJS (`require`/`module.exports`) - use ES6 modules (`import`/`export`)
- `var` keyword (use `const` or `let`)
- Mutation of props or state
- Direct DOM manipulation (except via refs when necessary)

## General Guidelines

### Modern JavaScript Patterns

- **Functional Components**: Use functional components exclusively.
- **ESNext Features**: Utilize modern syntax: arrow functions, template literals, destructuring, spread operators, optional chaining (`?.`), nullish coalescing (`??`).
- **Component Definition**: Use function declarations or arrow functions consistently across the codebase.

  ```javascript
  export function Button({ label, onClick }) {
    return <button onClick={onClick}>{label}</button>;
  }
  ```

- **Hooks**: Use hooks for all state and side effects (`useState`, `useEffect`, `useContext`, `useCallback`, `useMemo`).
- **State Management**: Avoid prop drilling > 2 levels; use React Context or composition.
- **Custom Hooks**: Extract reusable logic (business logic, data fetching) into custom hooks named `use[Feature]`.

### Immutability and Pure Functions

- **Const by Default**: Use `const` for all variables that won't be reassigned. Use `let` only when reassignment is necessary.
- **Immutable Updates**: Never mutate objects or arrays. Use spread operators or methods that return new instances.

  ```javascript
  // ✅ CORRECT
  const newArray = [...oldArray, newItem];
  const newObject = { ...oldObject, updatedKey: newValue };

  // ❌ WRONG
  oldArray.push(newItem);
  oldObject.updatedKey = newValue;
  ```

- **Pure Functions**: Functions should not have side effects and should return the same output for the same input.

### Code Organization

- **Single Responsibility**: One component per file (co-located with small sub-components if strictly private).
- **Import Order**: Enforce consistent order:
  1. React / Standard Library
  2. Third-party Libraries
  3. Absolute/Alias Imports (if configured)
  4. Relative Imports (parent `../`, then sibling `./`)
- **Barrel Exports**: Use `index.js` for public API of a feature module, but avoid deep barrel re-exports to prevent circular dependencies.

## Code Style and Formatting

### Formatting Rules

- **Line length**: 100 characters.
- **Indentation**: 2 spaces.
- **Tooling**: Rely on **Prettier** for formatting and **ESLint** for code quality. Do not manually format if tooling is available.
- **Semicolons**: Always use semicolons.
- **Quotes**: Single quotes `'` for strings; double quotes `"` for JSX attributes.
- **Trailing Commas**: ES5 trailing commas (objects, arrays, parameters).

### Naming Conventions

- **PascalCase**: Components, Classes (`UserProfile`, `UserService`).
- **camelCase**: Functions, Variables, Hooks, Methods (`calculateTotal`, `useAuth`).
- **UPPER_SNAKE_CASE**: Constants (global/static config) (`MAX_RETRY_COUNT`, `API_BASE_URL`).
- **Boolean Prefixes**: `is`, `has`, `should`, `can` (`isLoading`, `hasError`).
- **Event Handlers**: Props: `on[Event]` (e.g., `onClick`); Handlers: `handle[Event]` (e.g., `handleClick`).

## React-Specific Patterns

### Hooks and State Management

- **`useState`**: Use for local UI state. Initialize with appropriate default values.
  ```javascript
  const [count, setCount] = useState(0);
  const [user, setUser] = useState(null);
  ```
- **`useEffect`**: Use sparingly for synchronization. **Always** define cleanup functions for subscriptions/timers.
  ```javascript
  useEffect(() => {
    const subscription = source.subscribe();
    return () => subscription.unsubscribe();
  }, [source]);
  ```
- **`useCallback`**: Memoize event handlers passed to child components to prevent unnecessary re-renders.
- **`useMemo`**: Memoize expensive calculations or referential equality for objects in dependency arrays.
- **`useRef`**: Use for mutable values that don't trigger re-renders or for direct DOM access.

### Conditional Rendering

- **Ternary Operators**: Prefer ternary `condition ? <A /> : <B />` for alternative branches.
- **Logical AND**: Use `condition && <Component />` for optional rendering. **Beware of `0`**: `count && <Component />` renders `0` if count is 0. Use `count > 0 && ...` or `!!count && ...`.
- **Early Returns**: Use early returns in components to reduce nesting.

  ```javascript
  function UserProfile({ user }) {
    if (!user) {
      return <div>Loading...</div>;
    }

    return <div>{user.name}</div>;
  }
  ```

## Testing & Test-Driven Development

### Testing Tools

- **Runner**: Jest or Vitest.
- **Component Testing**: React Testing Library (RTL).
- **Assertions**: `@testing-library/jest-dom`.

### Strategy

- **Arrange-Act-Assert**: Structure tests clearly.
- **User-Centric**: Query by accessibility roles (`getByRole`, `getByLabelText`) rather than implementation details (`querySelector`, `testId`).
- **Coverage**: Target **80-90%** for logic-heavy components and utilities.

### Example Test Patterns

```javascript
// Component Test
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./Button";

describe("Button", () => {
  test("calls onClick handler when clicked", () => {
    // Arrange
    const handleClick = jest.fn();
    render(<Button label="Submit" onClick={handleClick} />);

    // Act
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));

    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Validation and Error Handling

### Runtime Validation

- **Schema Validation**: Use **Zod** or similar libraries to validate external data (API responses, URL params) at the boundary.
- **Input Validation**: Validate user inputs before processing.
  ```javascript
  function processInput(value) {
    if (!value || typeof value !== "string") {
      throw new Error("Invalid input: expected non-empty string");
    }
    return value.trim().toLowerCase();
  }
  ```

### Error Boundaries

- **UI Recovery**: Wrap feature roots in Error Boundaries to prevent white-screen crashes.
- **Fallback UI**: Provide meaningful error messages and retry mechanisms.

## Async Operations

### Data Fetching

- **Async/Await**: Use `async/await` syntax over raw promises.
- **Try/Catch**: Wrap async calls in `try/catch` for error handling.
- **AbortController**: Implement cancellation for fetch requests in `useEffect`.

```javascript
useEffect(() => {
  const controller = new AbortController();

  async function fetchData() {
    try {
      const response = await fetch("/api/items", { signal: controller.signal });
      const data = await response.json();
      setData(data);
    } catch (error) {
      if (!controller.signal.aborted) {
        setError(error);
      }
    }
  }

  fetchData();
  return () => controller.abort();
}, []);
```

### Promise Handling

- Prefer `async/await` over `.then()` chains for readability.
- Always handle errors with `try/catch` or `.catch()`.
- Return promises from functions that perform async operations.

## Documentation

### JSDoc Comments

- **Exported Functions**: Document all exported functions with JSDoc.
- **Complex Logic**: Explain non-obvious business rules or algorithms.
- **Parameters and Returns**: Document function inputs and outputs.

```javascript
/**
 * Normalizes user input to match database format.
 * Trims whitespace and converts to lowercase.
 *
 * @param {string} input - Raw user string
 * @returns {string} Normalized string (trimmed, lowercase)
 */
export function normalizeInput(input) {
  return input.trim().toLowerCase();
}
```

### Inline Comments

- **Why, Not What**: Comments should explain the _intent_ or _business rule_, not the syntax.
- Use comments sparingly; prefer self-documenting code with clear variable and function names.

## Array and Data Manipulation

### Prefer Functional Array Methods

Use functional array methods over imperative loops:

- **`map`**: Transform arrays
- **`filter`**: Select subset of items
- **`reduce`**: Aggregate values
- **`find`/`findIndex`**: Locate items
- **`some`/`every`**: Boolean checks

```javascript
// ✅ CORRECT - Functional approach
const activeUsers = users
  .filter((user) => user.isActive)
  .map((user) => ({ id: user.id, name: user.name }));

// ❌ WRONG - Imperative loop
const activeUsers = [];
for (let i = 0; i < users.length; i++) {
  if (users[i].isActive) {
    activeUsers.push({ id: users[i].id, name: users[i].name });
  }
}
```

### D3.js for Complex Data Operations

- Use D3.js utilities for complex data transformations, grouping, and aggregations.
- Leverage D3 methods: `d3.group()`, `d3.rollup()`, `d3.extent()`, `d3.max()`, etc.

## Performance Considerations

- **Avoid Premature Optimization**: Write clear code first, optimize only when necessary.
- **Memoization**: Use `useMemo` and `useCallback` to prevent unnecessary re-renders.
- **List Keys**: Always provide stable `key` props for list items (prefer unique IDs over array indices).
- **Code Splitting**: Use dynamic imports for large features or routes.
  ```javascript
  const HeavyComponent = React.lazy(() => import("./HeavyComponent"));
  ```

## Common Patterns

### Object and Array Destructuring

```javascript
// Props destructuring
function UserCard({ name, email, avatar }) {
  return (
    <div>
      <img src={avatar} alt={name} />
      <p>{name}</p>
      <p>{email}</p>
    </div>
  );
}

// State destructuring
const [user, setUser] = useState(null);
const { name, email } = user || {};
```

### Optional Chaining and Nullish Coalescing

```javascript
// Safe property access
const userName = user?.profile?.name ?? "Guest";

// Avoid falsy value gotchas
const count = response.count ?? 0; // Use ?? not || to preserve 0
```

### Spread Operators

```javascript
// Merging objects
const mergedConfig = { ...defaultConfig, ...userConfig };

// Copying arrays
const newItems = [...items, newItem];

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((acc, n) => acc + n, 0);
}
```
