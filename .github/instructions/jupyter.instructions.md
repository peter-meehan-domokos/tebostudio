---
applyTo: "**/*.ipynb"
---

# Jupyter Notebook Development Instructions

## Notebook Purpose & Structure

### Design Principles
- **Single Responsibility**: Each notebook should have one primary purpose (exploration, analysis, reporting, or prototyping)
- **Reproducibility**: All code cells must run end-to-end without manual intervention
- **Self-Documenting**: Use markdown cells liberally to explain context and methodology
- **Clean State**: Avoid hidden state dependencies; always restart kernel and run all cells before committing
- **No Sensitive Data**: Never hardcode credentials, API keys, or sensitive configuration in notebooks

### Notebook Types & Organization
1. **Exploratory Notebooks**: Used for investigation and data discovery
   - Location: `personal/<username>/` directory
   - Naming: `YYYY_MM_DD_experiment_name.ipynb`
   - Contains iterative analysis, plotting, hypothesis testing

2. **Production Notebooks**: Scheduled via Airflow or used for reporting
   - Location: Project package root or `scripts/`
   - Must have comprehensive error handling and logging
   - Include configuration section at top

3. **Documentation Notebooks**: Educational or methodology documentation
   - Location: Root or `docs/` if exists
   - Include citations and references
   - Provide reproducible examples

## Cell Organization & Formatting

### Cell Types & Ordering
**Standard cell order in a well-structured notebook:**

1. **Title & Purpose** (Markdown)
   - Notebook title, date, author
   - Single-sentence purpose statement

2. **Configuration** (Code)
   - Environment variables, paths, API endpoints
   - User-adjustable parameters at top of notebook
   - Example:
     ```python
     # Configuration
     PROJECT_ID = "cityswifterdatasandbox"
     DATASET_ID = "realtime_evaluation"
     DATE_START = "2024-01-01"
     DATE_END = "2024-01-31"
     ```

3. **Imports** (Code)
   - Organized: stdlib → third-party → local imports
   - Follow import organization rules from python.instructions.md
   - Group related imports with comments
   - Example:
     ```python
     import datetime as dt
     from pathlib import Path

     import pandas as pd
     import numpy as np
     from google.cloud import bigquery

     from realtime_evaluation import sql_utils
     ```

4. **Setup & Authentication** (Code)
   - Initialize BigQuery clients
   - Configure credentials
   - Set logging level
   - Example:
     ```python
     bq_client = bigquery.Client(PROJECT_ID, location="europe-west2")
     logging.basicConfig(level=logging.INFO)
     logger = logging.getLogger(__name__)
     ```

5. **Data Loading** (Code + Markdown)
   - Load data from BigQuery, files, or APIs
   - Include data validation checks
   - Markdown cell: describe expected data structure
   - Code cell: load and validate
   - Example:
     ```python
     query = f"""
     SELECT line_id, operating_date, trip_count
     FROM {DATASET_ID}.trips
     WHERE operating_date BETWEEN '{DATE_START}' AND '{DATE_END}'
     """
     df = bq_client.query(query).to_dataframe()
     assert len(df) > 0, "Query returned no data"
     print(f"Loaded {len(df)} rows, shape: {df.shape}")
     ```

6. **Analysis** (Alternating Code & Markdown cells)
   - Markdown: Hypothesis or question
   - Code: Investigation and calculation
   - Keep cells focused (one analysis task per cell)
   - Use section headers in markdown for readability

7. **Visualization** (Code)
   - Use Plotly for interactive exploration
   - Include plot titles, axis labels, legends
   - Store figures as HTML outputs for sharing (don't commit Plotly objects)

8. **Conclusions & Next Steps** (Markdown)
   - Summarize findings
   - List actionable insights
   - Note assumptions and limitations

### Cell Content Guidelines
- **Code Cells**: Keep under 50 lines when possible; split long analyses into multiple cells
- **Markdown Cells**: Use headers (##/###), bullet points, and code blocks for clarity
- **Output Cells**: Clear and interpretable; use `.head()`, `.info()`, `.describe()` for DataFrames
- **No Magic Commands**: Avoid `%matplotlib`, `%timeit`, etc. in production notebooks; use standard libraries

## Code Quality in Notebooks

### Following Python Standards
- **Formatting**: Apply Black formatting rules (120 char line length)
  - Use tools like `black --line-length=120 notebook.ipynb` (requires nbqa: `pip install nbqa`)
  - Manual formatting: Split long lines before committing

- **Linting**: Validate notebook code with Flake8/Pylint
  - Run: `nbqa flake8 --max-line-length=120 notebook.ipynb`
  - Run: `nbqa pylint --rcfile=.pylintrc notebook.ipynb`

- **No Undefined Names**: All variables must be defined in cells above (run notebook start-to-finish)
- **Type Hints**: Use type hints in function definitions for clarity
- **Docstrings**: Document custom functions with Google-style docstrings (same as python.instructions.md)

### Function Definition Pattern
When code becomes reusable, move it to a `.py` module and import:
```python
# In notebook
from realtime_evaluation.analysis import calculate_metrics

metrics = calculate_metrics(df, date_range)
```

Keep notebooks focused on exploration/reporting, not library code.

## BigQuery Integration in Notebooks

### Query Best Practices
- Use SQL template patterns from `realtime_evaluation.sql_utils.render_sql()`
- Store queries in `.sql` files in the notebook's directory
- Load and render SQL in notebook:
  ```python
  from realtime_evaluation import sql_utils
  from pathlib import Path

  query_path = Path("analysis_query.sql")
  params = {"start_date": DATE_START, "end_date": DATE_END}
  rendered_sql = sql_utils.render_sql(params, query_path)
  df = bq_client.query(rendered_sql).to_dataframe()
  ```

### Credential Handling
- Never hardcode credentials in notebooks
- Use `google.cloud.bigquery.Client()` which auto-resolves credentials via keyring
- Respect `GOOGLE_APPLICATION_CREDENTIALS` environment variable if set
- If credential issues: Run `gcloud auth application-default login` before notebook execution

### Performance Optimization
- Use column projection: Only select columns you need
- Add date range filters in WHERE clause
- Test queries on small date ranges first, then expand
- Use `--dry_run` for cost estimation:
  ```python
  job_config = bigquery.QueryJobConfig(dry_run=True)
  job = bq_client.query(sql, job_config=job_config)
  print(f"Query would scan {job.total_bytes_processed} bytes")
  ```

## Testing & Validation

### Data Validation Pattern
```python
# After loading data
assert not df.empty, "DataFrame is empty"
assert df.shape[0] > 0, "No rows loaded"
assert all(col in df.columns for col in ['required_col1', 'required_col2']), "Missing columns"
assert df['date_column'].dtype == 'object' or 'datetime' in str(df['date_column'].dtype), "Wrong date type"
print(f"✓ Data validation passed. Shape: {df.shape}, Columns: {df.columns.tolist()}")
```

### Unit Testing for Notebook Functions
- Extract reusable functions to `tests/` directory as pytest tests
- Use `conftest.py` fixtures for setup (BigQuery client, test data)
- Run with: `pytest tests/test_notebook_functions.py -v`

### Reproducibility Checklist
Before committing a notebook:
1. Clear all cell outputs: Kernel → Clear All Outputs
2. Restart kernel: Kernel → Restart Kernel
3. Run all cells: Kernel → Run All Cells
4. Verify no errors appear
5. Check that outputs are meaningful (not just "OK")

## Pandas Operations in Notebooks

### Best Practices
- **Display**: Use `.head(10)`, `.tail(5)`, `.info()`, `.describe()` for data exploration
- **Vectorization**: Avoid `.apply()` in tight loops; use pandas built-in operations
- **Chaining**: Chain operations for readability:
  ```python
  result = (df
      .query(f"date >= '{DATE_START}'")
      .groupby('line_id')
      .agg({'trip_count': 'sum'})
      .sort_values('trip_count', ascending=False)
  )
  ```
- **Memory**: For large DataFrames, use `.dtypes` to optimize (e.g., `int64` → `int32` where safe)
- **Naming**: Use descriptive variable names (`df_trips`, `metrics_summary`) not generic (`df`, `result`)

## Visualization Guidelines

### Plotly in Notebooks
- **Interactive**: Use Plotly for exploration (hover, zoom, filter)
- **Static Export**: Save plots as HTML for sharing:
  ```python
  fig.write_html("plot.html")
  ```
- **Configuration**: Always set titles, axis labels, and legends:
  ```python
  fig = px.scatter(df, x='date', y='trips', title='Trip Count by Date')
  fig.update_layout(hovermode='x unified')
  fig.show()
  ```
- **Color Scales**: Avoid default sequential; explicitly specify colorscale
- **Performance**: Pre-aggregate data before plotting large datasets

### Matplotlib (If used)
- Configure once at top:
  ```python
  import matplotlib.pyplot as plt
  plt.rcParams['figure.figsize'] = (12, 6)
  plt.rcParams['font.size'] = 10
  ```
- Close figures after displaying to free memory: `plt.close('all')`
- Avoid `%matplotlib inline` magic commands

## File & Path Management

### Notebook Paths
- Use `Path` from pathlib for cross-platform compatibility
- Store relative paths to data files:
  ```python
  from pathlib import Path
  notebook_dir = Path.cwd()
  data_path = notebook_dir / "data" / "sample.csv"
  ```
- Never use absolute paths like `/Users/username/...`

### External Files
- Store large data files in:
  - BigQuery tables (preferred)
  - `gs://` Cloud Storage paths (not local filesystem)
  - `data/` subdirectories (for small <100MB files)
- Reference in notebooks with `Path` or full GCS URIs

## Documentation & Comments

### Markdown Cell Documentation
```markdown
## Data Exploration: Trip Counts by Operator

This section investigates:
- Total trips per operator
- Temporal patterns (daily/weekly)
- Anomalies or gaps in data

Expected data: Table with columns `operator_id`, `trip_date`, `trip_count`
```

### Code Comments
- Explain "why", not "what" (code shows what)
- Mark assumptions and limitations:
  ```python
  # Assumes trips are recorded in Europe/London timezone
  # Note: Excludes cancelled trips (status != 'cancelled')
  ```
- Use `TODO:` and `HACK:` for known issues

## Common Notebook Issues & Solutions

### Issue: "NameError: name 'X' is not defined"
**Cause**: Cell ran out of order or above cell not executed
**Solution**:
1. Kernel → Restart Kernel
2. Kernel → Run All Cells
3. Verify cell numbers are sequential (1, 2, 3...)

### Issue: BigQuery Authentication Fails
**Cause**: Credentials not cached or environment not set up
**Solution**:
1. Run once: `gcloud auth application-default login`
2. Verify: `echo $GOOGLE_APPLICATION_CREDENTIALS` (should be empty or point to service key)
3. Restart Python/Jupyter kernel

### Issue: Memory/Performance Problems
**Cause**: Loading entire large table into memory
**Solution**:
1. Use date range filters in BigQuery query
2. Use column projection (SELECT specific_cols, not *)
3. Aggregate in BigQuery before loading to Pandas:
   ```python
   # Instead of loading all rows then grouping
   # Push aggregation to BigQuery
   query = f"SELECT date, SUM(trips) as total_trips FROM table GROUP BY date"
   ```

### Issue: Notebook Won't Restart/Kernel Hangs
**Cause**: Long-running operation or infinite loop
**Solution**:
1. Kernel → Interrupt Kernel (Ctrl+C)
2. Kernel → Restart Kernel
3. Review last executed cell for infinite loops or blocking I/O

## Sharing & Collaboration

### Before Sharing a Notebook
1. **Clear outputs**: Kernel → Clear All Outputs
2. **Restart and run**: Kernel → Restart Kernel → Run All Cells
3. **No sensitive data**: Search notebook for credentials, API keys, usernames
4. **Add metadata**: Include author, date, purpose at top
5. **Export if needed**: Use `nbconvert` for PDF/HTML if sharing outside GitHub

### Nbconvert (Convert Notebook to Other Formats)
```bash
# To HTML (interactive)
jupyter nbconvert --to html notebook.ipynb

# To PDF (static)
jupyter nbconvert --to pdf notebook.ipynb

# To Python script
jupyter nbconvert --to script notebook.ipynb
```

## Notebook Conventions in This Repository

### Location-Specific Guidelines

**`personal/<username>/` notebooks:**
- Exploratory and iterative; less strict formatting
- Can include dead ends and experiments
- Use descriptive filenames: `2024_10_22_schedule_analysis.ipynb`
- Optional: Clean up before sharing

**`realtime_evaluation/` notebooks:**
- Integration with SQL templates in `realtime_evaluation/omissions/sql/`
- Use `sql_utils.render_sql()` pattern
- Test with `pytest` if extracting reusable functions
- Clean outputs before committing

**`active_schedule_evaluation/` notebooks:**
- Use Streamlit for production dashboards, not notebooks
- Notebooks for analysis and metric development only
- Reference `active_schedule_evaluation/tests/test_metrics.py` patterns

## Trust These Instructions

These guidelines are validated for this repository and follow modern Jupyter best practices. Only search for additional information if:
1. A command or pattern mentioned here fails unexpectedly
2. You need library-specific documentation not covered here (e.g., advanced Plotly features)
3. Notebook structure requirements differ from what's documented
4. You encounter errors not listed in "Common Notebook Issues & Solutions"

When in doubt, prioritize **reproducibility, clarity, and minimal state dependencies**.
