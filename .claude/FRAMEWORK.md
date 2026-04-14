# Cowork Business OS Framework

Structural guidelines for how the workspace is organised, what each component does, and when to use each one. This is a reference document. Skills, state management, and operational rules live elsewhere (see `.claude/CLAUDE.md`).

---

## Workspace vs Project vs Client

Three distinct concepts. Do not use them interchangeably.

| Term | Meaning | Example |
|------|---------|---------|
| **Workspace** | The folder selected in Cowork. Contains everything: projects, clients, documentation, configuration. | This folder |
| **Project** | A discrete body of work inside the workspace. Has a P### ID and lives in `Projects/`. | `Projects/P001 Website Redesign/` |
| **Client** | A customer or external relationship. Lives in `Clients/`. May contain projects. | `Clients/Acme-Corp/` |

Projects and clients are folders inside a workspace. A workspace is the top-level container. You work in one workspace at a time.

---

## Component Types

The workspace has five types of reusable components.

### Skills (`.claude/skills/[name]/SKILL.md`)

Reusable workflows that Cowork auto-detects and invokes.

- Named in gerund form with hyphens: `drafting-documents`, `processing-spreadsheets`
- One folder per skill, always contains `SKILL.md`
- The SKILL.md frontmatter has `name` and `description`
- Cowork reads the description to decide when to activate the skill

When to create a new skill:
- The workflow is multi-step and has reusable structure
- It will be used more than once
- It has clear inputs, outputs, and checkpoints

### Project folders (`Projects/P### Project Name/`)

Discrete bodies of work. Each has a P### ID assigned sequentially by the `creating-projects` skill.

Every project folder contains:
- `CLAUDE.md` -- operational context for Cowork (current state, conventions)
- `PRD.md` -- Project Requirements Document (scope, goals, deliverables, stakeholders, milestones, constraints)
- `Research/` -- background reading, references, source materials
- `Drafts/` -- work in progress
- `Final/` -- completed deliverables

Subfolders do NOT have CLAUDE.md files. Only the project-level folder does.

The project's tracked state (description, stoppedAt, lastAction, sessionHistory) lives in `.claude/state/projects/P###.json`.

### Client folders (`Clients/C### Client Name/`)

Customer or external relationship folders. Each has a C### ID assigned sequentially by the `creating-clients` skill.

Every client folder contains:
- `CLAUDE.md` -- operational context for Cowork (where things are, conventions, current engagement status)
- `PRD.md` -- the full client profile (company snapshot, products, leadership, communication preferences, brand voice, industry context, things to know). Skills read this before producing client-facing work.
- `Projects/` -- client projects (each P### gets a folder here, registered in state.json)
- `Communications/` -- emails, meeting notes, correspondence
- `Contracts/` -- engagement letters, statements of work, signed agreements

Subfolders do NOT have CLAUDE.md files. Only the client-level folder does.

### Department folders (`01 Finance/`, `02 Human Resources/`, etc.)

Optional. Created by the `/setup` wizard based on user choice. Numbered `01`-`07`:

| Number | Department |
|--------|-----------|
| 01 | Finance |
| 02 | Human Resources |
| 03 | Sales |
| 04 | Marketing |
| 05 | Operations |
| 06 | Products |
| 07 | Legal |

Subfolders use decimal suffixes (`01.1 Accounts Payable`, `01.2 Accounts Receivable`). Gaps are acceptable -- do not renumber after removing a subfolder.

Each department folder has its own `CLAUDE.md` with domain-specific guidance.

---

## CLAUDE.md Hierarchy

CLAUDE.md files exist at multiple levels. They inherit from each other.

```
.claude/CLAUDE.md              Master workspace rules (this is the authoritative one)
  └── Projects/P### Project Name/CLAUDE.md    Project-specific rules (additive)
  └── Clients/Client Name/CLAUDE.md           Client-specific rules (additive)
  └── 01 Finance/CLAUDE.md                    Department-specific rules (additive)
```

**Conflict resolution:** if a project or department CLAUDE.md conflicts with master rules, stop and ask the user.

**What goes where:**

- `.claude/CLAUDE.md`: workspace-wide rules, state management, autonomy levels, checkpoint protocol, file conventions, content defaults
- Project CLAUDE.md: scope, deliverables, file inventory, current state, project-specific conventions
- Client CLAUDE.md: client background, primary contacts, communication preferences, engagement history
- Department CLAUDE.md: domain conventions, subfolder structure, recurring tasks, key contacts

---

## State Management (v2 Split Architecture)

Project state is tracked in three tiers.

| Tier | File | Contents |
|------|------|----------|
| Index | `.claude/state/state.json` | Slim fields for all projects + top-level metadata (sessionHistory, priorities, pendingItems) |
| Detail | `.claude/state/projects/P###.json` | Full project detail (description, notes, stoppedAt, lastAction, sessionHistory, milestones, todos, recentWork) |
| Tasks | `.claude/state/tasks/P###.json` | Optional. Task list with dependencies, statuses, due dates |

**Index fields** (in `state.json`):
- `id`, `name`, `status`, `priority`, `category`, `tags`
- `created`, `startDate`, `dueDate`, `lastWorked`
- `path`, `companyName`, `contacts`
- `taskCount`, `tasksDone`, `tasksBlocked`, `milestoneCount`, `milestonesDone`

**Detail fields** (in `projects/P###.json`):
- `id`, `description`, `notes`
- `stoppedAt`, `lastAction`, `pausedReason`
- `sessionHistory`, `milestones`, `todos`, `recentWork`

Read patterns, write discipline, and validation rules are in `.claude/CLAUDE.md` under "State Management".

---

## Skills Directory

Skills are auto-detected by Cowork. The full skill inventory:

### Session management
| Skill | Purpose |
|-------|---------|
| `session-briefing` | Start-of-session overview -- active projects, priorities, where you stopped |
| `session-close` | End-of-session update -- set stoppedAt, lastAction, prepend sessionHistory |
| `saving-session` | Write a checkpoint file mid-session |
| `resuming-session` | Resume context from a previous session |

### Project management
| Skill | Purpose |
|-------|---------|
| `creating-projects` | Create a new project with P### ID, CLAUDE.md, state entries |
| `creating-clients` | Create a new client folder with CLAUDE.md and contact info |
| `workspace-status` | Project health report with traffic lights |
| `status-report` | Generate status reports for projects, clients, or workspace |

### Git
| Skill | Purpose |
|-------|---------|
| `syncing-workspace` | Commit and push changes to remote repository |

### Content creation
| Skill | Purpose |
|-------|---------|
| `copywriting` | Write, rewrite, edit all written content |
| `drafting-documents` | Proposals, reports, briefs, memos |
| `email-drafting` | Professional business emails |
| `meeting-notes` | Structured summaries from meeting content |
| `documenting-workflows` | SOPs, checklists, onboarding guides, playbooks |
| `creating-presentations` | Slide decks with speaker notes |
| `search-engine-optimisation` | On-page SEO, technical audits, keyword research |

### Document processing
| Skill | Purpose |
|-------|---------|
| `processing-pdfs` | Extract, merge, split, fill forms, annotate PDFs |
| `processing-documents` | Create and edit Word documents (.docx) |
| `processing-spreadsheets` | Create and analyse spreadsheets with formulas |

### Meta
| Skill | Purpose |
|-------|---------|
| `setup` | First-time workspace personalisation wizard |
| `creating-skills` | Scaffold new skills following the standard |

---

## Naming Conventions

Full conventions in `.claude/CLAUDE.md` under "Naming Conventions". Summary:

- Operational folders: Title Case with spaces
- Project folders: `P### Project Name`
- Client folders: Title Case with hyphens
- Department folders: numeric prefix + Title Case
- Structural files: UPPERCASE (CLAUDE.md, README.md)
- Working files: `YYYY-MM-DD-File-Name.ext`
- Skill folders: gerund-form-hyphenated
- No spaces in filenames -- use hyphens

---

## Customisation

### What you should customise
- `.claude/company/` -- all 6 files (your business context)
- `.claude/config/` -- integrations
- Content defaults in `.claude/CLAUDE.md` (language, tone, formality)
- Any skill that does not fit your workflow (create a new one)
- Department CLAUDE.md files (when using departments)

### What to leave alone (engine-managed)
- `.claude/CLAUDE.md` core rules (state management, autonomy levels, checkpoint protocol, blocked commands)
- `.claude/FRAMEWORK.md` (this file)
- `.claude/skills/` core skills (copy to a new name if you need a variant)
- `Infrastructure/Scripts/prima/` scripts

Cowork does not enforce this via hooks. It is advisory. If you modify an engine file, your changes may be overwritten when you pull template updates.

---

## Creating New Components

### New project
Use the `creating-projects` skill. It assigns the next P### ID, creates the folder with CLAUDE.md, creates state entries, and updates state.json.

### New client
Use the `creating-clients` skill. It creates the client folder with CLAUDE.md, collects contact information, and can optionally create a first project under the client.

### New skill
Use the `creating-skills` skill. It walks through naming, purpose, workflow, and generates the SKILL.md file. Skills go in `.claude/skills/[name]/SKILL.md`.

### New department
Ask the user for the department name. Create the folder with the next available number (01-07 already assigned -- for new custom departments, use 08+). Create a CLAUDE.md with domain-specific conventions.

---

## What This Framework Does Not Cover

The following are in other files:

- **Operational rules** (autonomy levels, blocked commands, checkpoint protocol, no-permission-prompts): `.claude/CLAUDE.md`
- **State schema** (required fields, validation rules): `.claude/CLAUDE.md` + `.claude/state/state.schema.json`
- **PDF processing scale**: `.claude/CLAUDE.md`
- **Getting started**: `.claude/docs/getting-started.md`
- **Folder structure reference**: `.claude/docs/folder-structure.md`
- **Full specification**: `.claude/docs/specification.md`
- **Global Instructions template**: `.claude/docs/global-instructions.md`
- **Profile Preferences template**: `.claude/docs/profile-preferences.md`
