---
description: 'Systematically identify, measure, and remediate performance bottlenecks using pytest-benchmark and cProfile instrumentation.'
tools: ['execute', 'read/readFile', 'edit', 'search', 'web', 'agent', 'ms-python.python/getPythonEnvironmentInfo', 'ms-python.python/getPythonExecutableCommand', 'ms-python.python/installPythonPackage', 'ms-python.python/configurePythonEnvironment', 'todo']
---

# Profile Python Application Performance

## Primary Directive

Your goal is to conduct empirical performance profiling of Python code, synthesizing quantitative measurements with qualitative analysis to identify pathologically inefficient operations and formulate targeted, high-impact remediation strategies. You will produce both instrumented benchmarks and actionable optimization recommendations grounded in the 80/20 principle: identify the ~20% of code responsible for ~80% of performance degradation.

## Execution Context

This prompt orchestrates a multi-phase performance investigation:
1. **Baseline Instrumentation** - Establish quantitative performance profiles using pytest-benchmark
2. **Hotspot Identification** - Decompose execution time via cProfile to locate computational concentration points
3. **Root Cause Analysis** - Correlate measured performance anomalies with implementation patterns
4. **Remediation Strategy Generation** - Formulate architectural and algorithmic improvements targeting maximum leverage
5. **Validation** - Verify improvements empirically against established baselines

This prompt is designed for autonomous performance optimization workflows. Interpretation must be literal, measurement-driven, and execution systematic without speculative optimization.

## Core Requirements

- Establish reproducible performance baselines using pytest-benchmark for deterministic, statistically meaningful measurement
- Deploy cProfile instrumentation to decompose execution time into constituent operations and identify concentration points
- Generate profiling artifacts (call graphs, flame graphs, statistical summaries) enabling visual hotspot identification
- Formulate optimization recommendations that explicitly quantify estimated improvement potential
- Prioritize interventions by leverage: identify the smallest set of changes yielding maximum performance gain
- Consider architectural patterns beyond local code optimization (data structure redesign, algorithm selection, caching strategies, etc.)
- Structure all recommendations in actionable task format compatible with downstream task generation workflows

## Profiling Workflow

### Phase 1: Baseline Establishment & Measurement Infrastructure

1. **Identify Profiling Targets**
   - Select computational functions or workflows exhibiting measurable latency (>10ms for unit functions; >100ms for integrated workflows)
   - Exclude trivial operations where measurement overhead eclipses signal
   - Focus on code paths exercised frequently or affecting user-facing latency

2. **Construct pytest-benchmark Fixtures**
   - Author benchmark fixtures for target functions using pytest-benchmark syntax
   - Define representative input datasets (realistic in size, distribution, complexity)
   - Establish baseline metrics: mean execution time, standard deviation, throughput
   - Configure benchmark parameters (rounds, iterations, min_rounds) for statistical significance
   - Include multiple scenarios if performance varies materially with input characteristics

3. **Execute & Document Baselines**
   - Run benchmarks to establish canonical performance measurements
   - Capture baseline outputs with metadata: timestamp, code version, environment characteristics
   - Record baseline as immutable reference for quantifying improvement

### Phase 2: Hotspot Instrumentation & Decomposition

1. **Deploy cProfile Instrumentation**
   - Wrap target functions with cProfile context managers or function decorators
   - Configure output to isolate cumulative time vs. per-call time metrics
   - Direct profiling output to `.prof` binary files for persistence and analysis

2. **Generate Statistical Call Graphs**
   - Convert `.prof` binary files to human-readable formats (pstats output, snakeviz HTML visualization)
   - Identify functions consuming disproportionate cumulative time (ranked by CPU time, not call count)
   - Detect pathological patterns: O(n²) algorithms, redundant computations, excessive recursion depth

3. **Visualize Execution Patterns**
   - Generate flame graphs or call tree visualizations revealing execution hotspots
   - Identify "slow leaf nodes" (functions consuming time but making no sub-calls) vs. "busy junctions" (functions spawning expensive child calls)
   - Correlate code location with profiling data to pinpoint exact implementation bottlenecks

### Phase 3: Root Cause Excavation & Pattern Recognition

1. **Analyze Implementation Patterns**
   - Examine hotspot implementations for algorithmic inefficiencies (nested loops, redundant operations, suboptimal data structures)
   - Detect computational redundancy: identical calculations performed multiple times, absence of memoization/caching
   - Evaluate data structure choices: list vs. set lookup complexity, dictionary hash efficiency, dataframe operations
   - Identify external I/O bottlenecks: database queries, API calls, network latency, disk access patterns

2. **Quantify Optimization Leverage**
   - For each hotspot, calculate theoretical improvement potential: current execution time × (1 - achievable_efficiency_ratio)
   - Rank opportunities by leverage: (estimated_speedup) / (implementation_complexity)
   - Focus investigation on high-leverage opportunities (substantial speedup for reasonable effort)

3. **Investigate Architectural Factors**
   - Assess data volume/cardinality: Can input datasets be reduced or pre-aggregated?
   - Evaluate algorithmic selection: Are linear algorithms executed where indexed/hashed approaches suffice?
   - Examine caching/memoization absence: Are identical computations repeated unnecessarily?
   - Consider computational relocation: Can expensive operations be offloaded to compilation-time, initialization-time, or async processing?

### Phase 4: Remediation Strategy Formulation

Generate optimization recommendations following these categories, prioritized by leverage:

**Category A: Data Pipeline Optimization** (highest leverage potential)
- Reduce input cardinality through upstream aggregation/summarization (e.g., pre-grouping, materialized summary tables)
- Implement caching/memoization for redundantly-computed values
- Denormalize data structures to eliminate O(n²) join/merge operations
- Parallelize independent computations via multiprocessing or async I/O

**Category B: Algorithmic Improvement** (moderate-to-high leverage)
- Replace O(n²) algorithms with O(n log n) or O(n) equivalents
- Substitute linear scans with indexed/hashed lookups
- Implement early-exit patterns, short-circuit evaluation
- Consolidate multiple passes into single-pass algorithms

**Category C: Implementation Optimization** (moderate leverage)
- Vectorize operations using NumPy/Pandas operations instead of Python loops
- Eliminate redundant type conversions, validation, or serialization
- Inline hot functions to reduce call overhead
- Profile memory allocation patterns; consider generator expressions over list comprehensions

**Category D: Infrastructure/Deployment Optimization** (architectural leverage)
- Compile hot functions via Cython, Numba, or PyPy for JIT acceleration
- Offload computations to compiled libraries (e.g., BLAS for linear algebra)
- Implement lazy evaluation or streaming for large datasets
- Distribute computation across processes/machines for independent parallelizable operations

For each recommendation, explicitly state:
- **Current implementation**: What code pattern is inefficient?
- **Proposed alternative**: What specific change is recommended?
- **Estimated improvement**: How much faster? Express as percentage speedup or absolute time reduction.
- **Effort assessment**: How much implementation work (hours)?
- **Leverage ratio**: (Estimated speedup) / (Implementation effort) to prioritize
- **Evidence**: Which profiling measurements corroborate this recommendation?

### Phase 5: Validation & Verification

1. **Implement Targeted Optimizations**
   - Execute highest-leverage recommendations
   - Maintain benchmark test coverage to quantify improvement

2. **Re-benchmark After Optimization**
   - Execute benchmarks post-optimization
   - Quantify improvement: (baseline_time - optimized_time) / baseline_time × 100%
   - Validate correctness: ensure optimized code produces identical results

3. **Iterate** (optional)
   - If remaining hotspots exhibit substantial leverage, return to Phase 2
   - Document cumulative improvements and marginal returns of subsequent optimizations

## Output Artifacts

### Profiling Report Structure

All profiling deliverables must include:

1. **Executive Summary** (1 paragraph)
   - Current performance baseline (execution time, throughput)
   - Identified bottleneck locations (functions, line numbers)
   - Estimated improvement potential from recommended optimizations
   - 80/20 assessment: which ~20% of interventions yield ~80% of gain

2. **Baseline Measurements** (table)
   - Function name | Current execution time | Call frequency | Cumulative time consumption
   - Sorted by cumulative time (highest first)

3. **Hotspot Analysis** (per hotspot)
   - **Location**: File path, function name, line numbers
   - **Profile data**: cProfile output (cumulative time, per-call time, call count)
   - **Current implementation excerpt**: Code snippet showing inefficient pattern
   - **Root cause**: Why is this operation slow? Algorithmic complexity? Data structure? External I/O?

4. **Optimization Recommendations** (prioritized list)
   - **Rank 1 - Highest Leverage**: [Recommendation A]
   - **Rank 2**: [Recommendation B]
   - [etc.]

   For each recommendation include:
   - **Category**: [A/B/C/D from categories above]
   - **Current pattern**: [Code/approach being optimized]
   - **Proposed solution**: [Specific alternative]
   - **Estimated speedup**: [X.Xy improvement or Xt absolute time reduction]
   - **Implementation effort**: [Hours to implement]
   - **Leverage**: [Speedup / Effort ratio]
   - **Evidence**: [Which profiling metrics corroborate this]

5. **Alternative Architectural Approaches** (if applicable)
   - Describe substantially different designs (not incremental tweaks)
   - Compare trade-offs: performance vs. complexity vs. maintainability
   - Recommend approach aligning with project constraints and objectives

### File Artifact Specifications

- **Benchmark file**: `tests/benchmarks/test_<target>_benchmark.py` containing pytest-benchmark fixtures
- **Profiling scripts**: `scripts/profile_<target>.py` containing cProfile orchestration
- **Report file**: `reports/performance_analysis_<target>_<date>.md` structured per above
- **Visualizations**:
  - Call graphs: `reports/callgraph_<target>.png` (pstats output converted to image)
  - Flame graphs: `reports/flame_<target>.html` (snakeviz or similar)
  - Before/after comparison: `reports/improvement_<target>.png` (chart comparing baseline vs. post-optimization)

## Profiling Configuration Standards

### pytest-benchmark Configuration

```python
# In conftest.py or benchmark fixture
import pytest
from pytest_benchmark.fixture import BenchmarkFixture

@pytest.fixture
def benchmark_config(benchmark):
    """Configure benchmark for statistical significance."""
    benchmark.extra_info = {}
    return benchmark

# Example benchmark fixture
@pytest.fixture
def sample_benchmark(benchmark_config):
    """Benchmark target function with realistic inputs."""
    data = prepare_realistic_test_data()  # Representative dataset
    def benchmark_target():
        return target_function(data)
    return benchmark_config(benchmark_target)
```

### cProfile Instrumentation Pattern

```python
# In profiling script
import cProfile
import pstats
from pstats import SortKey
from io import StringIO

def profile_target(target_func, *args, **kwargs):
    """Execute function under cProfile instrumentation."""
    profiler = cProfile.Profile()
    profiler.enable()
    result = target_func(*args, **kwargs)
    profiler.disable()

    # Generate human-readable output
    s = StringIO()
    ps = pstats.Stats(profiler, stream=s).sort_stats(SortKey.CUMULATIVE)
    ps.print_stats(20)  # Print top 20 functions
    print(s.getvalue())

    # Persist profile for further analysis
    profiler.dump_stats('profile_output.prof')
    return result
```

### Visualization Generation

```python
# Generate flame graph visualization
from flamegraph import FlameGraph

def generate_flame_graph(prof_file, output_html):
    """Convert cProfile output to interactive flame graph."""
    import snakeviz
    snakeviz.main(['--server', prof_file, '--output', output_html])
```

## Analysis Depth & Iteration

The profiling depth depends on optimization scope:

- **Phase 1-2 (Baseline + Initial Hotspot)**: Required for all profiling tasks (~1-2 hours)
- **Phase 3-4 (Root Cause + Recommendations)**: Required for optimization planning (~2-4 hours)
- **Phase 5 (Validation + Re-benchmark)**: Required after implementing optimizations (~1-2 hours)

**Stopping Criterion**: Conclude profiling when:
- Marginal improvement potential <5% (approaching diminishing returns)
- Implementation leverage ratios <0.1 (substantial effort for minimal gain)
- 80/20 rule achieved: identified top ~20% of interventions yielding ≥80% of potential improvement

## Key Principles for Profiling

- **Measurement-Driven**: Optimize based on quantitative profiling data, never speculation
- **Leverage-Focused**: Identify interventions maximizing impact-per-effort (80/20 targeting)
- **Reproducible**: Benchmarks must be deterministic and statistically significant
- **Comprehensive**: Consider architectural redesign alongside local code optimization
- **Evidence-Based**: All recommendations grounded in profiling measurements and code inspection
- **Actionable**: Recommendations must be specific enough to execute without clarification

## Anti-Patterns to Avoid

- **Premature Optimization**: Profile first; don't optimize hypothetical bottlenecks
- **Narrow Optimization**: Avoid micro-optimizations yielding <1% improvement for substantial complexity
- **Missed Architectural Leverage**: Don't overlook data pipeline optimization (often 10-100x improvements) in favor of algorithmic tweaks (often 1.5-2x)
- **Unrealistic Baselines**: Use representative data volumes and complexity; avoid toy datasets masking real performance characteristics
- **Unvalidated Improvements**: Always re-benchmark post-optimization to confirm improvement and correctness
- **Scope Creep**: Stay focused on identified hotspots; don't optimize uncontentious code

## Integration with Task Generation

Once profiling analysis is complete, the optimization recommendations should be formatted into a `plan.md` file structured for downstream task generation. Each recommendation becomes a distinct feature:

- **F001**: [Highest-leverage optimization]
- **F002**: [Second-highest-leverage optimization]
- [etc.]

This enables conversion to detailed task files (`f001_tasks.md`, etc.) via the task generation prompt, then autonomous implementation via the implementation prompt.
