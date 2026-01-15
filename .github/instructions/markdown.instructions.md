---
description: 'Markdown writing conventions and guidelines'
applyTo: '**/*.md'
---

# Markdown Writing Conventions

## Markdown Instructions

- Write clear and concise explanations for each section.
- Use descriptive headings that accurately reflect the content below them.
- Include links to relevant documentation or files where appropriate.
- Use consistent formatting and structure across all Markdown files.
- Break down complex topics into smaller, manageable subsections.

## General Instructions

- Always prioritize readability and clarity.
- Use consistent heading hierarchy (h1 at top, then h2, h3, etc. in order).
- Write in an active voice where possible; avoid unnecessary verbosity.
- Include examples when explaining concepts or processes.
- Use consistent naming conventions and terminology throughout the document.
- Keep line length reasonable (aim for ~100 characters for readability in editors).
- Be concise but descriptive; explain the "why" behind conventions, not just the "what."

## Heading and Structure

- Use a single top-level heading (one hash mark) at the very top of the document for the main title.
- Use second-level headings (two hash marks) for major sections and third-level headings (three hash marks) for subsections.
- Avoid skipping heading levels; don't jump from h1 to h3, use h2 in between.
- Use title case for headings: capitalize the first letter of each major word.
- Don't end headings with punctuation (no periods, colons, or exclamation marks).

## Formatting and Emphasis

- Use bold (`**text**` syntax) for key terms, important concepts, or values to emphasize.
- Use italic (`*text*` syntax) sparingly, typically for variable names or when introducing new terminology.
- Use inline code (single backticks) for file paths, function names, variable names, or technical terms: `path/to/file`, `function_name()`, `ENV_VARIABLE`.
- Do NOT use inline code for concepts that are already plain English; reserve it for technical references.

## Lists and Code Examples

- Use bulleted lists (`-` or `*`) for unordered items.
- Use numbered lists (`1.`, `2.`, etc.) for ordered steps or processes.
- Ensure list items start with a capital letter and are consistent in style (all sentences or all phrases).
- For code examples, use indented code blocks (4 spaces) or fenced blocks with a language identifier for syntax highlighting.
- When showing command-line examples, use the appropriate shell prompt: `$` for general bash/zsh, `(env-name) $` for activated environments.
- Include explanatory text before code blocks; never place a code block immediately after a heading without context.

## Links and References

- Use descriptive link text that explains what the link leads to, not "click here" or "link."
- Use relative links for files within the repository: reference files using paths relative to the current file.
- Use absolute URLs for external resources (web links).
- Keep links on the same line as the text when possible; avoid inline links that break sentence flow.

## Tables

- Use tables to compare options, show configuration, or organize related information.
- Keep tables simple and readable; avoid overly wide or deeply nested tables.
- Align columns consistently (left-align text, right-align numbers).
- Use table headers to make the purpose clear.

## Code Blocks and Inline Code

- Include a language identifier after the opening fence for syntax highlighting: use `python`, `bash`, `yaml`, `json`, etc.
- For Bash examples targeting a specific shell (zsh, bash), use `bash` for compatibility unless shell-specific syntax is needed.
- If showing multi-line Bash commands, prefer clarity over brevity; use line breaks and comments as needed.
- Avoid including terminal prompts in copyable commands; show them only for demonstration clarity.

## Common Patterns

### File References
When referring to a file or directory, use inline code: `app/config.py`, `tests/unit/`, `requirements.txt`.

### Command Examples
Show commands with context and expected output when helpful:

Set up the environment using the quickstart script:

    source quickstart.sh

The script will create a Conda environment and install dependencies.

### Important Notes and Warnings

Use blockquotes for important information, notes, or warnings:

> **Note**: Always activate the correct Conda environment before running tests.

> **Warning**: Do not commit changes to environment files without testing locally first.

## Documentation Style

- Write documentation that assumes the reader is a developer familiar with the stack, but may be new to this specific codebase.
- Include examples and concrete use cases rather than only theoretical explanations.
- When documenting an API or function, include its purpose, parameters (if applicable), and typical usage.
- Keep documentation close to the code it describes; avoid outdated documentation in separate files.

## File Naming and Organization

- Name markdown files descriptively: `API_DOCUMENTATION.md`, `SETUP_GUIDE.md`, not `doc1.md` or `guide.md`.
- Use uppercase with underscores for file names: `README.md`, `QUICKSTART.md`, `CONTRIBUTING.md`.
- Organize longer documentation into multiple files rather than one monolithic document.
- Include a table of contents in longer documents (especially README files) to aid navigation.

## Example of Proper Markdown Structure

# Getting Started with the Service

## Prerequisites

- Conda (version 3.9 or later)
- Python 3.11+

## Installation

Follow these steps to set up your development environment:

1. Navigate to the service directory:

       cd open-data-ingester

2. Run the quickstart script:

       source quickstart.sh

   This script will activate your Conda environment and install dependencies.

3. Verify the installation by running tests:

       pytest tests/unit

## Configuration

All configuration is managed through environment variables. See `config.py` for available options.

> **Note**: In development, the service uses local storage; in production, it uses Google Cloud Storage.

## Troubleshooting

If you encounter issues during setup, check the following:

- Ensure Conda is installed and updated to the latest version.
- Verify that Node.js is available if the service requires Newman.
- Review the service README for service-specific requirements.
