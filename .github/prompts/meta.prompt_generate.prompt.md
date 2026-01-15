---
description: 'Generate well-structured, focused GitHub Copilot prompts following Microsoft best practices and repository conventions.'
tools: ['vscode/openSimpleBrowser', 'execute/getTerminalOutput', 'execute/runInTerminal', 'read/readFile', 'read/terminalSelection', 'read/terminalLastCommand', 'edit', 'search', 'web/fetch', 'todo']
---

# Generate a GitHub Copilot Prompt

## Primary Directive

Your goal is to synthesize a focused, executable GitHub Copilot prompt that addresses a specific workflow or task, incorporating Microsoft prompt engineering best practices, repository conventions, and intentional design decisions about tooling, execution mode, and scope. The prompt must be concise (<150 lines), directly applicable across repository contexts, and designed for AI-driven autonomous execution or human-AI collaboration.

## Execution Context

This prompt guides creation of domain-specific prompts that will be stored in `.github/prompts/` and invoked to address specific development challenges (e.g., profiling, testing, documentation, refactoring). Each generated prompt becomes a reusable tool for standardized workflows.

Prompts generated via this meta-prompt must:
- Follow YAML frontmatter structure with metadata
- Adhere to repository naming convention: `[workflow]_[subject].prompt.md`
- Integrate with existing prompt ecosystem (plan → tasks → implementation)
- Be executable without external context or clarification
- Remain under 150 lines to ensure clarity and maintainability
- Add links to relevant external resources where appropriate
- Add links to internal resources (within .github folder) where appropriate

## Pre-Generation Discovery & Analysis

### Step 1: Clarify the Workflow Need

**Ask yourself (or the requester):**
1. What specific challenge or workflow gap exists?
2. Who will use this prompt? (AI agent, human developer, both?)
3. What is the expected outcome or artifact?
4. Does this prompt stand alone or integrate with other prompts?
5. What programming languages/frameworks does it target?

### Step 2: Audit Existing Prompts

**Search the prompt directory for related prompts:**
- Review `.github/prompts/` for similar workflows
- Identify patterns: structure, tools selection, model choice, tone
- Note dependencies: Does this new prompt precede or follow existing prompts?
- Determine if it's a new workflow or enhancement to an existing prompt family

**Identify prompt conventions**
- Visit https://code.visualstudio.com/docs/copilot/reference/copilot-vscode-features to understand best practices recommended by Microsoft for prompt engineering.
- Visit https://code.visualstudio.com/docs/copilot/chat/chat-tools to understand tools available for use in prompts. Tools help enhance the capabilities of prompts by allowing them to perform specific actions, such as editing files, searching code, or running commands.
- Visit https://code.visualstudio.com/docs/copilot/guides/prompt-engineering-guide to understand best practices for crafting prompts.

**Specific questions:**
- Is there a prompt that handles a similar phase (planning, task generation, implementation)?
- Do existing prompts establish conventions I should follow (formatting, terminology, structure)?
- Should this new prompt integrate as a "Step 0" before plan_generate, or as a specialized derivative?

### Step 3: Map Repository Context & Constraints

**Research the repository structure:**
- Examine `.github/copilot-instructions.md` for repo-specific conventions
- Identify language-specific instruction files (e.g., `python.instructions.md`, `sql.instructions.md`)
- Review dependency files (`requirements.txt`, `package.json`, etc.) to understand tooling available
- Scan existing code for patterns the prompt should reinforce or reference

**Synthesize constraints:**
- What languages/frameworks are in-scope?
- What tools are pre-installed or available?
- What linting/formatting standards apply?
- What testing frameworks and patterns are established?

### Step 4: Think Critically About Missing Information

**For the proposed workflow, identify:**

1. **Implicit Assumptions**: What does the requester assume is obvious but may not be documented?
   - Example: "Profiling" implies pytest-benchmark? Or also cProfile? Or memory profilers?

2. **Scope Boundaries**: What should the prompt explicitly exclude?
   - Example: Should a "documentation" prompt cover API docs, inline comments, README updates, or all three?

3. **Success Criteria**: How will a user know they've completed the workflow successfully?
   - Define measurable outputs (artifacts, files, test results, etc.)

4. **Integration Points**: Where does this prompt fit in larger workflows?
   - Does it produce a `plan.md` that feeds into task generation?
   - Does it require specific repository setup or environment variables?
   - Does it depend on external tools (cloud services, databases, APIs)?

5. **Error Scenarios**: What can go wrong, and how should the prompt handle it?
   - Missing dependencies? Insufficient permissions? API rate limits?

6. **Architectural Considerations**: Are there "outside the box" approaches worth mentioning?
   - Alternative algorithms, tools, or design patterns that could substantially change the workflow?

### Step 5: Select Execution Mode & Tools

**Choose mode based on workflow type:**

- **`agent` mode**: For autonomous, multi-step workflows (profiling, planning, analysis). AI orchestrates decisions and file creation.
- **`chat` mode**: For interactive refinement, exploration, or human-guided processes (brainstorming, code review, mentoring).

**Select tools based on workflow requirements:**

| Tool | When to Include | Notes |
|------|-----------------|-------|
| `edit/createFile`, `edit/editFiles` | Creating or modifying code/docs | Nearly all prompts need this |
| `search`, `usages` | Finding existing patterns, references | Necessary for refactoring, analysis |
| `vscodeAPI` | Extension-specific workflows, VS Code features | Only if using VS Code-specific APIs |
| `runTasks`, `runCommands/terminalSelection` | Build, test, lint automation | For test/build orchestration |
| `testFailure` | Debugging test failures | For test-focused prompts |
| `changes`, `problems` | Git/lint integration | For validation, compliance checking |
| `openSimpleBrowser`, `fetch` | Viewing documentation, external resources | For learning-oriented prompts |
| `extensions` | Recommending VS Code extensions | For environment setup prompts |

**Choose model based on complexity:**

- **Claude Haiku 4.5**: Straightforward workflows (under 100 lines), simple transformations, focused tasks
- **Claude Sonnet 4.5**: Complex orchestration (multi-phase, analysis, decision-making, 100-150 lines)
- **Claude Opus** (if available): Highest reasoning capability for nuanced architectural decisions

### Step 6: Prompt Structure Template Selection

**Choose template based on workflow category:**

**Category 1: Transformation Workflows** (code generation, refactoring, formatting)
- Structure: Goal → Requirements → Process → Output Spec → Validation
- Example: `plan_generate.prompt.md`

**Category 2: Analysis Workflows** (profiling, debugging, code review)
- Structure: Goal → Investigation Phases → Analysis Pattern → Recommendation Format → Artifacts
- Example: `profile_python.prompt.md`

**Category 3: Orchestration Workflows** (task generation, deployment, CI/CD)
- Structure: Goal → Input Contract → Processing Steps → Output Format → Success Criteria
- Example: `tasks_generate.prompt.md`

**Category 4: Interactive Workflows** (mentoring, exploration, pair programming)
- Structure: Goal → Dialogue Protocol → Pattern Recognition → Guidance Templates

## Prompt Generation Workflow

### Phase 1: Discovery (Complete Steps 1-6 Above)

### Phase 2: Draft Frontmatter

Create YAML frontmatter with these fields:

```yaml
---
mode: '[agent|chat]'
description: '[1-sentence description of what this prompt enables]'
tools: [list of tools from Step 5]
model: '[Claude Haiku 4.5|Claude Sonnet 4.5|Claude Opus]'
---
```

**Description writing guidance:**
- Start with action verb: "Generate," "Analyze," "Validate," "Optimize"
- Include subject domain (Python, SQL, JavaScript, etc.) if language-specific
- Mention key output or outcome
- Example: "Analyze repository structure and identify refactoring opportunities for maintainability"

### Phase 3: Structure Primary Sections

**All prompts must include (in order):**

1. **Primary Directive** (2-3 sentences)
   - What is the goal? What will be produced?
   - Incorporate Microsoft guidance: Start broad, then get specific

2. **Execution Context** (2-4 bullet points or sentences)
   - Is this standalone or part of a workflow?
   - Multi-phase or single-phase?
   - AI-to-AI or human-facing communication?

3. **Core Requirements** (5-8 bullets)
   - Non-negotiable constraints and success criteria
   - Microsoft guidance: Be specific, avoid ambiguity

4. **Operational Workflow** (3-7 major phases/sections)
   - Main body: How the work unfolds
   - Incorporate examples per Microsoft guidance
   - Break complex tasks into smaller steps
   - Use tables for decision matrices or configuration options

5. **Output Specifications** (Concrete deliverables)
   - File paths, naming conventions, format requirements
   - Success validation criteria
   - How to measure completion

6. **Key Principles** (4-6 bullets)
   - Design philosophy and anti-patterns
   - Integration with broader workflows

### Phase 4: Enforce Conciseness Constraints

**To stay under 150 lines:**

- **Header sections**: 1-2 sentences maximum (no bloat)
- **Lists**: 5-8 items per section (longer lists get consolidated or moved to tables)
- **Code examples**: Use inline code blocks, not extensive multi-file examples
- **Procedural steps**: Use numbered or bulleted lists, not prose paragraphs
- **Redundancy elimination**: Remove duplicative guidance; cross-reference instead

**Structural techniques for conciseness:**
- Use tables instead of prose explanations (saves ~30% space)
- Consolidate related sub-points into single bullets
- Replace examples with links to existing files when possible
- Remove unnecessary context; assume reader has `.github/copilot-instructions.md` context

### Phase 5: Apply Microsoft Best Practices

Explicitly incorporate these patterns:

1. **Start General, Then Specific**: Lead with broad goal; follow with constraints
2. **Provide Examples**: Include concrete examples (code snippets, workflow diagrams, sample inputs/outputs)
3. **Break Complex Tasks into Simpler Ones**: Multi-phase workflows instead of single monolithic task
4. **Avoid Ambiguity**: Use specific terminology; define unusual terms; reference concrete file paths
5. **Indicate Relevant Code**: Reference workspace patterns, existing files, established conventions
6. **Experiment & Iterate**: For interactive prompts, mention iteration capability
7. **Keep History Relevant**: For multi-turn prompts, clarify when to start new conversations vs. continue

### Phase 6: Critical Review & Validation

**Before finalizing, verify:**

- [ ] Prompt is <150 lines (excluding code examples)
- [ ] YAML frontmatter is complete and valid (mode, description, tools, model)
- [ ] Primary Directive answers: What is the goal? What is produced?
- [ ] Core Requirements are specific, not abstract (avoid "high quality," "best practices" without elaboration)
- [ ] Operational phases are concrete and actionable (not theoretical)
- [ ] Output Specifications include file paths, naming conventions, format requirements
- [ ] Language is precise, utilizing full English vocabulary appropriately (not regressing to common words)
- [ ] Examples are provided (per Microsoft guidance) or referenced
- [ ] Integration with repository conventions is explicit (references to instructions files, existing patterns)
- [ ] Tool selection is justified; unused tools are removed
- [ ] Model selection is appropriate to complexity level
- [ ] Key Principles include anti-patterns (not just positive guidance)
- [ ] Prompt does not duplicate or contradict existing prompts in `.github/prompts/`

## Naming Convention for Generated Prompts

Use format: `[domain]_[subject].prompt.md`

**Examples:**
- `profile_python.prompt.md` - Profiling Python code
- `test_javascript.prompt.md` - Testing JavaScript
- `document_api.prompt.md` - Documenting APIs
- `refactor_sql.prompt.md` - Refactoring SQL
- `design_architecture.prompt.md` - Architectural design
- `debug_integration.prompt.md` - Debugging integration tests

Naming must be:
- Lowercase with underscores (no hyphens, spaces, or camelCase)
- Descriptive but concise (2-3 words max)
- Alphabetically sortable with related prompts
- File extension always: `.prompt.md`

## Integration with Prompt Ecosystem

**Prompt dependency relationships:**

```
prompt_generate (this meta-prompt)
  ↓
[new domain-specific prompts created via this guide]
  ↓
plan_generate.prompt.md (for planning workflows)
  ↓
tasks_generate.prompt.md (for task decomposition)
  ↓
tasks_implement.prompt.md (for execution)
```

**Workflow patterns:**
- Analysis/Planning prompts feed into plan_generate → task generation → implementation
- Standalone prompts may be invoked directly (e.g., profile_python for one-time analysis)
- Transformation prompts (refactoring, formatting) may operate independently or within larger workflows

## Key Principles for Prompt Generation

- **Specificity > Generality**: Be precise about scope, tools, outcomes
- **Brevity > Elaboration**: <150 lines forces prioritization of essentials
- **Actionability > Philosophy**: Include concrete procedures, not abstract ideals
- **Integration > Isolation**: Reference existing conventions, tools, and prompt ecosystem
- **Evidence > Speculation**: Ground guidance in Microsoft best practices and repository patterns
- **Conciseness + Richness**: Use precise, illustrative vocabulary; avoid common phrases

## Anti-Patterns to Avoid

- **Over-Engineering**: Prompts solving hypothetical problems, not real workflows
- **Duplicate Scope**: Creating a new prompt when existing prompt could be extended
- **Tool Bloat**: Including tools not actively used in the workflow
- **Vague Instructions**: "Write good code," "best practices" without concrete criteria
- **Insufficient Examples**: Especially for Microsoft guidance compliance
- **Disconnection from Repository**: Ignoring existing conventions, instructions, patterns
- **Exceeding 150 Lines**: Using brevity constraints to force prioritization
- **Ambiguous Frontmatter**: Tools or model choices not justified by workflow needs
