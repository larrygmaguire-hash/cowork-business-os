# CLAUDE.md

## Workspace Identity

**Name:** [Set by /setup]
**ID:** [Set by /setup]
**Type:** [Set by /setup]
**Created:** [Set by /setup]

Read the authoritative values from `.claude/state/state.json` under the `workspace` key.

---

## Business Context

Company knowledge is stored in `.claude/company/`. Consult the relevant file before creating any content, communications, or documents.

| File | Contains |
|------|----------|
| `overview.md` | What the business does, who it serves, core value proposition |
| `voice.md` | Brand voice, tone, formality, language preferences |
| `brand.md` | Visual identity, colours, fonts, logos, asset locations |
| `audiences.md` | Primary and secondary audience profiles |
| `team.md` | Key people, roles, collaborators |
| `industry.md` | Industry terminology, regulations, context |

If a file contains only placeholder text, ask the user for the information or skip that context.

---

## Workspace Structure

```
[workspace-name]/
├── Projects/                   Active projects (P### Project Name/)
├── Clients/                    Client work
│   └── _Templates/            Client folder template
├── Documentation/
│   ├── Templates/             Reusable document templates
│   └── Reports/               Generated reports
├── Archive/                    Completed or dormant projects
├── [Department folders]/       Optional (01 Finance, 02 HR, etc.)
├── Infrastructure/Scripts/     Backup and validation scripts
├── Scripts/                    Custom scripts
└── .claude/                    Configuration root
    ├── company/               Business context (6 files)
    ├── config/                Integration configuration
    ├── docs/                  Reference documentation
    ├── skills/                Reusable skills (auto-detected)
    └── state/                 Project state (v2 split storage)
        ├── state.json         Project index
        ├── state.schema.json  Validation schema
        └── projects/          Per-project detail files
```

---

## File Organisation

Never create files in the workspace root. Place in appropriate subfolders.

| Type | Location |
|------|----------|
| Project work | `Projects/P### Project Name/` |
| Client work | `Clients/[Client Name]/` |
| Completed projects | `Archive/` |
| Documentation | `Documentation/` |
| Reports | `Documentation/Reports/` |
| Templates | `Documentation/Templates/` |

**Project folder naming:** `P### Project Name` in Title Case (e.g., `P001 Website Redesign`).

**Heavy files (PDFs, Office docs, images, videos):** Keep in cloud storage. Reference by path or link. Do not duplicate into workspace unless actively working on them.

---

## Project Governance

Every project folder must contain a `CLAUDE.md` file with project-specific context: scope, deliverables, conventions, current state. Project CLAUDE.md files inherit these master rules and supplement them.

On conflict between master and project rules: stop and ask the user.

---

## State Management (v2 Split Storage)

State is split across three locations:

| Location | Contains | When to read |
|----------|----------|-------------|
| `.claude/state/state.json` | Project index (slim fields) + top-level metadata | Every list/status operation |
| `.claude/state/projects/P###.json` | Project detail (description, notes, stoppedAt, lastAction, sessionHistory, milestones) | Only when working on that project |
| `.claude/state/tasks/P###.json` | Task list with dependencies (optional) | Only when managing tasks |

### Read patterns

- **Index only:** For portfolio overview. Read `state.json` only.
- **Index + selective detail:** For status reports. Read `state.json`, then detail files for relevant projects only.
- **Single project:** For working on one project. Read `state.json` + that project's detail file.

### Write discipline

1. Back up first: run `Infrastructure/Scripts/prima/backup-state.sh`
2. Make the change
3. Validate: run `Infrastructure/Scripts/prima/validate-state.sh`

Never read all detail files. Filter from the index first.

### Project ID rules

- Format: P001 to P999 (3 digits, zero-padded)
- Sequential: next ID = highest existing + 1
- Never reuse an ID, even after archiving

### Valid status values

`in-progress`, `paused`, `overdue`, `archived`. No other values permitted.

---

## Content Defaults

- Language preference: [Set by /setup -- UK English or US English]
- Formatting standards apply per content type (formal for documents, conversational for scripts, direct for marketing)
- Never fabricate citations or sources. If a source cannot be verified, state that explicitly.

---

## File Conventions

- **Project folders:** `P### Project Name` (Title Case)
- **Client folders:** `[Client Name]` (Title Case)
- **Department folders:** `## Department Name` (numbered prefix, Title Case)
- **Document filenames:** descriptive, hyphenated lowercase where practical
- **Date format in filenames:** `YYYY-MM-DD` prefix when date is relevant

---

## Session Lifecycle

Two key operations maintain session continuity:

**Session briefing (start of session):**
Read `.claude/state/state.json`. Show in-progress projects ordered by `lastWorked`. For each, read the project detail file and show where work stopped (`stoppedAt`). Flag projects not worked on in 7+ days. Show priorities and pending items.

**Session close (end of session):**
For each project touched during the session, update the detail file: set `stoppedAt`, `lastAction`, and prepend a `sessionHistory` entry. Update `state.json` with `lastWorked` dates and top-level `sessionHistory`, `recentWork`, `priorities`, `pendingItems`.

These can be run manually or set up as scheduled tasks in Cowork.

---

## Context Checkpoint

When working on long tasks, save progress to disk periodically. Write checkpoint files to the project folder or `Documentation/Reports/` so that if context is lost, work can be resumed without re-reading everything.

---

## Agent Output Persistence

When spawning agents for substantial work (research, analysis, document generation), the agent must write its output to disk and return only a short confirmation. Never return large agent outputs into the main conversation context.
