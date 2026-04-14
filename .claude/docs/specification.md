# AI Business OS v2.0.0 — Cowork Adaptation Guide

**Date:** 2026-04-13
**Source:** `larrygmaguire-hash/ai-business-os` v2.0.0 (Claude Code template)
**Target:** Cowork version of AI Business OS (Claude Desktop)

This document maps every component of the AI Business OS template to its Cowork equivalent. The template is designed for Claude Code (VS Code / CLI). Cowork reads configuration differently. This guide specifies what transfers directly, what needs adaptation, and what has no equivalent.

---

## 0. How Cowork Reads Configuration — Key Differences

### What Cowork does NOT auto-load from `.claude/`

| Template Component | Claude Code Behaviour | Cowork Behaviour |
|--------------------|----------------------|-------------------|
| `.claude/CLAUDE.md` | Auto-loaded every session | **Not auto-loaded** |
| `.claude/FRAMEWORK.md` | Loaded on demand (referenced from CLAUDE.md) | **Not auto-loaded** (same — on demand) |
| `.claude/settings.json` | Enforced — permissions, hooks, model | **Not read** |
| `.claude/settings.local.json` | Personal overrides | **Not read** |
| `.claude/rules/*.md` | Auto-loaded every session (or path-gated) | **Not read** |
| `.claude/commands/*.md` | Slash commands via `/name` | **Not read** |
| `.claude/agents/*.md` | Named subagent definitions | **Not read** |
| `.claude/company/*.md` | Referenced on demand (not auto-loaded) | **Not auto-loaded** (same — on demand) |
| `.claude/config/` | Integration config, loaded on demand | **Not auto-loaded** (same — on demand) |
| `.claude/docs/` | Reference docs, loaded on demand | **Not auto-loaded** (same — on demand) |
| `.claude/engine-manifest.json` | Engine update protection list | **Not read** (no engine-guard hook) |
| `.claude/suite-registry.json` | PRIMA suite component registry | **Not auto-loaded** (same — on demand) |
| Root `.mcp.json` | Per-workspace MCP servers, auto-loaded | **Not read** — MCP servers installed via Settings > Extensions instead |

### Cowork instruction layers

Claude Desktop has multiple instruction layers. Understanding which is which is essential for mapping the AI Business OS configuration correctly.

| Layer | Where to set it | Scope | What goes in it |
|-------|----------------|-------|-----------------|
| **Profile Preferences** | Settings > Profile | All Claude conversations (Chat, Cowork, everything) | Personal identity — who you are, your role, communication preferences, working style. Applies to the person, not to any workspace. |
| **Cowork Global Instructions** | Settings > Cowork > Edit | All Cowork tasks | Company/business identity, operational standards, and the workspace bootstrap directive. This is the primary instruction layer for the AI Business OS in Cowork. |
| **Skills** (`.claude/skills/`) | Files in the workspace `.claude/skills/` directory | When invoked or auto-triggered | Task-specific capabilities. Works identically in Claude Code and Cowork. |
| **Plugins** | Installed at app level | When skill/agent is invoked | Extension bundles (skills, agents, settings). |
| **Connectors / Extensions** | App-level MCP integrations — both pre-built (Google Calendar, Gmail, Canva) and custom MCP servers via Settings > Extensions | When tools are called | Claude Code equivalent: `.mcp.json` + `~/.claude.json`. Cowork supports local Node.js MCP servers. |
| **Scheduled tasks** | Cowork task-level scheduling | Recurring | Runs a described task on a schedule. Works without Cowork Projects. No direct Claude Code equivalent. |

### What we do NOT use

| Layer | Why not |
|-------|---------|
| **Cowork Projects** | The AI Business OS has its own project management system (P### projects, state.json, project folders with CLAUDE.md). Cowork Projects are a separate project concept that would create confusion — users would need to understand two project systems with the same name. All project management happens through AI Business OS skills. Do not create Cowork Projects for AI Business OS projects. |
| **Folder Instructions** | Stored internally by Cowork — not version-controlled, not portable, not visible in the file system. The AI Business OS requires configuration that travels with the repo. |
| **Cowork Project Instructions** | Only available inside Cowork Projects, which we are not using. |

### Mapping to Claude Code equivalents

| Claude Code | Cowork equivalent |
|-------------|-------------------|
| `~/.claude/CLAUDE.md` (user-level, personal) | **Profile Preferences** — personal identity, communication style |
| `~/.claude/rules/` (user-level rules) | **Global Instructions** — universal operational rules |
| `.claude/company/` (organisation knowledge) | **Global Instructions** — the business is the person, so company info is global |
| `.claude/CLAUDE.md` (workspace-level) | **Global Instructions** directive to read `.claude/CLAUDE.md` at task start |
| `.claude/rules/` (workspace-level, auto-loaded) | **Consolidated into `.claude/CLAUDE.md`** — read via Global Instructions directive |
| `.claude/skills/` | **`.claude/skills/`** — identical |
| `.claude/commands/` | **Converted to `.claude/skills/`** — commands do not exist in Cowork |
| `.claude/settings.json` (permissions, hooks) | **No equivalent** — advisory rules in CLAUDE.md only |
| `.mcp.json` (per-workspace MCP) | **Settings > Extensions** — same servers, manual install per app instead of auto-loaded from `.mcp.json` |

### The two layers that matter

For the AI Business OS in Cowork, only two instruction layers carry real content:

**1. Profile Preferences (Settings > Profile):**

The person. Set once.

```
[Personal name and role]
[Communication style — e.g., UK English, direct tone, no sycophancy]
[How you want Claude to interact with you]
```

**2. Global Instructions (Settings > Cowork):**

The business, the operational rules, and the workspace bootstrap. Set once.

```
[Company/business identity — adapted from .claude/company/overview.md]
[Brand voice and communication standards — adapted from .claude/company/voice.md]
[Target audiences — adapted from .claude/company/audiences.md]
[Universal operational rules — autonomy levels, blocked commands, checkpoint protocol]

At the start of every task where the workspace folder is accessible:
1. Read .claude/CLAUDE.md — this is the master instruction document for the workspace. Follow all rules in it.
2. When working on a specific project folder (e.g., Projects/P004 Website Redesign/), also read that project folder's CLAUDE.md if one exists.
These workspace files are the authoritative source. If instructions in these files conflict with anything else, the workspace files take precedence.
```

This puts the company identity, the universal rules, AND the workspace bootstrap directive all in one place. The Global Instructions carry the stable context (who the business is, how to operate) and the directive to read the workspace files (which carry the evolving context — project state, workspace-specific rules).

### Why `.claude/company/` content goes in Global Instructions

The AI Business OS template uses `.claude/company/` to describe the business — overview, voice, brand, audiences, team, industry. For a freelancer or consultant, the business IS the person. This information is the same across all workspaces (there is only one workspace per installation).

In Cowork, this means the company knowledge goes in **Global Instructions**:
- It applies to every task regardless of which project folder is active
- It does not change between workspaces (one installation = one business)
- It is the business-level identity layer

**Maintenance note:** If the user updates `.claude/company/voice.md`, they must also update the corresponding content in Global Instructions. This is a duplication cost. The alternative — having Global Instructions read the company files at task start — adds file reads to every task but keeps one source of truth. Either approach works; the setup documentation should note the tradeoff.

### Will this work reliably?

This is not asking Cowork to do something it cannot do. Cowork reads files as a core capability. Global Instructions load automatically for every task — they are the platform's designed mechanism for persistent context.

However, there are reliability considerations:

| Factor | Risk | Mitigation |
|--------|------|------------|
| **CLAUDE.md length** | A long CLAUDE.md (200+ lines with consolidated rules) may see reduced adherence at the tail end | Keep CLAUDE.md under 200 lines. Move skill-specific rules into SKILL.md files. |
| **Two-step loading** | Claude must read the file before it knows the workspace rules — early actions in a task may not follow rules it has not yet read | The Global Instructions directive says "at the start of every task" — this is the first thing Claude sees. |
| **Not system-level** | In Claude Code, CLAUDE.md loads as system context. In Cowork, it loads as file content read during the task. System context has stronger adherence. | Accept some reduction in rule adherence. Critical rules (state validation, workspace identity) must be embedded directly in skills — not reliant on CLAUDE.md loading. |
| **Global Instructions length** | Global Instructions carry company identity + rules + the bootstrap directive. If too long, adherence drops. | Keep Global Instructions focused on identity and universal rules. Workspace-specific rules go in `.claude/CLAUDE.md`. |

**Bottom line:** This approach works. It is not fighting the platform. But it is one step removed from Claude Code's auto-loading, so critical operational rules (state validation, workspace identity checks) must be embedded in the skills that execute them — not solely reliant on CLAUDE.md being read. CLAUDE.md provides the behavioural layer (communication standards, file conventions). Skills provide the operational layer (validate before writing, check identity before pushing). Global Instructions provide the identity layer (who the business is, how to communicate).

### Project-level CLAUDE.md loading

In Claude Code, CLAUDE.md files are loaded hierarchically — Claude Code walks up from the current working directory to the repo root, loading every CLAUDE.md it finds. When working in `Projects/P004 Website Redesign/`, Claude Code automatically loads both `.claude/CLAUDE.md` (workspace) and `Projects/P004 Website Redesign/CLAUDE.md` (project).

**Cowork does not do this.** It does not walk directories or auto-load any CLAUDE.md files.

**Solution:** The Global Instructions directive tells Cowork to read the project folder's CLAUDE.md when working on a specific AI Business OS project. Skills that operate on a project should also read the project's CLAUDE.md as their first action.

Example: the `project-tracking` skill, when updating P004, reads:
1. `.claude/CLAUDE.md` (workspace rules — via the Global Instructions directive)
2. `Projects/P004 Website Redesign/CLAUDE.md` (project-specific context — read by the skill itself)

Every project folder must still contain a CLAUDE.md (this rule is unchanged). The difference is that in Cowork, loading the project CLAUDE.md is the skill's responsibility rather than the platform's.

### Scheduled tasks without Cowork Projects

Cowork scheduled tasks do not require Cowork Projects. The user describes a task, sets a schedule, and Cowork runs it against the workspace folder.

**Session lifecycle via scheduled tasks — recommended setup:**

| Task | Schedule | What it does |
|------|----------|-------------|
| **Session briefing** | Every morning (e.g., 8:30am) | Reads `.claude/state/state.json`, shows projects last worked on, flags overdue items, lists today's priorities. Output is waiting when the user opens Cowork. |
| **Session close** | Every evening (e.g., 6:00pm) | Reviews what was worked on during the day, writes `stoppedAt`/`lastAction`/`sessionHistory` to state.json, updates priorities and pending items. |

These scheduled tasks are a **safety net**, not a replacement for manual use. The user can still invoke `/day` and `/night` as skills at any time — for example, running `/day` mid-afternoon to check project status, or running `/night` before stepping away for an hour. The scheduled versions ensure that even if the user forgets, `stoppedAt` is written and the next morning's briefing has context.

**Other useful scheduled tasks:**

- "Run /status and save the report to Documentation/Reports/" — weekly
- "Check .claude/state/state.json for projects with lastWorked older than 14 days and flag them" — daily
- "Check for projects with status 'in-progress' but lastWorked older than 7 days and list them" — twice weekly

Scheduled tasks are a Cowork-native feature. In this context, they replace the manual session lifecycle that Claude Code relies on, and add recurring automations that Claude Code does not have natively.

### Design principles for the Cowork version

1. **Skills are the primary delivery mechanism.** They work in both environments. Everything that can be a skill, should be.
2. **Two instruction layers only.** Profile Preferences = the person. Global Instructions = the business + universal rules + workspace bootstrap directive. No Cowork Projects. No Folder Instructions.
3. **CLAUDE.md remains the master workspace instruction document.** Cowork does not auto-load it, but Global Instructions tell Claude to read it at task start. The workspace files are the source of truth.
4. **Company identity goes in Global Instructions.** For a single-business installation, `.claude/company/` content belongs at the global level — it does not change between workspaces.
5. **Rules go in CLAUDE.md or in skills.** Content from `.claude/rules/` must be consolidated into `.claude/CLAUDE.md` (for workspace-wide rules) or embedded in SKILL.md files (for skill-specific rules).
6. **Commands become skills.** All `/name` functionality from `.claude/commands/` must be delivered as `.claude/skills/` entries.
7. **Hooks become advisory.** There is no enforcement mechanism in Cowork. Safety rules are guidance, not guaranteed.
8. **On-demand files work fine.** `.claude/config/`, `.claude/docs/`, `.claude/state/` — anything that skills read explicitly works the same in both environments.
9. **No Cowork Projects.** All project management happens through the AI Business OS system (state.json, project folders, skills). Cowork Projects would create a confusing parallel system.

---

## 1. Template `.claude/` Component Mapping

### 1.1 `.claude/CLAUDE.md` — Master Instructions

**In Claude Code:** Auto-loaded at session start. Contains workspace identity, business context, workspace structure, file organisation rules, communication standards, git workflow, session continuity guidance.

**In Cowork:** Not auto-loaded. **Read via Global Instructions directive** — the Global Instructions tell Cowork to read `.claude/CLAUDE.md` at the start of every task (see Section 0).

The CLAUDE.md file is the single source of truth for workspace configuration in both environments. In Claude Code the platform loads it automatically. In Cowork the platform is told to load it via a directive in Global Instructions. The file itself is identical.

**Cowork CLAUDE.md must consolidate workspace-level rules.** In Claude Code, rules from `.claude/rules/` auto-load separately from CLAUDE.md. In Cowork, there is no separate rules auto-load. Workspace-specific rule content (content-defaults, file-conventions, engine-protection) must be in `.claude/CLAUDE.md` directly. Universal rules (autonomy levels, blocked commands, checkpoint protocol) go in Global Instructions instead. This means the Cowork CLAUDE.md may be slightly longer than the Claude Code version, but the total instruction load is split across two layers rather than consolidated into one.

### 1.2 `.claude/FRAMEWORK.md` — Structural Guidelines

**In Claude Code:** Loaded on demand when creating or modifying components. Not auto-loaded.

**In Cowork:** Same behaviour — on-demand reference. No adaptation needed. Skills that create projects, folders, or components read FRAMEWORK.md explicitly.

### 1.3 `.claude/company/` — Organisation Knowledge

**Template files:** `overview.md`, `team.md`, `audiences.md`, `voice.md`, `brand.md`, `industry.md`

**In Claude Code:** Not auto-loaded. Referenced from CLAUDE.md — skills read specific company files when producing content, communications, or client-facing documents.

**In Cowork:** Same behaviour — on-demand reference. **No adaptation needed.** Skills like `copywriting`, `email-drafting`, `creating-presentations` read the relevant company file before producing output.

This is one of the components that transfers directly. The `.claude/company/` directory works identically because it was already skill-driven, not platform-driven.

### 1.4 `.claude/rules/` — Behavioural Rules

**Template rules:**

| Rule File | Purpose | Auto-loaded in Claude Code |
|-----------|---------|---------------------------|
| `autonomy-levels.md` | Graduated autonomy (4 levels) | Yes — every session |
| `blocked-commands.md` | Destructive command confirmation | Yes — every session |
| `checkpoint-protocol.md` | Multi-step workflow checkpoints | Yes — every session |
| `content-defaults.md` | Content formatting standards | Yes — every session |
| `engine-protection.md` | Prevents modification of engine files | Yes — every session |
| `file-conventions.md` | File naming and placement | Yes — every session |
| `pdf-scale.md` | PDF size-based processing | Yes — every session |
| `state-validation.md` | State write protocol (PRIMA) | Yes — every session |

**In Cowork:** None of these auto-load.

**Migration strategy:**

| Rule | Cowork delivery |
|------|----------------|
| `autonomy-levels.md` | **Global Instructions** — universal operational rule, applies to all workspaces |
| `blocked-commands.md` | **Global Instructions** — universal safety rule |
| `checkpoint-protocol.md` | **Global Instructions** — universal workflow pattern |
| `content-defaults.md` | **Consolidate into `.claude/CLAUDE.md`** — workspace-specific, references company/ files |
| `engine-protection.md` | **Advisory note in `.claude/CLAUDE.md`** — engine-guard hook does not exist in Cowork (see 1.7) |
| `file-conventions.md` | **Consolidate into `.claude/CLAUDE.md`** — workspace-specific naming conventions |
| `pdf-scale.md` | **Embedded in `processing-pdfs` SKILL.md** — only relevant during PDF work |
| `state-validation.md` | **Embedded in every skill that writes state** — validation is the skill's responsibility, not a platform-loaded rule |

**PRIMA-managed rules** (added by the PRIMA Plugin):

| Rule | Cowork delivery |
|------|----------------|
| `workspace-identity.md` | **Embedded in skills that perform git operations or state writes** — the identity check must happen inside the skill |
| `state-validation.md` | **Embedded in every skill that writes state** — backup, validate, check required fields |
| `agent-output-persistence.md` | **Consolidate into `.claude/CLAUDE.md`** — applies across all agent-spawning work |
| `context-checkpoint.md` | **Consolidate into `.claude/CLAUDE.md`** — applies across all sessions |
| `prima-protection.md` | **Advisory note in `.claude/CLAUDE.md`** — no hook to enforce it |

### 1.5 `.claude/commands/` — Slash Commands

**Template commands:**

| Command | Purpose |
|---------|---------|
| `/day` | Daily briefing |
| `/night` | Session close |
| `/save` | Mid-session checkpoint |
| `/status` | Project status report |
| `/sync` | Git commit and push |
| `/resume` | Resume previous session |
| `/newproject` | Create new project |
| `/newclient` | Create new client |
| `/dashboard` | Visual project dashboard |
| `/install-pack` | Install PRIMA or add-on packs |
| `/setup` | Initial workspace configuration |
| `/update` | Engine update from upstream |

**In Cowork:** Commands do not exist. **Every command must be converted to a skill** in `.claude/skills/`.

Skills already support `/name` invocation in both Claude Code and Cowork. The conversion is:

1. Create `.claude/skills/[command-name]/SKILL.md`
2. Move the command content into the SKILL.md format (add frontmatter with `name`, `description`)
3. If the command referenced rules that auto-load in Claude Code, embed the relevant rule content in the SKILL.md or its `references/` folder
4. Delete the `.claude/commands/[command-name].md` (or keep it for Claude Code backwards compatibility)

**Engine-managed commands** (`/install-pack`, `/setup`, `/update`) need special consideration — these are infrastructure commands that may not make sense in Cowork if the engine-guard hook cannot protect files.

### 1.6 `.claude/agents/` — Subagent Definitions

**Template agents:** `document-processor.md`, `research.md`

**In Claude Code:** Named agent definitions loaded when the Agent tool is used with a matching agent name.

**In Cowork:** The Agent tool works (it is a tool, not a config file), but named definitions from `.claude/agents/` are not auto-discovered.

**Migration strategy:** Convert agent definitions to skills that spawn the agent with the right prompt. Example: instead of an `agents/research.md` definition file, create a `skills/research-agent/SKILL.md` that, when invoked, spawns an Agent with the research prompt and parameters from the original definition.

### 1.7 `.claude/settings.json` — Permissions and Hooks

**Template settings.json contains:**

```json
{
  "permissions": {
    "allow": ["Bash", "Edit", "Write", "Read", "Glob", "Grep", "WebFetch", "WebSearch", "Task", "Skill", "NotebookEdit"],
    "deny": [],
    "ask": []
  },
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [{ "type": "command", "command": "bash Infrastructure/Scripts/engine-guard.sh" }]
      },
      {
        "matcher": "Bash",
        "hooks": [{ "type": "command", "command": "bash Infrastructure/Scripts/safety-guard.sh" }]
      }
    ]
  }
}
```

**In Cowork:** Not read. No per-workspace permissions. No hooks.

**Impact:**

| Setting | Claude Code | Cowork | Mitigation |
|---------|------------|--------|------------|
| Permission allow list | Tools auto-allowed | Cowork has its own permission model (folder access grants) | None needed — Cowork handles this differently |
| `engine-guard.sh` hook | Prevents modification of engine-managed files | **Does not exist** | Add "do not modify engine files" as an instruction in Folder Instructions. Advisory only — not enforced. |
| `safety-guard.sh` hook | Blocks dangerous Bash commands | **Does not exist** | Add blocked commands list to Global Instructions. Advisory only. |

**This is the biggest parity gap.** In Claude Code, hooks guarantee that engine files cannot be modified and dangerous commands cannot run. In Cowork, these become instructions that Claude follows as guidance but nothing prevents violation. Accept this limitation.

### 1.8 `.claude/config/integrations.json`

**In Claude Code:** Loaded on demand by skills that need integration configuration (project ID format, cloud storage paths, etc.).

**In Cowork:** Same — on-demand reference. **No adaptation needed.** Skills read it explicitly.

### 1.9 `.claude/docs/` — Reference Documentation

**Template docs:** `available-automations.md`, `capabilities-reference.md`, `cloud-sync-warning.md`, `folder-structure.md`, `getting-started.md`, `glossary.md`

**In Claude Code:** On-demand reference. Not auto-loaded.

**In Cowork:** Same. **No adaptation needed.**

### 1.10 `.claude/engine-manifest.json` and `.claude/suite-registry.json`

**In Claude Code:** The engine manifest lists all engine-owned files. The `engine-guard.sh` hook reads it to block modifications. The suite registry lists PRIMA components for dependency checking.

**In Cowork:** The manifest file itself can exist, but the enforcement mechanism (engine-guard hook) does not. The suite registry is a reference file read on demand.

**Migration:** Keep both files in the Cowork workspace. The manifest serves as documentation of which files are engine-managed even without enforcement. The suite registry works as-is.

### 1.11 `.claude/state/` — Persistent State

**v2 structure:** `state.json` (index), `projects/P###.json` (detail), `tasks/P###.json` (tasks), `state.schema.json` (validation schema)

**In Claude Code:** Read and written by skills and commands explicitly. Not auto-loaded by the platform.

**In Cowork:** Same — read and written by skills explicitly. **No adaptation needed for the state architecture itself.** The v2 split storage works identically in both environments because it was already skill-driven.

**One difference:** In Claude Code, state writes must use `jq` via Bash because the CLI has hardcoded `.claude/` path protection blocking Edit/Write tools. Cowork has no such restriction. Standard file writes work. However, maintaining the `jq` pattern is recommended for cross-environment compatibility.

### 1.12 `.claude/skills/` — Reusable Skills

**Template skills:** `client-setup`, `copywriting`, `creating-presentations`, `creating-skills`, `documenting-workflows`, `drafting-documents`, `email-drafting`, `meeting-notes`, `processing-documents`, `processing-pdfs`, `processing-spreadsheets`, `search-engine-optimisation`, `status-report`

**In Cowork:** Skills work identically. `.claude/skills/` is the one directory that both Claude Code and Cowork read and handle the same way.

**No adaptation needed** for the skills directory itself. Individual skills may need updates if they reference commands (which do not exist in Cowork) or rely on rules being auto-loaded (which they are not).

### 1.13 Infrastructure Scripts

**Template scripts:** `engine-guard.sh`, `install-hooks.sh`, `pre-commit-hook.sh`, `safety-guard.sh`, `update-engine.sh` (in `Infrastructure/Scripts/`), plus PRIMA scripts `backup-state.sh`, `validate-state.sh` (in `Infrastructure/Scripts/prima/`)

**In Claude Code:** Called by hooks (`engine-guard.sh`, `safety-guard.sh`), by git hooks (`pre-commit-hook.sh`), or by commands/skills (`backup-state.sh`, `validate-state.sh`, `update-engine.sh`).

**In Cowork:**

| Script | Claude Code trigger | Cowork status |
|--------|-------------------|---------------|
| `engine-guard.sh` | PreToolUse hook on Edit/Write | **No trigger** — hook does not exist |
| `safety-guard.sh` | PreToolUse hook on Bash | **No trigger** — hook does not exist |
| `pre-commit-hook.sh` | Git pre-commit hook | **No trigger** — git hooks not installed |
| `install-hooks.sh` | Run during `/setup` | **Not applicable** — no hooks to install |
| `update-engine.sh` | Run by `/update` command | **Works** — can be called by a skill |
| `backup-state.sh` | Called by skills before state writes | **Works** — called by skills identically |
| `validate-state.sh` | Called by skills after state writes | **Works** — called by skills identically |

**Keep all scripts** in the Cowork workspace. The PRIMA scripts (`backup-state.sh`, `validate-state.sh`) and `update-engine.sh` work as-is. The hook-triggered scripts exist but have no trigger — they serve as documentation of what Claude Code enforces.

---

## 2. State Architecture — v2 Split Storage

### What changed

The single `state.json` file that held everything has been split into three tiers:

| Location | Contains | When to read |
|----------|----------|-------------|
| `.claude/state/state.json` | **Index only** — slim project fields + top-level metadata | Every skill that needs project data |
| `.claude/state/projects/P###.json` | **Project detail** — description, notes, stoppedAt, lastAction, pausedReason, sessionHistory, milestones, todos, recentWork | Only when working on that specific project |
| `.claude/state/tasks/P###.json` | **Task list** with dependencies | Only when managing tasks for that project |

### Why

The monolithic state.json grew to 100+ projects. Reading the entire file for every operation wasted context window budget. The split means most operations only read the slim index (a few KB), and detail files are loaded selectively.

### Index fields (per project in state.json):

```json
{
  "id": "P001",
  "name": "Project Name",
  "status": "in-progress",
  "priority": "medium",
  "category": "client",
  "tags": [],
  "created": "2026-02-24",
  "startDate": "2026-02-24",
  "dueDate": null,
  "lastWorked": "2026-02-24",
  "path": "Projects/P001 Project A",
  "companyName": null,
  "contacts": [],
  "taskCount": 0,
  "tasksDone": 0,
  "tasksBlocked": 0,
  "milestoneCount": 0,
  "milestonesDone": 0
}
```

### Detail fields (in `.claude/state/projects/P###.json`):

```json
{
  "id": "P001",
  "description": "",
  "notes": "",
  "stoppedAt": null,
  "lastAction": null,
  "pausedReason": null,
  "sessionHistory": [],
  "milestones": [],
  "todos": [],
  "recentWork": []
}
```

### Task files (in `.claude/state/tasks/P###.json`):

Optional — only create when a project has tasks.

```json
{
  "projectId": "P001",
  "tasks": [
    {
      "id": "T001",
      "title": "Task title",
      "status": "todo",
      "priority": "medium",
      "dependencies": [],
      "notes": ""
    }
  ]
}
```

### Top-level state.json fields:

```json
{
  "version": "2.0.0",
  "workspace": { ... },
  "nextProjectNumber": 8,
  "projects": [ ... ],
  "sessionHistory": [],
  "recentWork": [],
  "priorities": {
    "immediate": [],
    "thisWeek": [],
    "upcoming": []
  },
  "pendingItems": []
}
```

### Read/Write patterns

| Pattern | When | What to read |
|---------|------|-------------|
| **A: Index Only** | Portfolio overview, status reports | `.claude/state/state.json` only |
| **B: Index + Selective Detail** | Skills needing specific project info | Index + only the relevant `projects/P###.json` files |
| **C: Single Project Detail** | Working on one project | Index + that project's detail file + optionally its task file |

**Critical rule:** Never read all detail files. Filter from the index first.

**Write discipline:**
- Backup before every write (`Infrastructure/Scripts/prima/backup-state.sh`)
- Validate after every write (`Infrastructure/Scripts/prima/validate-state.sh`)
- Index and detail fields must not duplicate
- Task/milestone counts in the index are computed — recalculate from source on every relevant write

---

## 3. Workspace Folder Structure

The template workspace structure includes numbered department folders. The folder structure is identical between Claude Code and Cowork — the differences are in how `.claude/` contents are loaded, not in what exists on disk.

```
[companyname]-biz-os/
│
├── .claude/                        # Configuration root
│   ├── CLAUDE.md                  # Master instructions — read via Global Instructions directive
│   ├── FRAMEWORK.md               # Structural guidelines — read on demand by skills
│   │
│   ├── company/                   # Organisation knowledge — content goes in Global Instructions
│   │   ├── overview.md            #   Business description, products, market position
│   │   ├── voice.md               #   Brand voice and tone guidelines
│   │   ├── brand.md               #   Visual identity, colours, logos
│   │   ├── audiences.md           #   Target audience profiles
│   │   ├── team.md                #   Team structure and roles
│   │   └── industry.md            #   Industry context and terminology
│   │
│   ├── skills/                    # AUTO-DETECTED by Cowork — works identically
│   │   ├── copywriting/SKILL.md
│   │   ├── processing-pdfs/SKILL.md
│   │   ├── project-tracking/SKILL.md
│   │   ├── session-close/SKILL.md     # Converted from /night command
│   │   ├── session-briefing/SKILL.md  # Converted from /day command
│   │   ├── workspace-status/SKILL.md  # Converted from /status command
│   │   └── [other skills]/SKILL.md
│   │
│   ├── commands/                  # NOT read by Cowork — convert to skills
│   ├── agents/                    # NOT read by Cowork — wrap in skills
│   ├── rules/                     # NOT read by Cowork — consolidate into CLAUDE.md or skills
│   │
│   ├── state/                     # Persistent state — read/written by skills
│   │   ├── state.json             #   Project index (slim)
│   │   ├── state.schema.json      #   Validation schema
│   │   ├── projects/              #   Per-project detail files
│   │   │   ├── P001.json
│   │   │   ├── P004.json
│   │   │   └── ...
│   │   └── tasks/                 #   Per-project task files (optional)
│   │       ├── P004.json
│   │       └── ...
│   │
│   ├── config/                    # Integration config — read on demand by skills
│   │   └── integrations.json
│   ├── docs/                      # Reference docs — read on demand
│   │
│   ├── settings.json              # NOT read by Cowork (permissions, hooks)
│   ├── engine-manifest.json       # Engine file list — no enforcement in Cowork
│   └── suite-registry.json        # PRIMA component registry — read on demand
│
├── Projects/                       # AI Business OS projects (active)
│   ├── P001 Website Redesign/
│   │   ├── CLAUDE.md              #   Project-specific instructions and context
│   │   └── [project files]
│   ├── P004 Marketing Campaign/
│   │   ├── CLAUDE.md
│   │   └── [project files]
│   └── Workflows/                 #   Recurring processes
│
├── Clients/                        # Client work
│   ├── _Templates/                #   Client folder templates
│   └── Acme Corp/
│       └── P012 HR Policy/
│           ├── CLAUDE.md
│           └── [project files]
│
├── Archive/                        # Completed projects
│   └── P002 Old Project/
│       └── CLAUDE.md
│
├── Documentation/
│   ├── Templates/
│   └── Reports/
│
├── 01 Finance/                     # Department folders (optional)
│   └── CLAUDE.md                  #   Department-specific context
├── 02 Human Resources/
├── 03 Sales/
├── 04 Marketing/
├── 05 Operations/
├── 06 Products/
├── 07 Legal/
│
├── Infrastructure/
│   └── Scripts/                   # Engine and safety scripts
│       ├── engine-guard.sh        #   No trigger in Cowork (hook-dependent)
│       ├── safety-guard.sh        #   No trigger in Cowork (hook-dependent)
│       └── prima/
│           ├── backup-state.sh    #   Called by skills — works in Cowork
│           └── validate-state.sh  #   Called by skills — works in Cowork
│
└── Scripts/                        # PRIMA-managed scripts
```

### Key points for Cowork

- **Every project folder has a CLAUDE.md.** In Claude Code, these auto-load hierarchically. In Cowork, skills read the relevant project CLAUDE.md explicitly when working on that project.
- **The `.claude/state/` directory** contains all project state data. Skills read and write these files directly — the platform does not auto-load them in either environment.
- **Department folders** (01–07) are optional. Each can have its own CLAUDE.md with department-specific context (e.g., financial terminology, HR policies). Skills read these on demand.
- **The `commands/`, `agents/`, and `rules/` directories** still exist on disk for Claude Code compatibility. Cowork ignores them. Their content has been migrated to skills, Global Instructions, or `.claude/CLAUDE.md`.

### Workspace structure creation

In Claude Code, users clone the template repo — the folder structure comes with it. In Cowork, the user may be starting from a bare folder or from an existing workspace that needs restructuring.

**The `/setup` skill must create or verify the folder structure.** When run in Cowork, it should:

1. **Check which top-level folders exist** and create any that are missing:
   - `Projects/`, `Archive/`, `Clients/`, `Documentation/`, `Documentation/Templates/`, `Documentation/Reports/`, `Infrastructure/`, `Infrastructure/Scripts/`, `Scripts/`
   - Department folders (`01 Finance/` through `07 Legal/`) — ask the user which ones they need
2. **Check which `.claude/` directories exist** and create any that are missing:
   - `.claude/skills/`, `.claude/state/`, `.claude/state/projects/`, `.claude/company/`, `.claude/config/`, `.claude/docs/`
3. **Create governance files** where missing:
   - `.claude/CLAUDE.md` — populated from template or from the setup wizard answers
   - `.claude/FRAMEWORK.md` — copied from template
   - `.claude/state/state.json` — initialised with workspace identity and empty project list
   - `.claude/company/` files — populated from setup wizard answers
   - `.claude/config/integrations.json` — populated from setup wizard answers
   - Department CLAUDE.md files — created with placeholder content for each department folder
4. **Copy skills** from the template into `.claude/skills/` if not already present — including all converted command-to-skill files
5. **Copy infrastructure scripts** (`backup-state.sh`, `validate-state.sh`) into `Infrastructure/Scripts/prima/` if not already present

The setup skill should be idempotent — safe to re-run. It creates what is missing and leaves existing files untouched (with a warning if it detects differences from the template).

**For Cowork specifically**, the setup skill should also output the exact text for the user to paste into:
- **Profile Preferences** (Settings > Profile)
- **Global Instructions** (Settings > Cowork)

And provide instructions for setting up **scheduled tasks**:
- **Session briefing** — morning schedule, description of what it should do
- **Session close** — evening schedule, description of what it should do

These scheduled tasks replace the manual `/day` and `/night` workflow from Claude Code and ensure session continuity is maintained automatically.

These are one-time manual steps that cannot be automated — Cowork does not expose an API for writing its own settings. The skill outputs the text; the user pastes it.

---

## 4. Validation Rules

Unchanged between environments:

- Backup before every state write
- Validate JSON syntax after every write
- Project IDs: P001-P999, 3 digits zero-padded, sequential, never reused
- Valid statuses: `in-progress`, `paused`, `overdue`, `archived`
- `pausedReason` required when status is `paused`, null otherwise
- Duplicate detection before creating any new project (search all including archived)
- Session history caps: 20 entries per project, 20 entries top-level

---

## 5. Migration Checklist

### Phase 1: State architecture (file structure)

1. [ ] Create `.claude/state/` directory (`.claude/` already exists if skills are installed)
2. [ ] Create `.claude/state/projects/` directory
3. [ ] For each project in current `state.json`:
   - Extract detail fields to `.claude/state/projects/P###.json`
   - Remove detail fields from the project's index entry
   - Add new index fields: `startDate`, `taskCount`, `tasksDone`, `tasksBlocked`, `milestoneCount`, `milestonesDone`
4. [ ] Add top-level fields to state.json: `sessionHistory`, `recentWork`, `priorities`, `pendingItems`
5. [ ] Set `version` to `"2.0.0"`
6. [ ] Move `state.json` to `.claude/state/state.json`
7. [ ] Delete old `state.json` from workspace root (or archive it)
8. [ ] Validate all JSON files after migration

### Phase 2: Skills (convert commands, update paths)

9. [ ] Convert all `.claude/commands/` to `.claude/skills/` — each command becomes a SKILL.md
10. [ ] Update all skills that reference `state.json` at root to use `.claude/state/state.json`
11. [ ] Update skill read patterns to use selective detail loading
12. [ ] Convert `.claude/agents/` definitions to skills that spawn agents
13. [ ] Verify core skills work with v2: session-close, session-briefing, workspace-status, project-tracking, session-checkpoint

### Phase 3: Instruction layers setup

14. [ ] Set up **Profile Preferences** (Settings > Profile) — personal name, role, communication style (UK English, direct tone, no sycophancy)
15. [ ] Set up **Global Instructions** (Settings > Cowork) — company identity (from `.claude/company/`), brand voice, audiences, universal rules (autonomy-levels, blocked-commands, checkpoint-protocol), and the workspace bootstrap directive (read `.claude/CLAUDE.md` at task start, read project CLAUDE.md when working on a specific AI Business OS project)
16. [ ] Consolidate workspace-specific rules into `.claude/CLAUDE.md` (content-defaults, file-conventions, agent-output-persistence, context-checkpoint)
17. [ ] Embed skill-specific rules in the relevant SKILL.md files (pdf-scale → processing-pdfs, state-validation → every state-writing skill, workspace-identity → every git/state skill)
18. [ ] Add engine-protection and prima-protection as advisory notes in `.claude/CLAUDE.md`
19. [ ] Do NOT create Cowork Projects — all project management through AI Business OS skills

### Phase 4: PRIMA Plugin adaptation

19. [ ] Convert all 9 PRIMA commands to skills (`/day`, `/night`, `/status`, `/sync`, `/resume`, `/newproject`, `/dashboard`, `/timeline`, `/setup`)
20. [ ] Embed `state-validation.md` content in every skill that writes state
21. [ ] Embed `workspace-identity.md` content in every skill that performs git operations or state writes
22. [ ] Consolidate `context-checkpoint.md` and `agent-output-persistence.md` into `.claude/CLAUDE.md`
23. [ ] Add `prima-protection.md` as advisory note in `.claude/CLAUDE.md` (no hook enforcement)
24. [ ] Verify `backup-state.sh` and `validate-state.sh` work when called from Cowork skills

### Phase 5: Scheduled tasks (session lifecycle)

25. [ ] Set up **session briefing** scheduled task — morning, reads state.json, shows priorities and where work stopped
26. [ ] Set up **session close** scheduled task — evening, writes `stoppedAt`/`lastAction`/`sessionHistory` to state.json
27. [ ] Optionally set up recurring status/stale project checks

### Phase 6: MCP server installation

28. [ ] Install **PRIMA CRM** as custom extension (Settings > Extensions) — full functionality in Cowork
29. [ ] Optionally install **PRIMA Memory** as custom extension — can search Claude Code sessions from Cowork, but cannot search Cowork's own sessions (IndexedDB, not accessible)
30. [ ] Document that Cowork session continuity relies on `stoppedAt`/`lastAction`/`sessionHistory` in state.json — written by the session-close scheduled task
31. [ ] Verify session-close skill writes state correctly when run via scheduled task

### Phase 7: Verification

32. [ ] Test session-briefing scheduled task fires and reads state correctly
33. [ ] Test session-close scheduled task fires and writes state correctly
34. [ ] Test state read/write cycle (create project, update, read back)
35. [ ] Test skill invocation (invoke 2-3 skills via `/name`)
36. [ ] Confirm company knowledge from Global Instructions is applied
37. [ ] Confirm `.claude/CLAUDE.md` is read at task start (via Global Instructions directive)
38. [ ] Test project-level CLAUDE.md is read when working on a specific project
39. [ ] Document accepted limitations (Sections 6 and 7 of this document)

---

## 6. Permanent Divergences (Accepted Limitations)

These are platform differences that will persist. They are not migration gaps.

| Capability | Claude Code | Cowork | Impact |
|------------|------------|--------|--------|
| **Hooks** | Shell scripts on PreToolUse, PostToolUse, Stop, PreCompact events | Not supported | Engine protection and safety guards are advisory only |
| **Permission enforcement** | `settings.json` allow/deny lists | Not supported | Blocked commands are guidance, not enforced |
| **Engine-guard** | Hook prevents modification of engine-managed files | Not supported | Engine files can be accidentally modified |
| **Path-gated rules** | `paths:` frontmatter triggers rules for matching files | Not supported | Rules load always (via instructions) or per-skill |
| **Git hooks** | Pre-commit validation via `pre-commit-hook.sh` | Not supported | No pre-commit validation |
| **Worktrees** | Subagent isolation via git worktrees | Not supported | Parallel agents share the same file tree |
| **MCP per-workspace** | `.mcp.json` in project root | App-level connectors only | Cannot vary MCP servers by workspace |
| **Auto-memory** | `.claude/auto-memory/` | Cowork has its own per-project memory | Different memory system |
| **Commands** | `.claude/commands/*.md` | Not supported | Must use skills instead |
| **Named agents** | `.claude/agents/*.md` | Not supported | Must wrap in skills or use Agent tool directly |
| **PRIMA Memory** | MCP server reading `~/.claude/projects/` session logs | MCP server can run, but Cowork sessions are in IndexedDB — not readable | Can search Claude Code sessions from Cowork, but not Cowork's own sessions |
| **MCP per-workspace config** | `.mcp.json` in project root, auto-loaded | Settings > Extensions, installed manually per app | Same servers available, different registration mechanism |

---

## 7. PRIMA Suite Components in Cowork

The AI Business OS has four PRIMA suite components listed in `suite-registry.json`. Each has different Cowork compatibility.

### 7.1 PRIMA Plugin (Project Management)

**What it provides:** Commands (`/day`, `/night`, `/status`, `/sync`, `/resume`, `/newproject`, `/dashboard`, `/timeline`, `/setup`), one skill (`project-tracking`), five rules (`state-validation`, `workspace-identity`, `agent-output-persistence`, `context-checkpoint`, `prima-protection`), state schema, and validation/backup scripts.

**Distribution:** File-copy install — files from the `prima-manifest.json` `workspaceFiles` mapping are copied into the workspace `.claude/` directory.

**Cowork compatibility:**

| PRIMA Plugin Component | Claude Code | Cowork |
|------------------------|------------|--------|
| **Commands** (9 commands in `.claude/commands/`) | Auto-detected as slash commands | **Not read.** Must be converted to skills. |
| **Skill** (`project-tracking`) | Works | **Works** — skills are shared |
| **Rules** (5 rules in `.claude/rules/`) | Auto-loaded every session | **Not read.** Must be delivered via instructions or embedded in skills. |
| **Scripts** (`backup-state.sh`, `validate-state.sh`, `migrate-to-prima.sh`) | Called by commands/skills | **Works** — called by skills identically |
| **State schema** (`state.schema.json`) | Used by `validate-state.sh` | **Works** — same validation path |

**Migration work for Cowork:**

1. **Convert all 9 PRIMA commands to skills.** Each command file (e.g., `.claude/commands/night.md`) becomes a skill (e.g., `.claude/skills/night/SKILL.md`). The content is the same; the delivery mechanism changes.
2. **Embed operational rules in skills.** `state-validation.md` content must be embedded in every skill that writes state (session-close, project-tracking, newproject, etc.). `workspace-identity.md` must be embedded in every skill that performs git operations or state writes — the identity check cannot rely on platform auto-loading.
3. **Consolidate behavioural rules into `.claude/CLAUDE.md`.** `context-checkpoint.md` and `agent-output-persistence.md` apply across all sessions and go into the workspace CLAUDE.md. `prima-protection.md` becomes an advisory note in CLAUDE.md (no hook to enforce it).
4. **Scripts work as-is.** No changes needed.

### 7.2 PRIMA Memory (Session Recall)

**What it provides:** An MCP server with three tools — `search_history`, `get_recent_sessions`, `get_session_details` — for searching and recalling past Claude Code sessions.

**Distribution:** MCP server installed at `.claude/mcp-servers/prima-memory/`, registered in `.mcp.json`.

**How it works:** PRIMA Memory reads Claude Code's conversation logs stored as `.jsonl` files in `~/.claude/projects/`. It parses these logs, indexes them in a SQLite database at `{workspace}/.prima-memory/index.db`, and provides keyword and semantic search across session history.

**Cowork compatibility: MCP server can run, but data source is wrong.**

Cowork supports local MCP servers via Settings > Extensions. PRIMA Memory can be installed and its tools (`search_history`, `get_recent_sessions`, `get_session_details`) will be available. However:

| Aspect | Claude Code | Cowork |
|--------|------------|--------|
| **MCP server** | Registered in `.mcp.json` | Installed via Settings > Extensions | 
| **Server execution** | Launches Node.js process | Same — Cowork includes built-in Node.js |
| **Session storage** | `.jsonl` files in `~/.claude/projects/` | Cowork stores sessions in internal IndexedDB — not as files |
| **Can PRIMA Memory read sessions?** | Yes — reads `.jsonl` files directly | **No** — IndexedDB is not accessible to external tools |

**The core problem is the data source, not the MCP capability.** PRIMA Memory reads `~/.claude/projects/` — Claude Code's session log directory. Cowork does not write to this directory. Cowork stores sessions in a binary IndexedDB database inside the app. There is no file path, no API, and no export mechanism. Even with the MCP server running in Cowork, there are no Cowork sessions for it to search.

**What PRIMA Memory CAN do in Cowork:** If the user also runs Claude Code on the same workspace, PRIMA Memory in Cowork can search Claude Code session history. This provides cross-environment recall — Cowork can find what was done in Claude Code. But it cannot find what was done in Cowork itself.

**Cowork alternatives for session continuity:**

| Need | Claude Code + PRIMA Memory | Cowork (without PRIMA Memory) |
|------|---------------------------|-------------------------------|
| Resume previous session | `search_history` + `get_session_details` | `stoppedAt` and `lastAction` in state.json (written by session-close skill) |
| Search past decisions | `search_history` with keywords | `sessionHistory` array in state.json (date + summary only — no full transcript search) |
| Session handoff | `/night` writes `stoppedAt` to state.json | Session-close skill writes `stoppedAt` to state.json (same) |
| Cross-session context | Full `.jsonl` transcript recovery | Cowork's native session memory (app-level, not searchable by skills) |

**Recommendation:** PRIMA Memory does not port to Cowork. Accept this as a permanent divergence. Session continuity is maintained by:

1. **Scheduled session-close task** (evening) — automatically writes `stoppedAt`/`lastAction`/`sessionHistory` to state.json, even if the user forgets
2. **Scheduled session-briefing task** (morning) — reads state.json and presents where each project was left, so the user sees context before starting work
3. **`sessionHistory` array** in state.json — date + summary log of recent sessions (cap 20)

What is permanently lost is the ability to search full conversation transcripts across sessions. Cowork stores sessions in an internal IndexedDB database that is not accessible to external tools. There is no file path, no API, and no export mechanism.

### 7.3 PRIMA CRM

**What it provides:** Client relationship management MCP server with contact, interaction, and pipeline tracking.

**Distribution:** MCP server installed at `.claude/mcp-servers/prima-crm/`, registered in `.mcp.json`.

**Cowork compatibility: Full.** PRIMA CRM reads and writes to `.prima-crm/` in the workspace directory. It has no dependency on Claude Code session logs or any Claude Code-specific data source. Cowork supports local MCP servers via Settings > Extensions, so the CRM tools are available.

**Installation in Cowork:** Install via Settings > Extensions (custom extension). The server runs as a Node.js process — Cowork includes a built-in Node.js environment. CRM data is stored in workspace files, so it syncs via git like everything else.

### 7.4 PRIMA Dashboard

**Status:** Prototype. Uses mock data. Not integrated with live state.json.

**Cowork compatibility:** Standalone Next.js app — not dependent on Claude Code or Cowork. The PRIMA Plugin's `/dashboard` command (which generates an HTML dashboard from state.json) works in both environments when converted to a skill.

---

## 8. What Transfers Directly (No Adaptation)

| Component | Why it works |
|-----------|-------------|
| `.claude/skills/` | Both environments auto-detect and invoke skills |
| `.claude/company/` | On-demand reference — skills read explicitly |
| `.claude/config/` | On-demand reference — skills read explicitly |
| `.claude/docs/` | On-demand reference — skills read explicitly |
| `.claude/state/` | On-demand read/write — skills manage explicitly |
| `.claude/FRAMEWORK.md` | On-demand reference — same in both |
| `Infrastructure/Scripts/prima/` | Called by skills — same in both |
| `engine-manifest.json` | Reference file — works as documentation |
| `suite-registry.json` | Reference file — works as documentation |
| Workspace folder structure | File system — identical |
| Project governance (per-folder CLAUDE.md) | Convention — not platform-dependent |
| PRIMA Plugin `project-tracking` skill | Skill — works in both |
| PRIMA Plugin validation/backup scripts | Called by skills — same in both |
