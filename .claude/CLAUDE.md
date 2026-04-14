# CLAUDE.md

Master workspace instructions for Cowork Business OS. Read this at the start of every task.

For workspace structure conventions, naming rules, and how to build new skills or projects, see `.claude/FRAMEWORK.md`.

---

## Workspace Identity

**Name:** [Set by /setup]
**ID:** [Set by /setup]
**Type:** [Set by /setup -- personal, client, or internal]
**GitHub:** [Set by /setup]
**Created:** [Set by /setup]

The authoritative values live in `.claude/state/state.json` under the `workspace` key.

---

## Business Context

Company knowledge lives in `.claude/company/`. Consult the relevant file before creating any content, communications, or documents.

| File | Contains |
|------|----------|
| `overview.md` | What the business does, who it serves, value proposition |
| `voice.md` | Brand voice, tone, formality, language preferences |
| `brand.md` | Visual identity, colours, fonts, logos, asset locations |
| `audiences.md` | Primary and secondary audience profiles |
| `team.md` | Key people, roles, collaborators |
| `industry.md` | Industry terminology, regulations, context |

If a file contains only placeholder text, ask the user or skip that context.

---

## Workspace Structure

```
[workspace-name]/
├── Projects/                   Active projects (P### Project Name/)
├── Clients/                    Client work (C### Client Name/)
├── Documentation/
│   └── Reports/               Generated reports and analyses
├── Archive/                    Completed or dormant projects
├── [Department folders]/       Optional (01 Finance, 02 HR, etc.)
├── Infrastructure/Scripts/     Backup and validation scripts (and any custom scripts)
└── .claude/                    Configuration root
    ├── company/               Business context (6 files)
    ├── config/                Integration configuration
    ├── docs/                  Reference documentation
    ├── skills/                Skills (auto-detected by Cowork)
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
| Recurring workflows | `Projects/Workflows/` |
| Reports and analyses | `Documentation/Reports/` |
| Completed projects | `Archive/P### Project Name/` |
| Financial records | `01 Finance/` |
| HR material | `02 Human Resources/` |
| Sales activity | `03 Sales/` |
| Marketing material | `04 Marketing/` |
| Operational processes | `05 Operations/` |
| Product information | `06 Products/` |
| Legal documents | `07 Legal/` |

**Heavy files** (PDFs, Office documents, images, videos, large datasets): keep in cloud storage. Reference by path. Do not duplicate into the workspace unless actively working on them.

---

## Naming Conventions

### Folders
- **Operational folders:** Title Case with spaces (`Projects`, `Documentation`)
- **Project folders:** `P### Project Name` (e.g., `P001 Website Redesign`)
- **Client folders:** Title Case with hyphens (`Client-Name`)
- **Department folders:** Numeric prefix + Title Case (`01 Finance`, `02 Human Resources`)
  - Subfolders use decimal suffix: `01.1 Accounts Payable`, `01.2 Accounts Receivable`
  - Gaps are acceptable -- never renumber after removal

### Files
- **Structural files:** UPPERCASE, no date prefix (`CLAUDE.md`, `README.md`)
- **Working files:** `YYYY-MM-DD-File-Name.ext` (e.g., `2026-03-19-Q2-Content-Calendar.xlsx`)
- **No spaces in filenames** -- use hyphens
- **Skill folders:** `gerund-form-hyphenated` (`drafting-documents`, `processing-spreadsheets`)
- **Skill file:** always `SKILL.md`

Apply conventions to new files only. Do not rename existing files.

---

## Project Governance

Every project folder must contain a `CLAUDE.md` with project-specific context: scope, deliverables, conventions, current state. Project CLAUDE.md files inherit these master rules and supplement them.

On conflict between master and project rules: stop and ask the user.

---

## State Management (v2 Split Architecture)

State is split across three locations:

| Location | Contains | When to read |
|----------|----------|-------------|
| `.claude/state/state.json` | Project index (slim fields) + top-level metadata | Every list/status operation |
| `.claude/state/projects/P###.json` | Project detail (description, notes, stoppedAt, lastAction, sessionHistory, milestones) | Only when working on that project |
| `.claude/state/tasks/P###.json` | Task list with dependencies (optional) | Only when managing tasks |

### Read patterns

- **Index only:** Portfolio overview -- read `state.json` only
- **Index + selective detail:** Status reports -- read index, then detail files for relevant projects only
- **Single project:** Working on one project -- read `state.json` + that project's detail file

### Write discipline (MANDATORY)

Before every state write:

1. **Backup first:** run `Infrastructure/Scripts/prima/backup-state.sh`
2. **Validate JSON syntax:** ensure valid JSON before writing
3. **Check required fields:** `version`, `workspace`, `projects` must exist
4. **After write:** run `Infrastructure/Scripts/prima/validate-state.sh`
5. **If validation fails:** restore from backup and report error

### Project ID rules

- Format: `P001` to `P999` (3 digits, zero-padded)
- Sequential: next ID = `nextProjectNumber` in state.json
- Never reuse an ID, even after archiving
- Never change the meaning of an ID

### Status values

Valid: `in-progress`, `paused`, `overdue`, `archived`. No others.
- `pausedReason` required when status is `paused`
- `pausedReason` must be null otherwise
- Never use "blocked", "new", "discovery", "active"

### Session continuity fields (on detail files)

- `stoppedAt`: where work stopped (set by session close, cleared when resumed)
- `lastAction`: last completed action (set by session close, persists until next update)
- `sessionHistory`: append-only, max 20 entries, prepend new entries, never modify old ones

---

## Graduated Autonomy -- MANDATORY

Four levels determine when to act independently and when to ask.

### Level 1: Auto-Do (Fix Immediately, No Mention)

Obvious errors with a single correct resolution. Fix silently.

| Domain | Examples |
|--------|----------|
| Content | Fix spelling, grammar, punctuation, formatting |
| Documents | Fix broken formulas, formatting errors, misaligned tables |
| Client work | Correct dates, fix file paths, fix broken links |

### Level 2: Auto-Add (Apply Professional Standards, Mention Briefly)

Additions any competent professional would include. Apply and note briefly.

| Domain | Examples |
|--------|----------|
| Content | Language variant corrections, missing attribution |
| Documents | Missing headers, page numbers, template compliance, metadata |
| Client work | Standard disclaimers, document metadata, required formatting |

### Level 3: Auto-Fix (Unblock Progress, Explain)

Issues blocking the current task. Fix to keep moving, explain clearly.

| Domain | Examples |
|--------|----------|
| Content | Broken links, missing images, orphaned references |
| Documents | Broken cross-references, missing sheets, corrupted template elements |
| Client work | Missing folder structure, naming convention violations |

### Level 4: STOP (Ask Before Proceeding)

Changes that alter scope, intent, audience, or commitments. Never proceed without approval.

| Domain | Examples |
|--------|----------|
| Content | Tone changes, audience changes, structural rewrites, platform changes |
| Documents | Changing client-facing content, altering financial figures, modifying contracts |
| Client work | Anything sent to a client, any external communication, any financial commitment |

### Decision rule

When unsure, move up one level (towards STOP). The cost of asking is low. The cost of overstepping is high.

---

## Blocked Commands -- MANDATORY

Require explicit user confirmation before execution. Always Level 4 regardless of context.

| Command | Risk |
|---------|------|
| `rm -rf` | Recursive deletion -- confirm path and scope |
| `sudo` | Privilege escalation -- confirm necessity |
| `git push --force` | Destructive push -- never to main/master |
| `git reset --hard` | Discards local changes -- confirm no uncommitted work lost |
| `DROP TABLE`, `DELETE FROM` (no WHERE) | Data loss |

Never execute without explicit request:
- Commands affecting files outside the workspace
- System-level package installs
- Global git config changes
- Commands exposing credentials or tokens

---

## Checkpoint Protocol -- MANDATORY

Multi-step skills pause for input using these three formats.

### 1. Review Checkpoint

Use after content generation, document creation, or any output needing approval.

```
**Review:** [Brief description of what was produced]

[Short preview -- under 20 lines, or summary if long]

**Options:** Approve / Revise (tell me what to change) / Reject
```

### 2. Decision Checkpoint

Use when multiple valid approaches exist and the user must choose.

```
**Decision needed:** [What needs to be decided]

**Option A:** [Name]
- [1-2 line description]

**Option B:** [Name]
- [1-2 line description]

**Tradeoff:** [One sentence on what differs]
```

### 3. Action Checkpoint

Use when the user must do something Claude cannot (send an email, upload a file, approve a payment).

```
**Action needed:** [What the user must do]

[Clear, specific instruction]

Tell me when done and I will continue.
```

Never skip a checkpoint to save time. Keep previews short. Write full output to disk.

---

## No Permission Prompts for File Edits -- MANDATORY

When the user tells you to edit, change, update, or modify a file, do it immediately. The instruction IS the permission. Never ask "shall I?", "do you want me to?", or present changes for approval before writing.

| User says | You do |
|-----------|--------|
| "Edit this file" | Edit it |
| "Change X to Y" | Change it |
| "Update the skill" | Update it |
| "Add this section" | Add it |
| "Remove that line" | Remove it |
| Gives you content for a file | Write it |

Exception: Level 4 items (client-facing documents, financial figures, contracts). Internal workspace files are always Level 1 when the user has requested the edit.

---

## PDF Processing Scale -- MANDATORY

Before reading ANY PDF, check its size and page count. Then use this scale.

| Scale | Size | Pages | Approach |
|-------|------|-------|----------|
| **1 -- Trivial** | Under 1MB | Under 10 | Read directly |
| **2 -- Small** | 1-5MB | 10-50 | Read directly, write summary to disk |
| **3 -- Medium** | 5-20MB | 50-200 | Chunked reading (20 pages at a time) |
| **4 -- Large** | 20-50MB | 200-500 | Split with `qpdf` first, then chunked |
| **5 -- Massive** | Over 50MB | Over 500 | Split, delegate chunks to parallel agents |

Rules:
- Never skip the size check
- Always use the file path (do not attach/drag large PDFs)
- Use the higher scale when size and page count disagree
- Read the first 5 pages at Scale 3+ to find structure before planning
- Write findings to disk as you go at Scale 2+

---

## Content Defaults

Language, tone, and formality preferences are set in two places during `/setup`:

- **Language and style** → Profile Preferences (Settings > Profile in Claude Desktop)
- **Brand voice and tone** → `.claude/company/voice.md`

Both are authoritative. Read `voice.md` before producing any content. Profile Preferences governs language direction (UK vs US English) and communication style.

- Proofread all outputs before presenting
- Use consistent terminology (see `.claude/company/industry.md`)
- Follow brand guidelines (see `.claude/company/brand.md`)
- Never fabricate citations or sources. If a source cannot be verified, state that explicitly.

---

## Cloud Storage Integration

Heavy files should NOT be saved to this workspace.

**Cloud storage path:** [Set by /setup]

Keep on cloud storage:
- PDFs, Word documents, PowerPoints, Excel files
- Images, videos, audio files
- Large datasets (over 1MB)
- CAD files, design assets

When referencing external files, use consistent path notation:
- `[Drive]/Contracts/2026-01-client-agreement.pdf`
- `[Drive]/Marketing/logo-assets.zip`

---

## Git Workflow

- Before starting a session: `git pull` (if a remote is configured)
- After completing work: commit and push via the `syncing-workspace` skill
- Never commit large binaries, credentials, API keys, or system files
- `.gitignore` covers these by default -- do not remove exclusions

---

## Session Lifecycle

Two skills maintain session continuity:

**Session briefing (start of session):**
Invoke the `session-briefing` skill. It reads `state.json`, shows in-progress projects ordered by `lastWorked`, reads detail files for `stoppedAt`, flags projects not worked on in 7+ days, and displays priorities and pending items.

**Session close (end of session):**
Invoke the `session-close` skill. For each project touched, it updates the detail file (`stoppedAt`, `lastAction`, prepends `sessionHistory`) and updates `state.json` (lastWorked, top-level `sessionHistory`, `recentWork`, `priorities`, `pendingItems`). Always backs up state first.

Both skills can be run manually or set up as scheduled tasks in Cowork.

---

## Context Checkpoint

During long tasks, save progress to disk periodically. Write checkpoint files to the project folder or `Documentation/Reports/` so that if context is lost, work can be resumed without re-reading everything.

---

## Agent Output Persistence

When spawning agents for substantial work (research, analysis, document generation), the agent must write its output to disk and return only a short confirmation. Never return large agent outputs into the main conversation context.

**Pattern:**
```
[Task description]

**Output:** Write your full result to `[output_path]`
**Return to me:** Only the file path and a 1-line summary. Do NOT return the full content.
```

---

## Engine Protection (Advisory)

Cowork does not support hooks, so engine protection is advisory. These files should not be modified by users -- they are engine files maintained upstream.

### Do not modify (engine-managed)
- `.claude/CLAUDE.md` (this file) -- update via upstream template pulls
- `.claude/skills/` -- customise by creating new skills, not editing existing ones
- `.claude/FRAMEWORK.md` -- update via upstream template pulls
- `Infrastructure/Scripts/prima/` -- state backup and validation scripts

### User-owned (never touched by engine)
- `.claude/company/` (all 6 files)
- `.claude/state/state.json` and `.claude/state/projects/*.json`
- `.claude/config/`
- Project folders (`Projects/`, `Clients/`, `Archive/`)
- All workspace content
