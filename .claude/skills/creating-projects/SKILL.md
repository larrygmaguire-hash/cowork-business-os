---
name: creating-projects
description: >
  Create a new project with sequential P### ID, standardised folder structure (Research/Drafts/Final), CLAUDE.md operational context, and PRD.md project requirements document. Registers project in state.json. Use when the user wants to start a new internal project or a new client project.
---

# Creating Projects

Create a new project with consistent structure, CLAUDE.md, and PRD.md.

## Step 1: Determine Location

Ask: "Is this an internal project or a client project?"

- **Internal:** project will live in `Projects/`
- **Client:** ask which client (show C### list from state.json). Project lives in `Clients/C### Client Name/Projects/`.

## Step 2: Gather Project Details

Ask these questions one at a time. Wait for each answer before asking the next.

1. **Project name** (required)
2. **Category** -- pick one:
   - `client`, `product`, `internal`, `marketing`, `research`, `operations`, `finance`, `sales`, `legal`, `it`
3. **Priority** -- `critical`, `high`, `medium`, `low` (default: medium)
4. **Due date** (optional, format YYYY-MM-DD)
5. **One-sentence project goal** (used in PRD)
6. **Primary deliverables** (1-3 specific outputs, used in PRD)
7. **Stakeholders** (sponsor, owner, reviewer -- used in PRD)
8. **Tags** (optional, comma-separated)

## Step 3: Assign Next P### ID

Read `.claude/state/state.json`:
- Read `nextProjectNumber`
- Read `projectNumbering` from `.claude/config/integrations.json` (defaults: prefix `P`, separator `""`, digits `3`)
- Generate ID: `{prefix}{separator}{number zero-padded to digits}` -- default `P001`, `P002`, ...

If `nextProjectNumber` is missing, count existing entries in `projects` array + 1.

## Step 4: Create Folder Structure

Create the project folder at the location determined in Step 1:

For internal projects:
```
Projects/P### Project Name/
├── CLAUDE.md
├── PRD.md
├── Research/
├── Drafts/
└── Final/
```

For client projects:
```
Clients/C### Client Name/Projects/P### Project Name/
├── CLAUDE.md
├── PRD.md
├── Research/
├── Drafts/
└── Final/
```

Subfolders do NOT have CLAUDE.md files. Only the top-level project folder does.

## Step 5: Generate CLAUDE.md

Create `[project path]/CLAUDE.md` with operational context only:

```markdown
# P### Project Name

## Project context

- **ID:** P###
- **Category:** [category]
- **Status:** in-progress
- **Created:** [today's date]
- **Client:** [Client name if client project, otherwise omit]

## Files in this folder

- `CLAUDE.md` -- this file. Operational context for Cowork.
- `PRD.md` -- Project Requirements Document. Full project specification (scope, deliverables, stakeholders, milestones, constraints). Read this for the project specification.

## Subfolders

- `Research/` -- background reading, references, source materials
- `Drafts/` -- work in progress
- `Final/` -- completed deliverables

## Project specification

See `PRD.md` for full project requirements.

## Current state

[Initial state notes -- can be brief, will be updated by session-close]

## Conventions

[Any project-specific naming, formatting, or process rules that override workspace defaults]
```

## Step 6: Generate PRD.md

Create `[project path]/PRD.md` with structured requirements populated from Step 2 answers:

```markdown
# P### Project Name -- Project Requirements Document

## Project summary

[Goal from Step 2 question 5]

## Goals and success criteria

| Goal | Success criterion |
|------|-------------------|
| [Primary goal from Step 2.5] | [How you will know this is achieved] |

## Scope

### In scope
- [Derived from deliverables and goal]

### Out of scope
- [TBD -- ask user to fill in]

## Deliverables

| Deliverable | Format | Owner | Due date |
|-------------|--------|-------|----------|
| [From Step 2.6] | [Document / Spreadsheet / Presentation / Other] | [TBD] | [Step 2.4 due date] |

## Stakeholders

| Role | Name | Responsibility |
|------|------|----------------|
| Sponsor | [From Step 2.7] | Approves scope and budget |
| Owner | [From Step 2.7] | Day-to-day decisions |
| Reviewer | [From Step 2.7] | Approves deliverables before release |

## Constraints

- **Deadline:** [Step 2.4]
- **Budget:** [TBD]
- **Approvals required:** [TBD]
- **Dependencies:** [TBD]

## Milestones

| Milestone | Date | Notes |
|-----------|------|-------|
| Kickoff | [Today's date] | Project created |
| First draft | [TBD] | |
| Final delivery | [Step 2.4] | |

## Approach

[TBD -- describe approach when ready]

## Risks and mitigations

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| [TBD] | [TBD] | [TBD] | [TBD] |

## Decisions log

| Date | Decision | Rationale |
|------|----------|-----------|
| [Today] | Project created | [Brief context from Step 2.5] |

## References

- Source materials: see `Research/`
- Brand and voice: see `.claude/company/voice.md` and `.claude/company/brand.md`
- [If client project]: see `../../CLAUDE.md` and `../../PRD.md` for client context
```

Present for review using the Review checkpoint:

```
**Review:** PRD generated for P### Project Name

[Show full PRD]

**Options:** Approve / Revise (tell me what to change) / Add detail later
```

If "Add detail later": mark [TBD] sections and proceed.

## Step 7: Update state.json

1. Backup: run `Infrastructure/Scripts/prima/backup-state.sh`
2. Read state.json
3. Append to `projects` array:

```json
{
  "id": "P###",
  "name": "Project Name",
  "status": "in-progress",
  "priority": "[from Step 2.3]",
  "category": "[from Step 2.2]",
  "tags": ["[from Step 2.8]"],
  "created": "[today]",
  "startDate": "[today]",
  "dueDate": "[from Step 2.4 or null]",
  "lastWorked": "[today]",
  "path": "[full path]",
  "companyName": "[client name or null]",
  "contacts": [],
  "taskCount": 0,
  "tasksDone": 0,
  "tasksBlocked": 0,
  "milestoneCount": 0,
  "milestonesDone": 0
}
```

4. Increment `nextProjectNumber`
5. Validate: run `Infrastructure/Scripts/prima/validate-state.sh`
6. If validation fails, restore from `.claude/state.backups/`

## Step 8: Create Project Detail File

Create `.claude/state/projects/P###.json`:

```json
{
  "id": "P###",
  "description": "[1-2 sentence project description from Step 2.5]",
  "notes": "",
  "stoppedAt": null,
  "lastAction": "Project created",
  "pausedReason": null,
  "sessionHistory": [
    {
      "date": "[today]",
      "summary": "Project created"
    }
  ],
  "milestones": [],
  "todos": [],
  "recentWork": []
}
```

## Step 9: Confirmation

```
**Project created**

- ID: P###
- Folder: [full path]
- Files: CLAUDE.md, PRD.md
- Subfolders: Research/, Drafts/, Final/
- Registered in state.json with detail file at .claude/state/projects/P###.json

**Next steps:**
- Review and refine PRD.md
- Add source materials to Research/
- Begin work in Drafts/
```

## Workflow Notes

- Project IDs (P001, P002, ...) are sequential and never reused
- The same P### ID is used for internal and client projects (one shared number space, registered in the same `projects` array in state.json)
- The `path` field in state.json distinguishes internal from client projects
- Subfolders inside a project (Research/, Drafts/, Final/) do NOT get CLAUDE.md
- When a project is complete, move the entire folder to `Archive/` and update status to `archived` in state.json
