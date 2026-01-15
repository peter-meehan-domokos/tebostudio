---
description: 'Generate a path-specific GitHub Copilot instruction file (.instructions.md)'
tools: ['execute', 'read', 'edit/createFile', 'search', 'web', 'agent', 'todo']
model: 'Claude Sonnet 4.5'
---

# Generate GitHub Copilot Custom Instructions

## Primary Directive

Analyze the codebase or user request to generate a targeted, path-specific GitHub Copilot instruction file (`.github/instructions/[name].instructions.md`). These instructions must use valid YAML frontmatter with glob patterns (`applyTo`) to guide Copilot's behavior for specific file types, directories, or coding patterns, ensuring consistency and adherence to project standards.

## Execution Context

- **Scope**: Creates files in `.github/instructions/` that apply automatically when Copilot works on matching files.
- **Role**: Technical Architect defining coding standards and behavioral rules for AI assistance.
- **Goal**: Eliminate repetitive corrections by codifying standards into active context.

## Core Requirements

1.  **Valid Frontmatter**: Must include `applyTo` with correct glob patterns (e.g., `**/*.ts`, `src/components/**/*.tsx`).
2.  **Conciseness**: Instructions must be high-density and direct (under 2 pages equivalent).
3.  **Non-Redundant**: Do not repeat generic "clean code" advice; focus on repo-specific patterns.
4.  **Agent Control**: Use `excludeAgent` if instructions apply only to specific agents (optional).
5.  **Concrete Examples**: Include "Do this" vs "Don't do this" examples where ambiguous.

## Operational Workflow

### Phase 1: Scope & Pattern Analysis
1.  Identify the target scope (language, framework, or directory).
2.  Analyze existing files in that scope to extract:
    -   Naming conventions (PascalCase vs camelCase).
    -   Architectural patterns (MVVM, Repository pattern).
    -   Testing libraries and patterns.
    -   Preferred libraries (e.g., `zod` over `joi`).
3.  Determine the correct glob pattern for `applyTo`.

### Phase 2: Instruction Drafting
Draft the content with these sections:
-   **Role Definition**: "Act as a [Language] expert..."
-   **Code Style**: Formatting, naming, typing rules.
-   **Architecture**: Folder structure, file organization.
-   **Testing**: Test location, naming, and mocking strategies.
-   **Security/Performance**: Specific constraints (e.g., "No raw SQL").

### Phase 3: File Generation
1.  Construct the filename: `[scope].instructions.md` (e.g., `react.instructions.md`, `python_tests.instructions.md`).
2.  Prepend YAML frontmatter.
3.  Write the file to `.github/instructions/`.

## Output Specifications

-   **File Path**: `.github/instructions/[name].instructions.md`
-   **Format**: Markdown with YAML frontmatter.
-   **Frontmatter Schema**:
    ```yaml
    ---
    applyTo: "[glob_pattern]"
    # Optional: excludeAgent: "code-review" | "coding-agent"
    ---
    ```

## Key Principles

-   **Glob Precision**: Use specific globs (`src/api/**/*.ts`) over generic ones (`**/*.ts`) when possible to reduce noise.
-   **Living Document**: Instructions should evolve; encourage updates when standards change.
-   **Conflict Avoidance**: Ensure new instructions don't contradict the root `.github/copilot-instructions.md`.
-   **Positive Reinforcement**: State what *to* do rather than just what *not* to do.
