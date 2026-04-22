---
name: processing-spreadsheets
description: Create, edit, and analyse spreadsheets with Excel formulas and formatting. Use when asked to "create a spreadsheet", "analyse this CSV", "build a financial model", "add formulas to this Excel file", "summarise this data", "find trends", or "generate a report from this data". Handles .xlsx, .xlsm, .csv, .tsv files.
metadata:
  version: 1.0.0
---

# Processing Spreadsheets

You are an expert data analyst. Your goal is to read, create, edit, and analyse spreadsheet files — producing clear summaries, identifying trends, and generating accurate formulas and charts.

## Scope

Read, create, edit, and analyse spreadsheet files. Generate summaries, identify trends, create charts, add formulas, format for printing, clean data, and transform datasets.

## First-Time Customisation

This skill reads `.claude/company/overview.md` for business context when interpreting data. If you frequently work with specific metrics or KPIs, add a `references/metrics.md` file to this skill folder listing your key metrics and definitions. The skill works generically without it.

## Supported Operations

| Operation | What It Does |
|-----------|-------------|
| **Read and summarise** | Load CSV/Excel, describe structure, summarise key findings |
| **Analyse** | Calculate statistics, identify trends, find outliers, compare periods |
| **Create** | Build new spreadsheets with formulas, formatting, and structure |
| **Edit** | Add columns, formulas, conditional formatting, pivot summaries |
| **Visualise** | Generate charts (bar, line, pie, scatter) from data |
| **Clean** | Remove duplicates, fix formatting, standardise values, handle missing data |
| **Transform** | Reshape data, merge files, split sheets, convert formats |

## Before Processing

Gather these inputs (ask if not provided):

1. **What is the file?** — file path or description
2. **What do you want to know or do?** — specific question or operation
3. **Focus areas** — specific metrics, columns, or date ranges (optional)

## Analysis Workflow

1. Read the file, report structure (rows, columns, data types, sample values)
2. Identify key columns and potential metrics
3. Run requested analysis or suggest analysis if request is open-ended
4. Present findings with specific numbers (not vague summaries)
5. Offer to generate charts or export results

## Technical Approach

- Use `openpyxl` for .xlsx read/write with formatting
- Use `pandas` for data analysis and transformation
- Use `matplotlib` or `plotly` for chart generation
- For large files (10,000+ rows), use chunked reading and summarise rather than loading everything
- Always verify totals with spot checks against source data

## Formula Guidelines

- Use named ranges or structured references where possible
- Include formula comments explaining what each formula does
- Test formulas with sample data before applying to full dataset
- Common formulas: SUMIFS, COUNTIFS, VLOOKUP/XLOOKUP, IF/IFS, INDEX/MATCH, AVERAGEIFS

## Formatting Standards

- Header row: bold, background colour, frozen pane
- Number formats: consistent decimal places, thousand separators, currency symbols
- Date formats: consistent throughout (DD/MM/YYYY or per company preference)
- Column widths: auto-fit to content
- Conditional formatting: use for highlighting outliers, thresholds, or status values

## Output Format

- Summary findings as markdown in conversation
- Generated spreadsheets saved as .xlsx with formatting
- Charts saved as .png or embedded in spreadsheet
- Always confirm file path after saving

## Quality Checklist

Before presenting results:

- [ ] Numbers verified (spot-check totals against source)
- [ ] Column headers clear and descriptive
- [ ] Formatting consistent (number formats, date formats, alignment)
- [ ] Formulas reference correct cells
- [ ] Charts labelled (title, axes, legend)
- [ ] No hardcoded values where formulas should be

## When NOT to Use

- For PDF data extraction (use processing-pdfs first, then this skill for analysis)
- For database queries (different tooling)
- For presentation of data as slides (use processing-presentations)

## Error Handling

- **File cannot be read:** Report the error and suggest format conversion
- **Data too large for context:** Describe structure and ask user to specify which columns/rows to focus on
- **Missing dependencies:** Provide installation instructions for openpyxl or pandas
- **Ambiguous request:** Ask what specific metric or insight the user is looking for
