---
description: Create a new project with standardised structure
---

## Step 0 — Workspace check (mandatory)

Before doing anything else, check that the workspace is scaffolded:

```bash
test -f .claude/state/state.json || { echo "This workspace is not scaffolded. Run /cowork-business-os:setup first."; exit 1; }
```

If the file is missing, stop and tell the user to run `/cowork-business-os:setup` first. Do not proceed with any other step.

Guide the user through creating a well-structured project with consistent files and organisation. This includes brainstorming, duplicate detection, and optional planning documents.

## Stage 1: Brainstorming (Optional)

Ask: "Would you like to start with a brainstorming session, or do you already know your project structure?"

### If brainstorming:
1. Ask: "What's the working title or general topic?"
2. Guide through:
   - Initial concept — what sparked this?
   - Key questions to explore
   - Potential outcomes
   - Related existing work
3. Ask: "Ready to move to formal project creation, or need more exploration?"

### If skipping brainstorming:
Proceed directly to Stage 2.

---

## Stage 2: Project Definition

Gather the following **one question at a time**:

1. **What is the goal?** (One sentence — what does success look like?)
2. **Who is it for?** (Client, audience, internal use)
3. **What does done look like?** (Specific deliverables, not activities)
4. **What is the timeline?** (Deadline, or ongoing?)
5. **What already exists?** (Prior work, materials, references, related projects)

Then:

6. **Project name**

If user provided a name with the command (e.g., `/newproject Website Redesign`), use that for question 6 and still ask the remaining questions.

---

## Stage 2b: Delivery Parameters (Optional)

After Stage 2, ask: "Would you like to add delivery tracking? This enables timeline visualisation with `/timeline`."

### If yes:

7. **Start date?** (When does/did work begin? Default: today)
8. **Due date?** (Target completion date, or leave blank if ongoing)
9. **Any key milestones?** (List name and target date for each, e.g. "MVP complete — 2026-03-01". Or skip.)

### If no or skip:

- Set `startDate` to the project creation date
- Set `dueDate` to null
- Set `milestones` to empty array `[]`

### Recording delivery data:

Store in the project object in state.json:
```json
{
  "startDate": "2026-02-26",
  "dueDate": "2026-04-15",
  "milestones": [
    { "name": "MVP complete", "date": "2026-03-01", "status": "pending" },
    { "name": "User testing", "date": "2026-04-01", "status": "pending" }
  ]
}
```

All milestones start as `pending`. Transition to `done` via the `project-tracking` skill.

---

## Stage 3: Category and Structure Wizard

### 3a: Choose category

Present the categories (these are a fixed enum — one per project):

| # | Category | Description |
|---|----------|-------------|
| 1 | Client | Client engagements, deployments, consulting |
| 2 | Product | Software, courses, offerings being built |
| 3 | Internal | Business processes, infrastructure, tooling |
| 4 | Marketing | Campaigns, launches, promotional work |
| 5 | Research | Academic, investigation, analysis |
| 6 | Operations | Compliance, admin, process management |
| 7 | Finance | Financial tools, budgets, accounting |
| 8 | Sales | Sales processes, pipeline, proposals |
| 9 | Legal | Contracts, IP, regulatory |
| 10 | IT | Systems, servers, technical infrastructure |

Ask: "Which category fits this project? Pick a number."

The category is stored as the lowercase value (e.g., `client`, `product`) in the `category` field on the project object. This is a fixed enum — no custom values.

### 3a-ii: Choose tags (optional)

After category selection, present the tag seed list:

```
Would you like to add tags? Tags are optional cross-cutting labels. Pick from the list or add your own (comma-separated):

automation · integration · compliance · training · reporting · procurement
hr · crm · content · strategy · website · events · infrastructure
documentation · customer-support
```

- User can pick from the seed list, add custom tags, or skip
- Tags are stored lowercase, hyphenated (e.g., `customer-support`)
- Multiple tags per project are expected

### 3b: Choose subfolders

Present the default subfolders for the selected category:

| Category | Default Subfolders |
|----------|--------------------|
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

Ask: "These are the default subfolders for [category]. Do these work, or would you like to customise?"

**If customise:**
- Ask: "What subfolders do you need? List them separated by commas."
- Create the user-specified subfolders instead of defaults.

**If accept or undecided:**
- Create the defaults.

### 3c: Rules and Skills

Ask: "Does this project need any **project-specific rules or skills**? You can skip this if standard workspace rules are sufficient."

Explain briefly:
- **Rules** are `.md` files in `.claude/rules/` that enforce agent behaviour for this project (e.g., coding standards, naming conventions, review requirements). Master rules already apply to all projects — this is for anything additional.
- **Skills** are reusable workflows in `.claude/skills/` that the agent can invoke (e.g., document processing, grading, content creation). Some may already exist in this workspace.

**Options:** Skip (default) / Add rules / Add skills / Add both

**If the user adds rules or skills:**

1. Ask them to list names — one per line or comma-separated (e.g., `api-standards`, `data-validation`)
2. For each name, check whether the file already exists:
   - Rules: check `.claude/rules/{name}.md`
   - Skills: check `.claude/skills/{name}/SKILL.md`
3. Record which exist and which are new — this information is used in the CLAUDE.md (Stage 5) and completion (Stage 7)

**If the user skips:**

Record no project-specific rules or skills. The CLAUDE.md will note that standard master rules and skills apply.

---

## Stage 4: Generate Project ID

Read the numbering configuration from `.claude/config/integrations.json` (`projectNumbering` section) and the next number from `.claude/state/state.json` (`nextProjectNumber`).

**ID generation:**
1. Read `projectNumbering.prefix` (default: `P`)
2. Read `projectNumbering.separator` (default: `""` — empty string)
3. Read `projectNumbering.digits` (default: `3`)
4. Read `nextProjectNumber` from state.json (default: `1` if missing)
5. Generate ID: `{prefix}{separator}{number zero-padded to digits}` — e.g., `P001`, `PRJ-0001`

**Folder name format:** `{ID} {Project Name}` — e.g., `P004 New Client Portal`

**integrations.json missing projectNumbering:** Use defaults: prefix `P`, no separator, 3 digits.

**nextProjectNumber missing from state.json:** Count existing projects in the array, add 1, and use that. Write `nextProjectNumber` to state.json for future use.

---

## Stage 5: Create Structure and Files

Create the project folder in `Projects/`:

```
Projects/{ID} {Project Name}/
├── CLAUDE.md
├── PRD.md
├── CHANGELOG.md
└── [subfolders from Stage 3b]
```

### 1. CLAUDE.md

```markdown
# {Project Name} — Claude Context

> This project inherits all rules from the Master CLAUDE.md. In case of conflict, Master rules take precedence unless explicitly overridden with user approval.

## Project Overview

**Project ID:** {ID}
**Category:** [Category]
**Status:** Planning
**Created:** [YYYY-MM-DD]

[Purpose statement from user input]

## Project Reference

See [PRD.md](PRD.md) for requirements, build phases, and success criteria.

## Rules

<!-- If user added rules in Stage 3c, list them here with status. Otherwise use default. -->

[Standard master rules apply. No project-specific rules.]

<!-- Example when rules were added:
The following project-specific rules apply in addition to master rules:

| Rule | File | Status |
|------|------|--------|
| API Standards | `.claude/rules/api-standards.md` | Exists |
| Data Validation | `.claude/rules/data-validation.md` | To be created |
-->

## Skills

<!-- If user added skills in Stage 3c, list them here with status. Otherwise use default. -->

[No project-specific skills required.]

<!-- Example when skills were added:
The following skills are used by this project:

| Skill | Location | Status |
|-------|----------|--------|
| Processing PDFs | `.claude/skills/processing-pdfs/` | Exists |
| Grading Reports | `.claude/skills/grading-reports/` | To be created |
-->

## Agents

[Agent configurations needed, or "No project-specific agents."]

## MCP Servers

[MCP servers this project depends on, or "No project-specific MCP servers."]

## Conventions

[Project-specific naming, formatting, terminology, or "Follow master conventions."]

## Related Projects

[Links to related projects, or "None."]
```

### 2. PRD.md

Use the template at `Documentation/Templates/PRD-TEMPLATE.md` as the base structure. Populate it from the Stage 2 answers:

- **Problem Statement** — derived from the goal (question 1) and audience (question 2)
- **Goals** — from question 1
- **Target Users** — from question 2
- **Requirements (Must Have)** — from question 3 ("what does done look like?")
- **Constraints** — from questions 4 (timeline) and 5 (what exists)
- **Build Phases** — derived from requirements, ordered by dependency

**After generating the PRD, present it for review:**

```
**Review:** PRD generated for {ID} {Project Name}

[Show the full PRD]

**Options:** Approve / Revise (tell me what to change) / Add more detail later
```

If "Add more detail later" — save the PRD with placeholder sections marked `[TBD — to be filled in]` and note which sections need completion.

If "Revise" — apply changes and present again.

### 3. CHANGELOG.md

```markdown
# Changelog — {Project Name}

All notable changes to this project are documented here.

## [Unreleased]

### Added
### Changed
### Completed
### Removed

---

## [0.1.0] — [YYYY-MM-DD]

### Added
- Initial project structure created
- CLAUDE.md with project-specific Claude context
- PRD.md with requirements and build phases
- CHANGELOG.md for tracking project evolution
- Standard folder structure for [Category] projects
```

### 4. Subfolders

Create the subfolders from Stage 3b (defaults or user-specified), with `.gitkeep` in each.

---

## Stage 5b: Planned Project (Optional)

If the user says `--planned` or the project is clearly large-scale (multi-phase programme, major client engagement, product build), generate three additional planning documents.

**Important boundary:** These documents track *internal project progress* (phases, tasks, success criteria). PRIMA state tracks the project's *portfolio-level status* (in-progress, priority, dates). They complement each other — do not duplicate.

### Goal-Backward Phase Derivation

Before writing ROADMAP.md, work backwards from the goal:

1. **State the end state:** From question 3, define the final deliverable state
2. **Derive observable truths:** "What must be TRUE for this to be done?" — list 5-10 observable outcomes
3. **Group truths into phases:** Cluster related truths that can be achieved together. Each cluster = one phase.
4. **Order phases by dependency:** Which phases depend on others? Put foundations first.
5. **Derive success criteria:** For each phase, the success criteria ARE the observable truths assigned to it
6. **Work backwards from deadline:** If question 4 gave a deadline, assign dates to phases working backwards from the end

### REQUIREMENTS.md

Derive a PREFIX from the project name (e.g., ACME for an ACME project, WS for a workshop). Use this prefix for all requirement IDs.

```markdown
# Requirements — {Project Name}

**Created:** [YYYY-MM-DD]
**Derived from:** Project definition answers

## Must Deliver

| ID | Requirement | Phase | Status |
|----|-------------|-------|--------|
| [PREFIX]-01 | [Deliverable 1] | — | Active |
| [PREFIX]-02 | [Deliverable 2] | — | Active |

## Should Deliver

| ID | Requirement | Phase | Status |
|----|-------------|-------|--------|
| [PREFIX]-03 | [Nice-to-have 1] | — | Active |

## Out of Scope

- [Explicitly what this project does NOT include]

## Constraints

- Timeline: [from question 4]
- Audience: [from question 2]
- Dependencies: [from question 5]

## Traceability

Requirements map to ROADMAP.md phases. When a phase is completed, update the Phase column and set Status to Validated or Invalidated.
```

### ROADMAP.md

```markdown
# Roadmap — {Project Name}

**Created:** [YYYY-MM-DD]

## Phase 1: [Name] — [Target date]
- [ ] [Task 1]
- [ ] [Task 2]
- **Success criteria:** [Observable truths for this phase]

## Phase 2: [Name] — [Target date]
- [ ] [Task 1]
- [ ] [Task 2]
- **Success criteria:** [Observable truths for this phase]

## Phase 3: [Name] — [Target date]
- [ ] [Task 1]
- [ ] [Task 2]
- **Success criteria:** [Observable truths for this phase]
```

### STATE.md

```markdown
# State — {Project Name}

**Last updated:** [YYYY-MM-DD]

## Current Position

**Phase:** Phase 1: [Name]
**Progress:** 0/N tasks complete

| Phase | Status | Completed | Remaining |
|-------|--------|-----------|-----------|
| Phase 1 | In progress | 0/N | [list] |
| Phase 2 | Not started | — | — |

## Performance

| Phase | Tasks | Duration | Notes |
|-------|-------|----------|-------|
| — | — | — | — |

## Decisions Made

[Record key decisions and rationale as they happen]

## Blockers

| Blocker | Status | Raised | Resolved |
|---------|--------|--------|----------|
| — | — | — | — |

## Open Questions

[Questions that need resolution before proceeding]

## Session Continuity

**Last session:** [YYYY-MM-DD]
**Stopped at:** [What was being worked on when the session ended]
**Next action:** [What to do when resuming]
```

### CONTEXT.md (Optional — Per Phase When Discussion Needed)

Not generated automatically. Created per phase when the user wants to clarify implementation decisions.

**When to create:**
- Phase has multiple valid approaches and user preference matters
- Scope boundaries need clarifying
- User has specific references or constraints not in REQUIREMENTS.md

**Process:**
1. Read the phase from ROADMAP.md
2. Identify 3-4 grey areas
3. Present to user: "Which areas do you want to discuss?"
4. For each selected area, ask 2-4 specific questions with concrete options
5. Write CONTEXT.md capturing decisions

```markdown
# Context — {Project Name} — Phase [N]: [Name]

**Gathered:** [YYYY-MM-DD]

## Phase Boundary

[Clear statement of what this phase delivers — the scope anchor]

## Decisions (Locked)

### [Area 1]
- [Decision made by user]

### [Area 2]
- [Decision made by user]

## Claude's Discretion

[Areas where user said "you decide"]

## Out of Scope for This Phase

[Ideas that came up but belong in other phases]

## Specific References

[Any examples, particular requirements from discussion]
```

**Scope creep rule:** If discussion surfaces a new capability, capture it under "Out of Scope for This Phase" and redirect.

---

## Stage 6: PRIMA Registration

If `.claude/state/state.json` exists, register the new project:

1. Run `${CLAUDE_PLUGIN_ROOT}/scripts/backup-state.sh`
2. Read `.claude/state/state.json` (index)
3. **Check for duplicates** — search all existing projects (including archived) for matching or similar names. If a potential match is found, STOP and present it to the user before proceeding (see `state-validation.md` Duplicate Detection rule)
4. **Add index entry** to the `projects` array in `state.json` (Pattern G — index fields only):
   ```json
   {
     "id": "{ID}",
     "name": "{Project Name}",
     "status": "in-progress",
     "priority": "medium",
     "category": "{category-lowercase}",
     "tags": ["{selected tags from Stage 3a-ii, or empty array}"],
     "created": "{YYYY-MM-DD}",
     "startDate": "{start date from Stage 2b, or created date}",
     "dueDate": "{deadline from Stage 2b, or null}",
     "lastWorked": "{YYYY-MM-DD}",
     "path": "Projects/{ID} {Project Name}",
     "taskCount": 0,
     "tasksDone": 0,
     "tasksBlocked": 0,
     "milestoneCount": 0,
     "milestonesDone": 0
   }
   ```
5. **Create detail file** at `.claude/state/projects/{ID}.json`:
   ```json
   {
     "id": "{ID}",
     "description": "{One-line description from Stage 2}",
     "notes": "",
     "stoppedAt": null,
     "lastAction": "Project created",
     "pausedReason": null,
     "sessionHistory": [],
     "milestones": [],
     "todos": [],
     "recentWork": []
   }
   ```
6. Increment `nextProjectNumber` by 1 in `state.json`
7. Write both files
8. Run `${CLAUDE_PLUGIN_ROOT}/scripts/validate-state.sh` — if validation fails, restore from backup and report error
9. Confirm: "Registered as {ID} in PRIMA state."

If state.json does not exist, skip this step silently.

**Important:** If state.json cannot be read or parsed, warn the user but still create the folder and files — the state registration can be done manually.

---

## Stage 7: Completion

1. **Report all files created** with paths
2. **Display next steps**:
   - Review and refine PRD.md — add detail to any [TBD] sections
   - Add project materials to relevant subfolders
   - Run `/prima-project-management:night` at session end to log changes to CHANGELOG.md
3. **Rules and skills to create** — If the user added rules or skills in Stage 3c that do not already exist, append:
   ```
   **Rules/skills to create:**

   The following were listed for this project but do not exist yet. You will need to create them before they take effect:

   - Rule: `{name}` → create `.claude/rules/{name}.md`
   - Skill: `{name}` → create `.claude/skills/{name}/SKILL.md`
   ```
   If all listed rules and skills already exist, or the user skipped Stage 3c, omit this section.
4. **Offer**: "Would you like to create an initial git commit for this project?"

```
**Project Created**

**ID:** {ID}
**Location:** Projects/{ID} {Project Name}/

Files:
- CLAUDE.md
- PRD.md
- CHANGELOG.md

Subfolders:
- [list created subfolders]

Registered in state.json as {ID}.

**Next steps:**
- Review and refine PRD.md — add detail to any [TBD] sections
- Add project materials to relevant subfolders
```

---

## Quality Standards

- UK English throughout
- CLAUDE.md references Master CLAUDE.md
- Project folder naming: `{ID} {Project Name}` — e.g., `P004 New Client Portal`
- File naming: UPPERCASE for standard files (CLAUDE.md, PRD.md, CHANGELOG.md, ROADMAP.md, STATE.md, REQUIREMENTS.md, CONTEXT.md)
- Date format: YYYY-MM-DD throughout

---

## Decision Rules

**When to suggest brainstorming:**
- User expresses uncertainty about scope
- Project is exploratory
- Multiple approaches seem viable

**Project folder already exists:**
Stop and ask: "Project folder exists. Rename, merge, or cancel?"

**Information seems insufficient:**
Don't guess — ask for clarification.

**state.json missing or invalid:**
Warn user. Create folder and files anyway. Note that state registration was skipped and needs to be done manually or by re-running `/setup`.
