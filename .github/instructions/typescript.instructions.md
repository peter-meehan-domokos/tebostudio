---
description: 'TypeScript coding conventions and guidelines'
applyTo: '**/*.ts, **/*.tsx'
---

# TypeScript Coding Conventions

TypeScript development must prioritize **clarity, type safety, and modern React patterns**. Prioritize **readability and maintainability** over brevity or cleverness. Embrace TypeScript's type system as a tool for correctness, not just documentation.

Ensure that concise, well-typed, and well-documented code is prioritized. Follow modern TypeScript and React practices and idioms. Adhere to the conventions of established libraries (React, Next.js, etc.).

**PROHIBITED PATTERNS**:
- Class components
- `prop-types` (use TypeScript interfaces/types)
- CommonJS (`require`/`module.exports`)
- Untyped modules (create `d.ts` if necessary)
- `any` type (unless strictly necessary and documented)

## General Guidelines

### Type Safety
- **Strict Mode**: Ensure `tsconfig.json` has `"strict": true`, `"noImplicitAny": true`, `"strictNullChecks": true`.
- **No `any`**: Prohibit `any`. Use `unknown` for uncertain types and narrow them via type guards. If `any` is unavoidable, suppress with `// @ts-expect-error` and a justification comment.
- **Inference vs. Explicit**: Use type inference for local variables. Use explicit types for function parameters, return values, and exported members.
- **Literal Types**: Use `as const` assertions for configuration objects and fixed collections to derive literal types.
- **Discriminated Unions**: Use discriminated unions for complex state management (e.g., `status: 'loading' | 'success' | 'error'`).

### Modern JavaScript & React Patterns
- **Functional Components**: Use functional components exclusively.
- **ESNext Features**: Utilize modern syntax: arrow functions, template literals, destructuring, spread operators, optional chaining (`?.`), nullish coalescing (`??`).
- **Component Definition**: Prefer function declarations with explicit return types over `React.FC` to avoid implicit `children` typing unless specifically needed.
  ```typescript
  interface ButtonProps {
    label: string;
    onClick: () => void;
  }
  
  export function Button({ label, onClick }: ButtonProps): JSX.Element {
    return <button onClick={onClick}>{label}</button>;
  }
  ```
- **Hooks**: Use hooks for all state and side effects (`useState`, `useEffect`, `useContext`, `useCallback`, `useMemo`).
- **State Management**: Avoid prop drilling > 2 levels; use React Context or composition.
- **Custom Hooks**: Extract reusable logic (business logic, data fetching) into custom hooks named `use[Feature]`.

### Code Organization
- **Single Responsibility**: One component per file (co-located with small sub-components if strictly private).
- **Import Order**: Enforce order via ESLint:
  1. React / Standard Library
  2. Third-party Libraries
  3. Absolute/Alias Imports (if configured)
  4. Relative Imports (parent `../`, then sibling `./`)
- **Co-location**: Define `interface Props` in the same file as the component.
- **Barrel Exports**: Use `index.ts` for public API of a feature module, but avoid deep barrel re-exports to prevent circular dependencies.

## Code Style and Formatting

### Formatting Rules
- **Line length**: 100 characters.
- **Indentation**: 2 spaces.
- **Tooling**: Rely on **Prettier** for formatting and **ESLint** for code quality. Do not manually format if tooling is available.
- **Semicolons**: Always use semicolons.
- **Quotes**: Single quotes `'` for strings; double quotes `"` for JSX attributes.
- **Trailing Commas**: ES5 trailing commas (objects, arrays, parameters).

### Naming Conventions
- **PascalCase**: Components, Interfaces, Types, Enums (`UserProfile`, `User`).
- **camelCase**: Functions, Variables, Hooks, Methods (`calculateTotal`, `useAuth`).
- **UPPER_SNAKE_CASE**: Constants (global/static config) (`MAX_RETRY_COUNT`).
- **Boolean Prefixes**: `is`, `has`, `should`, `can` (`isLoading`, `hasError`).
- **Event Handlers**: Props: `on[Event]` (e.g., `onClick`); Handlers: `handle[Event]` (e.g., `handleClick`).

## React-Specific Patterns

### Hooks and State Management
- **`useState`**: Use for local UI state. Infer type from initial value where possible.
- **`useEffect`**: Use sparingly for synchronization. **Always** define cleanup functions for subscriptions/timers.
  ```typescript
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
```typescript
// Component Test
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  test('calls onClick handler when clicked', () => {
    // Arrange
    const handleClick = jest.fn();
    render(<Button label="Submit" onClick={handleClick} />);
    
    // Act
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    
    // Assert
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Error Handling & Validation

### Runtime Validation
- **Schema Validation**: Use **Zod** or **io-ts** to validate external data (API responses, URL params) at the boundary.
- **Type Narrowing**: Use user-defined type guards for runtime checks.

### Error Boundaries
- **UI Recovery**: Wrap feature roots in Error Boundaries to prevent white-screen crashes.
- **Fallback UI**: Provide meaningful error messages and retry mechanisms.

## Async Operations

### Data Fetching
- **Async/Await**: Use `async/await` syntax.
- **Try/Catch**: Wrap async calls in `try/catch` for error handling.
- **AbortController**: Implement cancellation for fetch requests in `useEffect`.

```typescript
useEffect(() => {
  const controller = new AbortController();
  
  async function fetchData() {
    try {
      const data = await api.get('/items', { signal: controller.signal });
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

## Documentation

- **JSDoc**: Document exported functions, interfaces, and complex logic.
- **Why, Not What**: Comments should explain the *intent* or *business rule*, not the syntax.

```typescript
/**
 * Normalizes user input to match database format.
 * @param input - Raw user string
 * @returns Normalized string (trimmed, lowercase)
 */
export function normalizeInput(input: string): string {
  return input.trim().toLowerCase();
}
```
