# Folder Structure

## Top-Level Folders

| Folder | Purpose |
|--------|---------|
| `Projects/` | Active internal projects. One subfolder per project, named `P### Project Name` (e.g., `P001 Website Redesign`). Every project folder should contain a `CLAUDE.md` with project-specific context. |
| `Clients/` | Client work. One subfolder per client. `_Templates/` contains the template for new client folders. |
| `Documentation/` | Shared reference materials, templates, and reports. |
| `Documentation/Templates/` | Reusable document templates (proposals, reports, briefs). |
| `Documentation/Reports/` | Generated reports and analyses. |
| `Archive/` | Completed or dormant projects. Move here instead of deleting. |
| `Infrastructure/` | System scripts and configuration. |
| `Infrastructure/Scripts/prima/` | State backup and validation scripts (template-managed). |
| `Infrastructure/Scripts/` | Custom scripts go here alongside the template-managed `prima/` subfolder. |

## Department Folders (Optional)

Created by the `/setup` wizard based on your needs. Numbered for consistent sort order.

| Folder | Use for |
|--------|---------|
| `01 Finance/` | Invoices, budgets, financial planning, tax documents |
| `02 Human Resources/` | Hiring, contracts, policies, training records |
| `03 Sales/` | Proposals, pipeline tracking, prospect research |
| `04 Marketing/` | Campaigns, content plans, analytics, social media |
| `05 Operations/` | Processes, SOPs, vendor management, logistics |
| `06 Products/` | Product specs, roadmaps, feature requests |
| `07 Legal/` | Contracts, compliance, regulatory documents |

## Configuration Folder (.claude/)

| Folder | Purpose |
|--------|---------|
| `.claude/company/` | Business context (6 files: overview, voice, brand, audiences, team, industry). Claude reads these before creating content. |
| `.claude/config/` | Integration configuration (API keys, service IDs). |
| `.claude/docs/` | Reference documentation (this file, getting-started, specification). |
| `.claude/skills/` | Reusable skills. Auto-detected by Cowork. |
| `.claude/state/` | Project state tracking (v2 split storage). |
| `.claude/state/projects/` | Per-project detail files (P###.json). |
| `.claude/state/tasks/` | Per-project task lists (created when needed). |

## Key Files

| File | Purpose |
|------|---------|
| `.claude/CLAUDE.md` | Master workspace instructions. Read at the start of every task via Global Instructions bootstrap. |
| `.claude/state/state.json` | Project index. Contains slim entries for all projects plus top-level metadata. |
| `.claude/state/state.schema.json` | Validation schema for state.json. |
| `README.md` | Repository overview (this is what GitHub shows). |

## Naming Conventions

- **Project folders:** `P### Project Name` in Title Case
- **Client folders:** `[Client Name]` in Title Case
- **Department folders:** `## Department Name` (numbered prefix)
- **Document filenames:** descriptive, hyphenated lowercase (e.g., `q2-marketing-report.md`)
- **Date prefix:** `YYYY-MM-DD` when date is relevant (e.g., `2026-04-14-meeting-notes.md`)
