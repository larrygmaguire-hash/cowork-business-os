# Writing Effective Skill Descriptions

The description field is the single most important part of your frontmatter. It determines whether Claude loads your skill at the right time. This is Level 1 of progressive disclosure — always present in Claude's system prompt.

## Required Structure

```
[What it does] + [When to use it] + [Key capabilities]
```

## Good Descriptions

```yaml
# Specific and actionable — includes trigger phrases
description: Analyses Figma design files and generates developer handoff documentation. Use when user uploads .fig files, asks for "design specs", "component documentation", or "design-to-code handoff".

# Includes natural language triggers
description: Manages Linear project workflows including sprint planning, task creation, and status tracking. Use when user mentions "sprint", "Linear tasks", "project planning", or asks to "create tickets".

# Clear value proposition with scope
description: End-to-end customer onboarding workflow for PayFlow. Handles account creation, payment setup, and subscription management. Use when user says "onboard new customer", "set up subscription", or "create PayFlow account".

# Differentiates from related skills
description: Generate YouTube SEO packages — titles, descriptions, timestamps, and thumbnails. Use when optimising videos. For transcript extraction only, use extracting-youtube-transcripts.

# File-type triggers
description: Create, edit, analyse spreadsheets with formulas and formatting. Use when user works with .xlsx, .xlsm, .csv, or .tsv files, asks to "create a spreadsheet", "analyse this data", or "add formulas".
```

## Bad Descriptions

```yaml
# Too vague — no trigger conditions
description: Helps with projects.

# Missing triggers — only says what, not when
description: Creates sophisticated multi-page documentation systems.

# Too technical, no user-facing language
description: Implements the Project entity model with hierarchical relationships.

# Lists capabilities but no trigger phrases
description: Extract, merge, split, fill forms, annotate PDFs.
```

## Trigger Phrase Patterns

Include phrases users would actually say:

- **Action phrases:** "create a...", "set up a...", "process this...", "review my..."
- **File references:** ".pdf files", ".docx", "spreadsheet", "presentation"
- **Domain terms:** "sprint planning", "code review", "SEO package"
- **Natural variations:** Include 3-4 ways users might phrase the same request

## Negative Triggers

When your skill could conflict with another, add exclusions:

```yaml
description: Advanced data analysis for CSV files. Use for statistical modelling, regression, clustering. Do NOT use for simple data exploration (use data-viz skill instead).
```

## Length

- Under 1024 characters (hard limit)
- Aim for 150-250 characters for best results
- Long enough to include triggers, short enough to scan

## Debugging Trigger Issues

**Skill doesn't trigger (under-triggering):**
- Add more trigger phrases and natural language variations
- Include domain-specific keywords
- Mention relevant file types

**Skill triggers incorrectly (over-triggering):**
- Add negative triggers ("Do NOT use for...")
- Be more specific about scope
- Clarify boundaries with related skills
