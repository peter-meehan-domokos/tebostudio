---
description: 'Generate semantically-accurate, concise Google-style docstrings for Python functions, classes, and modules with correct type hint integration.'
tools: ['edit/editFiles', 'read', 'search', 'todos']
---

# Generate Python Docstrings

## Primary Directive

Your goal is to produce high-quality Google-style docstrings for Python code that accurately reflect the semantic meaning and purpose of functions, classes, and modules. Docstrings must be concise (<100 words), scale in complexity proportional to code size, and integrate seamlessly with existing type hints without duplication.

## Execution Context

This prompt enables autonomous docstring generation or editing for production Python code. Docstrings will be written for functions, classes, and modules that currently lack documentation or have incomplete/outdated documentation. The agent will analyze code semantics, identify the problem being solved, and generate documentation following Google-style conventions and repository standards defined in `.github/instructions/python.instructions.md`.

This is a standalone workflow: analyze code → understand semantic meaning → write docstring → integrate into codebase.

**CRITICALLY IMPORTANT NOTE**: Where docstrings already exist, assess their accuracy and completeness. Accurate information is valuable and *SHOULD* be retained. Only modify existing docstrings to correct inaccuracies, update syntax, add missing details, or improve clarity and conciseness. **DO NOT** remove correct information - ensure it is preserved within this process.

**Authorship** Sometimes authors are noted in existing docstrings. Preserve these authorship attributions when modifying existing docstrings; adding "Original Author: [Name]" to indicate prior contributions.

## Core Requirements

- **Semantic analysis first**: Read the code implementation, understand the algorithmic or functional purpose, and the problem it solves—not just what operations occur
- **Conciseness constraint**: Docstrings must be <150 words; scale length only as necessary (simple functions get 1-2 sentences; complex functions get 5-7 sentences)
- **Google-style format**: All docstrings follow Google Python style guide structure with Args, Returns, Raises sections (see example below)
- **No type hints in docstrings**: Type information belongs in function signatures only; never duplicate `param_name: Type` in docstring Args
- **Complete documentation**: All parameters, return values, and exceptions must be documented with clear, concise descriptions
- **Proportional complexity**: Document edge cases and nuances only when semantically important; avoid verbose explanations of obvious behavior

## Google-Style Format Reference

### Function Docstring Template

#### Short, Trivial Function

```python
def function_name_trivial(param1: str, param2: int) -> bool:
    """
    One line functional summary of WHAT it does.

    Args:
        param1: Description of param1 and its role in the computation.
        param2: Description of param2 and its role in the computation.

    Returns:
        Description of what is returned and what it represents semantically.

    Raises:
        ValueError: When param1 contains invalid characters.
        KeyError: When param2 key not found in internal lookup table.
    """
```

#### Moderate to Complex Function

```python
def function_name_moderate_to_complex(param1: str, param2: int) -> bool:
    """
    One-line semantic summary of WHY the function exists (semantic purpose).

    Optional multi-sentence explanation of WHAT the algorithm does, and HOW: the algorithmic approach, key constraints, or non-obvious behaviors. Scale with the size/complexity of the function.

    Args:
        param1: Description of param1 and its role in the computation.
        param2: Description of param2 and its role in the computation.

    Returns:
        Description of what is returned and what it represents semantically.

    Raises:
        ValueError: When param1 contains invalid characters.
        KeyError: When param2 key not found in internal lookup table.
    """
```

### Class Docstring Template

```python
class ClassName:
    """
    One-line semantic summary of class purpose.

    Optional explanation of the class's role in the broader system,
    key attributes, or initialization behavior.

    Attributes:
        attr1: Description and semantic role.
        attr2: Description and semantic role.
    """
```

### Module Docstring Template

```python
"""
One-line semantic summary of module purpose.

Optional explanation of the module's role, key functions/classes it exports,
or domain-specific concepts it encapsulates.
"""
```

## Semantic Analysis Workflow

### Phase 1: Code Comprehension

1. **Read Implementation Thoroughly**
   - Examine closely: what is the reason for this function existing? What problem does it solve?
   - Examine function/class/module body completely
   - Identify all control flow paths (conditionals, loops, exception handling)
   - Note external dependencies (other functions called, libraries used, data sources)
   - Note external functions that rely on this code and understand the wider business context
   - Understand input transformations and output generation

2. **Identify Semantic Purpose**
   - Ask: "What problem does this code solve?" (not "what steps does it perform?")
   - Examples of semantic purposes:
     - "Calculate Expected Waiting Time by simulating arrival headways" (not "loop over trips and compute times")
     - "Validate request payload against Pydantic schema and return structured errors" (not "call ValidationError handler")
     - "Cache BigQuery query results to avoid redundant API calls" (not "check if key exists and return value")
   - Distinguish between mechanism (how it works) and purpose (why it exists)

3. **Assess Algorithmic Complexity**
   - Is the algorithm straightforward (e.g., filter/map/aggregate)?
   - Does it employ complex techniques (e.g., dynamic programming, correlation analysis, Bayesian inference)?
   - Are there subtle edge cases or non-obvious performance characteristics?

### Phase 2: Documentation Structure

1. **Determine Docstring Length & Depth**
   - **Simple functions** (1-3 lines, single purpose): 1-2 sentence docstring
     - Example: "Filter records by date range and return matching subset."
   - **Moderate functions** (3-7 lines, single purpose with nuance): 2-4 sentence docstring
     - Example: "Aggregate hourly demand by stop using weighted average of observed passenger counts. Handles edge case of zero observations by returning zero demand."
   - **Complex functions** 7+ lines, multiple operations, data transformations): 3-5 sentence docstring
     - Example: "Generate runtime distributions for stop pairs using LAG window functions to correlate with prior trip performance. Applies quantile-based smoothing to dampen outlier effects. Returns a DataFrame indexed by stop_pair and hour for downstream EWT simulation."

2. **Identify Parameters & Return Values**
   - List all function parameters and their semantic role (not just type)
   - Identify what is returned and its structure/meaning
   - Note any mutable side effects (e.g., modifies input, writes to disk, updates global state)

3. **Identify Exception Cases**
   - What explicit exceptions can be raised? (ValueErrors, KeyErrors, TypeErrors, custom exceptions)
   - What conditions trigger them?
   - Document only exceptions explicitly raised in the code, not theoretical ones

### Phase 3: Docstring Generation

1. **Write One-Line Summary**
   - Begin with action verb (Calculate, Generate, Validate, Filter, Aggregate, etc.)
   - State the semantic purpose in one sentence
   - Assume reader has domain context (this is production code, not a tutorial) but remind them of the problem being solved; reflect what part of the problem is being solved by the individual function in relation to the wider problem.
   - Examples:
     - ✅ "Calculate Expected Waiting Time for historic timetable using AWT/SWT aggregation."
     - ❌ "Process data and return a result."

2. **Add Optional Multi-Sentence Explanation** (only if complexity warrants)
   - Explain non-obvious algorithmic choices or constraints
   - Describe edge cases that affect behavior
   - Mention performance characteristics if relevant
   - Examples:
     - "Uses Bayesian smoothing with global and stop-level priors to handle sparse observation counts. Returns 0.0 probability for unobserved stop-hour combinations."
     - "Limits headway observations to <60 minutes to exclude service gaps and overnight breaks."

3. **Document Args Section**
   - List each parameter with its semantic role (what it contributes to the computation)
   - Describe valid value ranges, formats, or constraints if not obvious from type
   - Example:
     - ✅ `configs: Dict containing query configuration (line_id, date range, lateness thresholds)`
     - ❌ `configs: A dictionary` or `configs: Dict[str, Any]` (type hint redundant)

4. **Document Returns Section**
   - Describe what is returned and its semantic meaning
   - For complex return types, describe structure (e.g., "DataFrame indexed by stop_id and hour")
   - Example:
     - ✅ `DataFrame with columns [stop_pair, hour, runtime_quantile] representing runtime distributions for simulation input.`
     - ❌ `Returns a DataFrame.`

5. **Document Raises Section** (only if exceptions explicitly raised)
   - List each exception type and the condition triggering it
   - Examples:
     - `ValueError: When passenger_count contains negative values or exceeds vehicle capacity.`
     - `KeyError: When stop_id not found in timetable configuration.`

### Phase 4: Validation & Integration

1. **Verify Against Requirements**
   - Is semantic purpose clear without reading implementation?
   - Is docstring <100 words?
   - Are there type hints duplicated in Args section? (Remove them)
   - Are all parameters, returns, and exceptions documented?

2. **Check Google-Style Compliance**
   - Correct section headers (Args:, Returns:, Raises:)?
   - Proper indentation and formatting?
   - Consistent verb tense (imperative for summary, present tense for descriptions)?

3. **Integrate Into Code**
   - Place docstring immediately after function/class definition
   - Maintain code style (120-char line length from ruff.toml)
   - No trailing whitespace or formatting inconsistencies

## Documentation Examples

### Example 1: Simple Function

```python
def calculate_headway(departure_time: datetime, previous_departure_time: datetime) -> float:
    """
    Calculate time interval between consecutive vehicle departures in minutes.

    Args:
        departure_time: Current vehicle departure timestamp.
        previous_departure_time: Prior vehicle departure timestamp.

    Returns:
        Headway in minutes as a positive float.
    """
    return (departure_time - previous_departure_time).total_seconds() / 60.0
```

### Example 2: Moderate Complexity

```python
def aggregate_passenger_demand(
    stop_events_df: pd.DataFrame, group_cols: List[str], weight_col: str = "service_days"
) -> pd.DataFrame:
    """
    Aggregate passenger boardings by stop and time period using service-day weighted averaging.

    Applies weighted mean aggregation to smooth demand estimates across dates with varying
    service patterns. Zero-observation periods default to 0.0 demand. Output is sorted by
    grouping columns for deterministic downstream processing.

    Args:
        stop_events_df: DataFrame with columns [operating_date, stop_id, hour, passenger_count, service_days].
        group_cols: Columns defining aggregation groups (typically ['stop_id', 'hour']).
        weight_col: Column name for aggregation weights (default: 'service_days').

    Returns:
        DataFrame with weighted mean passenger_count by group_cols, sorted and indexed for simulation input.

    Raises:
        ValueError: If group_cols or weight_col reference non-existent columns in stop_events_df.
        KeyError: If required columns (passenger_count, operating_date) missing from input DataFrame.
    """
    # Implementation with groupby, weighted mean, fillna(0.0), sort_values
```

### Example 3: Complex Function

```python
def compute_runtime_correlations(
    configs: Dict[str, Any], timetable_type: str, bq_client: bigquery.Client
) -> Dict[Tuple[str, str], Dict[int, List[float]]]:
    """
    Generate correlated runtime distributions for stop pairs to support EWT Monte Carlo simulation.

    Queries BigQuery for historic stop event data, then uses LAG window functions to correlate
    each trip segment's runtime with both prior-trip performance (same stop pair, previous service)
    and upstream segment delays (previous stop pair, same trip). Applies quantile-based Bayesian
    smoothing with global and stop-level priors to handle sparse observations and dampen outlier
    effects. Returns hourly runtime distributions as nested dictionaries for vectorized simulation.

    Args:
        configs: Configuration dictionary containing timepoint_pairs (List[Tuple]), lateness_thresholds
            (Dict[str, float]), and BigQuery dataset identifiers.
        timetable_type: Source timetable selector, either 'evolve' (optimized) or 'historic' (baseline).
        bq_client: Authenticated BigQuery client with read permissions on stop event dataset.

    Returns:
        Nested dictionary mapping {(origin_stop_id, dest_stop_id): {hour: [runtime_samples]}} where
        runtime_samples are float values in seconds, pre-sorted for percentile indexing during simulation.

    Raises:
        ValueError: If timetable_type not in ['evolve', 'historic'].
        KeyError: If configs missing required keys (timepoint_pairs, lateness_thresholds).
        google.cloud.exceptions.NotFound: If BigQuery dataset or table not found.
        google.cloud.exceptions.Forbidden: If bq_client lacks read permissions.
    """
    # Implementation with complex SQL query, LAG windowing, quantile smoothing, dict construction
```

## Key Principles for Docstring Generation

- **Semantic > Mechanical**: Focus on *what problem is solved*, not *what operations execute*
- **Conciseness**: Every word must earn its place; remove redundancy and obvious statements
- **Proportional Complexity**: Match documentation depth to code complexity; avoid over-explanation of trivial logic
- **Type Discipline**: Type hints belong in signatures; never duplicate in docstring Args
- **Complete Coverage**: All parameters, returns, and explicit exceptions documented; no gaps
- **Clarity over Cleverness**: Use simple, domain-appropriate language; avoid jargon unless necessary
- **Consistency**: Match existing docstring style and terminology within the codebase

## Anti-Patterns to Avoid

- **Mechanical Descriptions**: "Loop over rows and calculate values" instead of semantic purpose
- **Type Duplication**: `param: The parameter (str)` instead of `param: Description of what it does`
- **Over-Documentation**: 10-sentence explanation of a simple utility function
- **Vague Generics**: "Process data" or "Return result" without semantic specificity
- **Missing Exceptions**: Documented code that raises exceptions but doesn't list them in Raises
- **Inconsistent Style**: Some docstrings Google-style, others different format
- **Outdated Documentation**: Docstrings describing old implementation logic

## Integration with Repository Standards

All generated docstrings must comply with:
- **Repository Python Instructions**: `.github/instructions/python.instructions.md` (Google-style docstrings, type hints required)
- **Google Python Style Guide**: https://google.github.io/styleguide/pyguide.html#383-functions-and-methods
- **Line Length**: Respect 120-character line limit from `ruff.toml`
- **Type Hints**: Assume all functions have correct type hints in signature; never duplicate in docstring

