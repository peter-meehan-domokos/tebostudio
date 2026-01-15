---
applyTo: "**/*.sql"
---

# SQL Development Instructions: River Style Guide

## The River Style Philosophy

The "river style" is a specific SQL formatting approach designed for **readability and logical flow**. Think of your SQL as water flowing down a river: the **gutter** (left edge) provides visual structure, keywords align vertically, and indentation guides the eye through logic naturally. This is NOT auto-formatter compatible, but that's intentional—the nuance is in the reasoning.

**Core Principle**: Formatting serves logic, not aesthetics. Every space matters for comprehension.

---

## Fundamental Rules of River Style

### 1. Lowercase Keywords (Always)
- **Rule**: All SQL keywords are lowercase
- **Examples**: `select`, `from`, `where`, `group by`, `left join`, `with`, `as`, `on`, `and`, `or`
- **Rationale**: Lowercase keywords reduce visual noise; uppercased keywords were designed for monochrome terminals (1970s). Modern code prioritizes flow.
- **Exception**: None. Even `WITH` at the start of a query is `with`

```sql
-- ✅ CORRECT
with my_cte as
(
select id, name
)
select * from my_cte

-- ❌ WRONG
WITH my_cte AS
(
SELECT id, name
)
SELECT * FROM my_cte
```

### 2. The Gutter: Left-Aligned Structural Keywords
- **Rule**: `select`, `from`, `where`, `group by`, `order by`, `having`, `with`, `and` (in WHERE), `or` (in WHERE), `left join`, `inner join`, `on` start at column 1 (no indentation)
- **Rationale**: The gutter creates a visual "spine" your eye follows. It's the story structure of your query.
- **The Gutter Elements**:
  - `with` keyword and CTE names
  - `select` keyword
  - `from` keyword
  - `where` keyword
  - `group by`, `order by`, `having` keywords
  - `left join`, `inner join`, `full join` keywords
  - `on` (join condition)
  - `and`/`or` (WHERE conditions, not SELECT list)

```sql
-- ✅ CORRECT - Gutter visible
with cte_one as
(
select col1
      ,col2
  from table_a
 where condition_1
   and condition_2
)
,cte_two as
(
select col3
      ,col4
  from table_b
)
select c1.col1
      ,c2.col3
  from cte_one c1
 left join cte_two c2
        on c1.col1 = c2.col3
 where c1.col2 > 10
   and c2.col4 = 'value'
```

### 3. Column List Alignment: The Leading Comma Pattern
- **Rule**: First column on same line as `select`; subsequent columns on new lines with leading commas, indented to column 7 (6 spaces)
- **Rationale**: Leading commas make additions/deletions clear (you only touch one line per change). Column 7 creates visual alignment
- **Indentation**: 6 spaces before column names (aligning under the 's' in `select` allows one more space)

```sql
-- ✅ CORRECT
select col1
      ,col2
      ,col3
      ,sum(col4) as col4_sum
      ,case when col5 > 10 then 'high' else 'low' end as col5_category

-- ❌ WRONG (No leading commas, hard to track changes)
select col1, col2, col3, sum(col4) as col4_sum,
       case when col5 > 10 then 'high' else 'low' end as col5_category

-- ❌ WRONG (Non-standard indentation)
select col1
       , col2
       , col3
```

### 4. FROM, WHERE, JOIN Indentation
- **Rule**:
  - `from` at column 1
  - Table/CTE name(s) after `from` indented 1 space (column 2)
  - `where` at column 1
  - Conditions indented 1 space (column 2) if simple, further indented if complex
  - JOIN keywords at column 1
  - JOIN table name(s) indented 1 space (column 2)
  - `on` condition indented 8 spaces (column 9)

```sql
-- ✅ CORRECT
 from table_a a
 left join table_b b
        on a.id = b.id
 where condition_1 = true
   and condition_2 = 'value'
   and (complex_condition_a or complex_condition_b)

-- ❌ WRONG (FROM not at gutter)
  from table_a a
  left join table_b b
         on a.id = b.id
```

### 5. CTE Definition Structure
- **Rule**:
  - `with` at column 1
  - CTE name(s) at column 1
  - `as` on same line as CTE name, followed by opening paren on next line
  - Closing paren `)` at column 1
  - Comma separating CTEs at column 1
  - Newline between CTEs for clarity

```sql
-- ✅ CORRECT
with cte_first as
(
select id, name
  from table_1
)
,cte_second as
(
select id, value
  from table_2
)
select *
  from cte_first

-- ❌ WRONG (Parens misaligned, comma placement)
with cte_first as (
    select id, name
    from table_1
  )
, cte_second as (
    select id, value
    from table_2
)
```

### 6. GROUP BY, ORDER BY, HAVING
- **Rule**:
  - Keyword at column 1
  - Columns referenced by number (e.g., `group by 1, 2, 3`) OR column names indented 1 space
  - Use column numbers when referencing many columns (cleaner)
  - Use column names when grouping by specific dimensions (clearer intent)

```sql
-- ✅ CORRECT (Many columns, use numbers)
select date
      ,operator_id
      ,line_id
      ,sum(trips) as trip_count
  from raw_data
 group by 1, 2, 3
 order by 1 desc, 4 desc

-- ✅ CORRECT (Few columns, use names)
select date
      ,operator_id
      ,sum(trips) as trip_count
  from raw_data
 group by date, operator_id
having sum(trips) > 100
 order by trip_count desc
```

### 7. Comments: Inline and Block
- **Rule**:
  - Inline comments: `-- comment text` (two dashes, space, comment) at end of line or standalone
  - Use `--` not `/**/` for single-line comments (easier to comment/uncomment code)
  - Comments indented to match context (usually at gutter for structural comments)
  - Commented-out code kept for reference but marked clearly

```sql
-- ✅ CORRECT
with data_raw as
(
select id
      ,name
      ,value
  from source_table
 -- filter to recent data only
 where date_created >= current_date - 30
)
select *
  from data_raw
 -- ,extra_col  -- TODO: add this column when available
```

### 8. Subqueries and Nested Logic
- **Rule**:
  - Subqueries wrapped in parentheses, opening paren at end of FROM/WHERE line
  - Subquery indented 1 space from parent
  - Closing paren at gutter
  - Use CTEs instead of subqueries when possible (more readable)

```sql
-- ✅ CORRECT (CTE approach preferred)
with recent_data as
(
select id, value
  from raw_data
 where date > '2025-01-01'
)
select *
  from recent_data

-- ✅ CORRECT (Subquery if necessary)
select *
  from (
select id, value
  from raw_data
 where date > '2025-01-01'
       )

-- ❌ AVOID (Subqueries are less readable)
select *
  from (select id, value from raw_data where date > '2025-01-01')
```

### 9. Long Lines: String Literals and Function Calls
- **Rule**:
  - Keep column names and functions on single line if reasonable (<80 chars to column alignment)
  - Break complex functions across multiple lines
  - String literals stay on one line; if too long, use line continuation or split logically
  - Table names (with full project.dataset.table paths) can exceed 80 chars; that's acceptable

```sql
-- ✅ CORRECT (Long table names acceptable)
select *
  from `project-id.dataset_name.very_long_table_name_is_fine_here`

-- ✅ CORRECT (Complex expression split)
select case when a > 10 and b < 20 and c = 'special'
            then 'category_a'
            else 'category_b'
       end as category

-- ✅ CORRECT (Function call, readable)
select split(omnibus_trip_id, '-')[0] as line_id
      ,date_format(transaction_time, '%Y-%m-%d') as transaction_date
```

### 10. Aliases: Table and Column
- **Rule**:
  - Table aliases: single lowercase letter (a, b, c) or short abbreviation (sft, stg)
  - Column aliases: lowercase, underscore_separated, meaningful names
  - `as` keyword always used (explicit > implicit)
  - Alias placement: end of column definition or after table name

```sql
-- ✅ CORRECT
select a.id
      ,a.name
      ,b.value as calculated_value
      ,sum(b.amount) as total_amount
  from table_a a
 left join table_b b
        on a.id = b.id
 group by 1, 2, 3
```

---

## Common Patterns & Templates

### Template 1: Simple SELECT with WHERE
```sql
select col1
      ,col2
      ,col3
  from `project.dataset.table`
 where condition_1 = true
   and condition_2 > 10
```

### Template 2: CTEs with Multiple Steps
```sql
with step_one as
(
select id
      ,name
      ,value
  from raw_table
 where date >= '2025-01-01'
)
,step_two as
(
select id
      ,sum(value) as total_value
  from step_one
 group by id
)
select *
  from step_two
 order by total_value desc
```

### Template 3: JOIN with Multiple Tables
```sql
with data_left as
(
select id
      ,value_a
  from table_a
)
,data_right as
(
select id
      ,value_b
  from table_b
)
select l.id
      ,l.value_a
      ,r.value_b
      ,l.value_a + r.value_b as combined
  from data_left l
 left join data_right r
        on l.id = r.id
```

### Template 4: Aggregation with GROUP BY
```sql
select date
      ,operator_id
      ,line_id
      ,count(*) as trip_count
      ,sum(fare_amount) as total_fare
      ,avg(passenger_count) as avg_passengers
  from transaction_table
 where date between '2025-01-01' and '2025-01-31'
 group by 1, 2, 3
 order by trip_count desc
```

### Template 5: CASE Statement (Complex Logic)
```sql
select id
      ,name
      ,case when status = 'active' and balance > 1000
            then 'premium'
            when status = 'active' and balance > 0
            then 'standard'
            when status = 'inactive'
            then 'dormant'
            else 'unknown'
       end as customer_tier
  from customer_table
```

---

## Dialect-Specific Conventions

### BigQuery SQL (Primary Dialect in This Repo)
- Use backticks for fully qualified table names: `` `project.dataset.table` ``
- Leverage BigQuery functions: `safe_cast()`, `date_trunc()`, `any_value()`
- Prefer named parameters in WHERE over row-by-row conditions when cleaner
- Use `date()`, `timestamp()` functions for type conversion

```sql
-- ✅ CORRECT (BigQuery style)
select safe_cast(trip_id as int64) as trip_id
      ,any_value(line_name) as line_name
      ,date(transaction_time) as transaction_date
  from `project.dataset.transaction_table`
 where date(transaction_time) >= '2025-01-01'
```

---

## Quality Checkpoints Before Submitting SQL

### Code Review Checklist
- [ ] All keywords are lowercase
- [ ] Gutter is visible: `select`, `from`, `where`, `group by`, `left join`, `on`, `and`/`or` at column 1
- [ ] Columns use leading comma pattern, indented to column 7
- [ ] Table aliases are single letters or short abbreviations
- [ ] Column aliases are meaningful and lowercase with underscores
- [ ] CTEs are named descriptively (not `temp`, `cte1`, `data`)
- [ ] `as` is used explicitly for aliases (not implicit)
- [ ] Comments explain "why", not "what" (code shows what)
- [ ] No trailing whitespace at end of lines
- [ ] Subqueries replaced with CTEs where possible
- [ ] Join conditions properly indented (8 spaces to `on` keyword)
- [ ] No commented-out code unless marked with TODO or reason

### Performance Checkpoints
- [ ] WHERE filters are as specific as possible (pushed down)
- [ ] Date filters use `date()` or `timestamp()` not string comparison
- [ ] GROUP BY uses numbers if >3 columns, names if <3
- [ ] SELECT list includes only necessary columns (no `*` unless prototyping)
- [ ] JOINs have clear ON conditions (no Cartesian products)
- [ ] DISTINCT used sparingly (signals data quality issue usually)

### Maintainability Checkpoints
- [ ] CTEs ordered logically (dependencies flow down)
- [ ] Final SELECT is readable and simple (logic in CTEs)
- [ ] Variable names are consistent throughout query
- [ ] Complex calculations extracted to intermediate CTEs
- [ ] Table name prefixes standardized (`` `project.dataset.table` ``)

---

## Common Anti-Patterns & Corrections

### ❌ Anti-Pattern 1: Uppercase Keywords
```sql
-- ❌ WRONG
SELECT col1, col2 FROM table WHERE col1 > 10
-- ✅ CORRECT
select col1
      ,col2
  from table
 where col1 > 10
```

### ❌ Anti-Pattern 2: Trailing Commas in SELECT
```sql
-- ❌ WRONG (Trailing comma, columns not aligned)
select col1,
       col2,
       col3,
  from table

-- ✅ CORRECT (Leading commas, aligned)
select col1
      ,col2
      ,col3
  from table
```

### ❌ Anti-Pattern 3: Missing Gutter
```sql
-- ❌ WRONG (WHERE indented)
select col1, col2
    from table
    where col1 > 10
      and col2 = 'value'

-- ✅ CORRECT (WHERE at gutter)
select col1
      ,col2
  from table
 where col1 > 10
   and col2 = 'value'
```

### ❌ Anti-Pattern 4: Subqueries Instead of CTEs
```sql
-- ❌ WRONG (Nested subqueries, hard to read)
select *
  from (
    select *
      from (
        select id, value from raw_data where date > '2025-01-01'
      )
    where value > 100
  )

-- ✅ CORRECT (CTEs, sequential logic)
with raw_filtered as
(
select id
      ,value
  from raw_data
 where date > '2025-01-01'
)
,values_above_threshold as
(
select *
  from raw_filtered
 where value > 100
)
select *
  from values_above_threshold
```

### ❌ Anti-Pattern 5: Implicit Aliases
```sql
-- ❌ WRONG (No AS keyword)
select sum(amount) total_amount
      ,count(*) row_count

-- ✅ CORRECT (Explicit AS)
select sum(amount) as total_amount
      ,count(*) as row_count
```

---

## Why This Style Matters

The river style isn't decorative; it serves three purposes:

1. **Navigation**: The gutter (left spine) lets your eye track logic vertically. Your brain learns to follow the column 1 keywords as structural markers.

2. **Diff Clarity**: Version control diffs are cleaner. Columns use leading commas, so adding/removing one touches only that line, not the next line too.

3. **Cognitive Load**: Consistent formatting reduces the mental energy needed to parse the query. You spend less time "decoding" style and more time understanding logic.

When the AI agent encounters this style, it creates predictable, maintainable SQL that future developers can understand and modify confidently.

---

## Trust This Guide

This style guide is derived from your team's working examples and reflects what works well with BigQuery analysis queries. The formatting rules are not arbitrary—each one exists to serve readability or maintainability.

When writing or reviewing SQL:
- If it violates a rule above, there's usually a good reason (document it with a comment)
- If you're unsure, refer to the examples in `personal/jared_porcenaluk/jira_tickets/` (they exemplify the style)
- If the AI agent generates SQL that doesn't follow this style, provide examples and reference section numbers

The goal: SQL that is **clear, maintainable, and scalable**.
