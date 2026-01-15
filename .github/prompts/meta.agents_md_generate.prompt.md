---
description: "Analyze a repository and generate a comprehensive `AGENTS.md` file containing high-level architecture, developer workflows, project layout, and strict coding standards to optimize AI agent performance."
tools: ["search", "edit"]
---

# Generate AGENTS.md for Repository Context

## Primary Directive

Autonomously analyze the current repository **(or a specified target directory)** to create a definitive `AGENTS.md` file. This document will serve as the **authoritative source of truth** for all AI agents (GitHub Copilot, Gemini, etc.) operating within the codebase. It must synthesize repository structure, technology stack, development workflows, and architectural patterns into a high-density, actionable context file (2-3 pages) that eliminates hallucination and aligns agent output with team standards.

## Execution Context

This is a **comprehensive context-generation workflow**. The generated `AGENTS.md` is not for human onboarding but for **AI context loading**. It prioritizes explicit constraints, verifiable commands, and rigid architectural rules over narrative description. It is designed to be **evergreen**, avoiding brittle details that rot quickly.

## Core Requirements

1.  **Topological Discovery**: Determine if the scope is a monorepo root, a specific project within a monorepo, or a standalone service. Map the relationship between components.
2.  **Evergreen Stack Identification**: Catalog languages, frameworks, and runtimes using **semantic versioning ranges** (e.g., "Python 3.11+" instead of "3.11.13") to ensure longevity.
3.  **Workflow Extraction**: Identify *proven* commands for setup, testing, linting, and building. Verify these against CI configurations to ensure they are current.
4.  **Copilot Optimization**: Explicitly instruct agents on how to use GitHub Copilot keywords (e.g., `@workspace`, `@vscode`) and structural patterns to maximize context retrieval.
5.  **Constraint Definition**: Extract coding standards, naming conventions, and "anti-patterns" from linter configs (`ruff.toml`, `.eslintrc`) and contribution guides.
6.  **Agent Protocol**: Define specific behavioral rules for agents (e.g., "Always prefer composition over inheritance", "Never skip pre-commit hooks").

## Operational Workflow

### Phase 1: Deep Discovery (Inventory)

Systematically search and analyze these sources **relative to the target directory** to build a knowledge graph:

1.  **Governance & Docs**: `AGENTS.md` (if exists), `README.md`, `CONTRIBUTING.md`, `.github/` contents.
2.  **Automation & CI**: `.github/workflows/`, `bitbucket-pipelines.yml`, `Makefile`, `Justfile`, `Rakefile`.
3.  **Configuration**: `pyproject.toml`, `package.json`, `go.mod`, `pom.xml`, `Dockerfile`, `docker-compose.yml`.
4.  **Code Quality**: `.pre-commit-config.yaml`, `ruff.toml`, `.eslintrc`, `tsconfig.json`, `mypy.ini`.
5.  **Scripts**: `scripts/`, `bin/`, `_swift_cicd/` (or similar custom tooling directories).

### Phase 2: Synthesis & Verification

For every extracted fact, verify its validity:
*   **Command Verification**: Does `npm test` actually exist in `package.json`? Does `make build` exist in `Makefile`?
*   **Evergreen Versioning**: Avoid pinning patch versions unless strictly required by `Dockerfile` or `.python-version`. Use "X.Y+" notation.
*   **Conflict Resolution**: If `README.md` says "Run X" but CI runs "Y", **trust the CI configuration** as the source of truth, but note the discrepancy.

### Phase 3: Content Structuring

Organize the `AGENTS.md` into these mandatory sections:

#### 1. Mission & Architecture
*   **Summary**: One sentence on what this specific scope does.
*   **Architecture**: Monorepo/Microservices/Monolith? How do services communicate?
*   **Key Technologies**: Table of Languages, Frameworks, Databases, and Tools with version ranges.

#### 2. Developer Workflow (The "How-To")
*   **Environment Setup**: Exact steps to go from `git clone` to "ready to code".
*   **Dependency Management**: How to add/update libraries (e.g., `poetry add`, `npm install`).
*   **Testing**: The exact command to run the full suite, unit tests, and integration tests.
*   **Linting & Formatting**: Commands to check and fix code style.
*   **Local Execution**: How to run the app/service locally.

#### 3. Project Layout & Key Files
*   **Directory Map**: A tree view or table explaining key top-level directories.
*   **Configuration Hub**: Where do env vars live? Where are feature flags?

#### 4. Coding Standards & Best Practices
*   **Style Rules**: Extracted from linter configs (e.g., "120 char line limit", "Google-style docstrings").
*   **Testing Philosophy**: "Test behavior, not implementation", "Use fixtures over mocks".
*   **Anti-Patterns**: What strictly *not* to do (e.g., "No relative imports outside module").

#### 5. Copilot & Agent Protocol
*   **Context Optimization**: Instructions on using `@workspace` for broad queries and `@file` for specific ones.
*   **Interaction Rules**: "When editing X, always check Y first."
*   **Safety**: "Never commit secrets." "Always run validation before confirming task completion."

### Phase 4: Generation & Refinement

Generate the file content. Ensure:
*   **No Hallucinations**: Do not invent commands. If a "test" command isn't found, state "No test command found".
*   **Trust-First Tone**: The document should command respect. "Follow these instructions strictly."
*   **Markdown Formatting**: Use clear H1/H2/H3 headers, code blocks for commands, and tables for data.

## Output Specifications

*   **File Path**: `AGENTS.md` (at the root of the **target directory**).
*   **Format**: Markdown.
*   **Tone**: Professional, authoritative, technical, concise.
*   **Action**: Overwrite if exists.

## Example `AGENTS.md` Structure (Template)

```markdown
# [Project Name] Context for AI Agents

## 1. System Overview
This repository contains [Description]. It is a [Monorepo/Monolith] built with [Tech Stack].

| Component | Technology | Version |
|-----------|------------|---------|
| Backend   | Python     | 3.11+   |
| API       | FastAPI    | 0.95+   |

## 2. Operational Commands
**Trust these commands over all others.**

*   **Setup**: \`./scripts/setup.sh\`
*   **Test**: \`pytest tests/unit\`
*   **Lint**: \`ruff check .\`

## 3. Project Structure
*   \`src/\`: Application source code
*   \`tests/\`: Pytest suite (mirrors src structure)

## 4. Copilot Usage
*   **Context**: Use \`@workspace\` when searching for shared utilities in \`utils/\`.
*   **Files**: Reference \`config.py\` for environment variables.

## 5. Agent Protocol
*   **Pre-computation**: Before writing code, read \`CONTRIBUTING.md\`.
*   **Validation**: Always run \`make lint\` after generating code.
```

---

**Begin by executing Phase 1 (Inventory). Analyze the workspace, then synthesize the `AGENTS.md` file following the structure above.**