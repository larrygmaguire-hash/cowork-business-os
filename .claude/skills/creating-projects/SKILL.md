---
name: creating-projects
description: >
  Create a new project with standardised folder structure, CLAUDE.md context file, and project detail tracking. Registers project in state.json and generates PRD template.
---

# Creating Projects

Create a new project with consistent structure and metadata.

## Step 1: Gather Project Details

Ask the following questions **one at a time** (do not batch):

1. What is the goal? (One sentence — what does success look like?)
2. Who is it for? (Client, audience, internal)
3. What does done look like? (Specific deliverables)
4. What is the timeline? (Deadline or ongoing?)
5. What already exists? (Prior work, materials, references)
6. Project name?
7. Which category? (See options in Step 2a)

If user provided a name with initial input (e.g., "creating-projects Website Redesign"), use that for question 6 and skip ahead.

## Step 2: Choose Category, Tags, and Subfolders

### 2a: Category Selection

Present these options:

| # | Category | Description |
|---|----------|-------------|
| 1 | Client | Client engagements, deployments |
| 2 | Product | Software, courses, offerings |
| 3 | Internal | Business processes, tooling |
| 4 | Marketing | Campaigns, launches |
| 5 | Research | Academic, investigation |
| 6 | Operations | Compliance, admin |
| 7 | Finance | Financial tools, budgets |
| 8 | Sales | Sales processes, proposals |
| 9 | Legal | Contracts, IP, regulatory |
| 10 | IT | Systems, servers, infrastructure |

Ask: "Which category fits? Pick a number."

Store as lowercase (`client`, `product`, etc.) in the project object.

### 2b: Tags (Optional)

Present seed list:

```
automation · integration · compliance · training · reporting · procurement
hr · crm · content · strategy · website · events · infrastructure
documentation · customer-support
```

Ask: "Add tags? (comma-separated, or skip)"

Store tags lowercase, hyphenated.

### 2c: Default Subfolders

For the selected category, present defaults:

| Category | Default Subfolders |
|----------|-------------------|
| Client | `Deliverables/`, `Internal/` |
| Product | `Design/`, `Development/` |
| Internal | `Docs/` |
| Marketing | `Campaigns/`, `Assets/` |
| Research | `Notes/`, `Sources/` |
| Operations | `Docs/` |
| Finance | `Reports/`, `Records/` |
| Sales | `Proposals/`, `Pipeline/` |
| Legal | `Contracts/`, `Compliance/` |
| IT | `Docs/` |

Ask: "Create these subfolders? (accept/customise)"

If customise: ask for comma-separated list.

## Step 3: Project ID Generation

Read `.claude/state/state.json`:

1. Check `projectNumbering.prefix` (default: `P`)
2. Check `projectNumbering.separator` (default: `""` — empty string)
3. Check `projectNumbering.digits` (default: `3`)
4. Read `nextProjectNumber` (if missing: count existing projects + 1)

Generate ID: `{prefix}{separator}{number zero-padded to digits}`

Example: `P001`, `PRJ-0001`

Folder name: `{ID} {Project Name}` (e.g., `P004 Website Redesign`)

## Step 4: Create Folder Structure

Create in `Projects/`:

```
Projects/{ID} {Project Name}/
├── CLAUDE.md
├── PRD.md
└── [subfolders from Step 2c]
```

## Step 5: Generate CLAUDE.md

```markdown
# {Project Name} — Claude Context

> This project inherits all rules from the master CLAUDE.md.

## Project Overview

**Project ID:** {ID}
**Category:** [Category]
**Status:** In Progress
**Created:** [YYYY-MM-DD]

[Purpose statement from Step 1]

## Project Reference

See [PRD.md](PRD.md) for requirements and build phases.

## Rules

Standard master rules apply.

## Skills

No project-specific skills required.

## Conventions

Follow master conventions.
```

## Step 6: Generate PRD.md

Create a basic PRD template populated from Step 1 answers:

```markdown
# Product Requirements Document — {Project Name}

**Project ID:** {ID}
**Version:** 1.0
**Created:** [YYYY-MM-DD]

## Problem Statement

[Derived from goal and audience]

## Goals

[From Step 1, question 1]

## Target Users

[From Step 1, question 2]

## Requirements (Must Have)

[From Step 1, question 3 — specific deliverables]

## Constraints

Timeline: [From Step 1, question 4]

Existing resources: [From Step 1, question 5]

## Build Phases

[Ordered by dependency]

## Success Criteria

[Measurable outcomes from the goal]
```

Present for review:

```
**Review:** PRD generated for {ID} {Project Name}

[Show full PRD]

**Options:** Approve / Revise (tell me what to change) / Add detail later
```

If "Add detail later": mark [TBD] sections and proceed.

If "Revise": apply changes and re-present.

## Step 7: Register in State

If `.claude/state/state.json` exists and is valid:

1. Backup: `bash Infrastructure/Scripts/prima/backup-state.sh`
2. Read state.json
3. Append to `projects` array:

```json
{
  "id": "{ID}",
  "name": "{Project Name}",
  "description": "{One-line from Step 1}",
  "status": "in-progress",
  "priority": "medium",
  "created": "[YYYY-MM-DD]",
  "dueDate": "[deadline or null]",
  "lastWorked": "[YYYY-MM-DD]",
  "category": "[category-lowercase]",
  "tags": "[selected tags or empty array]",
  "path": "Projects/{ID} {Project Name}",
  "taskCount": 0,
  "tasksDone": 0,
  "tasksBlocked": 0,
  "milestoneCount": 0,
  "milestonesDone": 0
}
```

4. Increment `nextProjectNumber`
5. Write state.json
6. Validate: `bash Infrastructure/Scripts/prima/validate-state.sh`

If state.json missing or invalid, warn user but continue.

## Step 8: Create Project Detail File

Create `.claude/state/projects/{ID}.json`:

```json
{
  "id": "{ID}",
  "name": "{Project Name}",
  "stoppedAt": null,
  "lastAction": "Project created",
  "pausedReason": null,
  "sessionHistory": [{
    "date": "[YYYY-MM-DD]",
    "summary": "Project created"
  }]
}
```

## Step 9: Confirmation

```
**Project Created**

**ID:** {ID}
**Location:** Projects/{ID} {Project Name}/

Files:
- CLAUDE.md
- PRD.md

Subfolders:
- [list created subfolders]

Registered in state.json.

**Next steps:**
- Review PRD.md and refine detail
- Add materials to subfolders
- Begin work when ready
```

---

Begin by gathering project details one question at a time.
